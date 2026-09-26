create extension if not exists "pgcrypto";

create table public.stokvels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contribution_amount numeric not null default 0,
  frequency text not null default 'Monthly',
  payout_cycle text not null default 'December',
  monthly_target numeric not null default 0,
  balance numeric not null default 0,
  next_contribution date,
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now()
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  stokvel_id uuid references public.stokvels(id) on delete cascade not null,
  name text not null,
  phone text,
  email text,
  role text not null default 'member' check (role in ('admin','treasurer','member')),
  joined date not null default now(),
  total_contributed numeric not null default 0
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade not null,
  stokvel_id uuid references public.stokvels(id) on delete cascade not null,
  amount numeric not null,
  method text not null default 'EFT' check (method in ('EFT','Cash','Card','Mobile')),
  reference text,
  date date not null default now(),
  receipt_image_url text,
  verdict text check (verdict in ('genuine','suspicious','fake','not_a_receipt')),
  confidence numeric,
  red_flags text[],
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  created_at timestamptz not null default now()
);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade not null,
  amount numeric not null,
  remaining numeric not null,
  interest numeric not null,
  months_left int not null,
  total_months int not null,
  status text not null check (status in ('Active','Paid','Pending')),
  due_date date not null
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  stokvel_id uuid references public.stokvels(id) on delete cascade not null,
  member_id uuid references public.members(id) on delete set null,
  type text not null check (type in ('Contribution','Loan Repayment','Loan Disbursement','Withdrawal','Fee')),
  amount numeric not null,
  balance_after numeric not null,
  date timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null check (type in ('info','success','warning')),
  read boolean not null default false,
  date timestamptz not null default now()
);

grant select, insert, update, delete on public.stokvels, public.members, public.contributions, public.loans, public.transactions, public.notifications to authenticated;
grant all on public.stokvels, public.members, public.contributions, public.loans, public.transactions, public.notifications to service_role;

alter table public.stokvels enable row level security;
alter table public.members enable row level security;
alter table public.contributions enable row level security;
alter table public.loans enable row level security;
alter table public.transactions enable row level security;
alter table public.notifications enable row level security;

create or replace function public.is_stokvel_member(_stokvel uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where stokvel_id = _stokvel and auth_user_id = auth.uid())
$$;

create or replace function public.is_stokvel_admin(_stokvel uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where stokvel_id = _stokvel and auth_user_id = auth.uid() and role in ('admin','treasurer'))
$$;

create or replace function public.member_stokvel(_member uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select stokvel_id from public.members where id = _member
$$;

-- Create a stokvel and make the creator its admin
create or replace function public.create_stokvel(_name text, _amount numeric, _target numeric, _member_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare sid uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  insert into public.stokvels (name, contribution_amount, monthly_target, created_by, next_contribution)
  values (_name, _amount, _target, auth.uid(), (date_trunc('month', now()) + interval '1 month')::date)
  returning id into sid;
  insert into public.members (auth_user_id, stokvel_id, name, email, role)
  values (auth.uid(), sid, _member_name, (select email from auth.users where id = auth.uid()), 'admin');
  return sid;
end $$;

-- Admin confirms a contribution: updates balance, member total, and ledger
create or replace function public.confirm_contribution(_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare c public.contributions; newbal numeric;
begin
  select * into c from public.contributions where id = _id;
  if c.id is null or not public.is_stokvel_admin(c.stokvel_id) then raise exception 'Not allowed'; end if;
  if c.status <> 'pending' then return; end if;
  update public.contributions set status = 'confirmed' where id = _id;
  update public.stokvels set balance = balance + c.amount where id = c.stokvel_id returning balance into newbal;
  update public.members set total_contributed = total_contributed + c.amount where id = c.member_id;
  insert into public.transactions (stokvel_id, member_id, type, amount, balance_after) values (c.stokvel_id, c.member_id, 'Contribution', c.amount, newbal);
end $$;

-- stokvels
create policy "Members view their stokvel" on public.stokvels for select to authenticated using (public.is_stokvel_member(id) or created_by = auth.uid());
create policy "Admins update stokvel" on public.stokvels for update to authenticated using (public.is_stokvel_admin(id));

-- members
create policy "Members view group members" on public.members for select to authenticated using (public.is_stokvel_member(stokvel_id));
create policy "Admins add members" on public.members for insert to authenticated with check (public.is_stokvel_admin(stokvel_id));
create policy "Admins edit members" on public.members for update to authenticated using (public.is_stokvel_admin(stokvel_id));
create policy "Admins remove members" on public.members for delete to authenticated using (public.is_stokvel_admin(stokvel_id));

-- contributions
create policy "Members view group contributions" on public.contributions for select to authenticated using (public.is_stokvel_member(stokvel_id));
create policy "Members submit own contribution" on public.contributions for insert to authenticated
  with check (status = 'pending' and exists (select 1 from public.members m where m.id = member_id and m.stokvel_id = contributions.stokvel_id and m.auth_user_id = auth.uid()));
create policy "Admins update contributions" on public.contributions for update to authenticated using (public.is_stokvel_admin(stokvel_id));

-- loans
create policy "Members view group loans" on public.loans for select to authenticated using (public.is_stokvel_member(public.member_stokvel(member_id)));
create policy "Admins manage loans" on public.loans for all to authenticated using (public.is_stokvel_admin(public.member_stokvel(member_id))) with check (public.is_stokvel_admin(public.member_stokvel(member_id)));

-- transactions
create policy "Members view group transactions" on public.transactions for select to authenticated using (public.is_stokvel_member(stokvel_id));

-- notifications
create policy "Users view own notifications" on public.notifications for select to authenticated
  using (exists (select 1 from public.members m where m.id = member_id and m.auth_user_id = auth.uid()));
create policy "Users mark own notifications read" on public.notifications for update to authenticated
  using (exists (select 1 from public.members m where m.id = member_id and m.auth_user_id = auth.uid()));
