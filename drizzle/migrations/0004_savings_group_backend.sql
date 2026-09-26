ALTER TABLE public.stokvels ADD COLUMN IF NOT EXISTS target_amount numeric NOT NULL DEFAULT 0;
ALTER TABLE public.stokvels ADD COLUMN IF NOT EXISTS timeframe_months integer NOT NULL DEFAULT 12;
ALTER TABLE public.stokvels ADD COLUMN IF NOT EXISTS target_date date;
ALTER TABLE public.contributions ADD COLUMN IF NOT EXISTS verification jsonb;

CREATE OR REPLACE FUNCTION public.create_savings_group(_name text, _target numeric, _timeframe_months integer, _contribution numeric, _member_name text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
declare sid uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if coalesce(trim(_name),'') = '' then raise exception 'Name required'; end if;
  if _target is null or _target <= 0 then raise exception 'Target must be positive'; end if;
  if _timeframe_months is null or _timeframe_months < 1 or _timeframe_months > 120 then raise exception 'Timeframe must be 1-120 months'; end if;
  insert into stokvels (name, contribution_amount, monthly_target, target_amount, timeframe_months, target_date, created_by, next_contribution)
  values (trim(_name), coalesce(_contribution,0), round(_target / _timeframe_months, 2), _target, _timeframe_months,
          (now() + make_interval(months => _timeframe_months))::date, auth.uid(),
          (date_trunc('month', now()) + interval '1 month')::date)
  returning id into sid;
  insert into members (auth_user_id, stokvel_id, name, email, role)
  values (auth.uid(), sid, coalesce(nullif(trim(_member_name),''),'Admin'), (select email from auth.users where id = auth.uid()), 'admin');
  return sid;
end $$;
REVOKE ALL ON FUNCTION public.create_savings_group(text, numeric, integer, numeric, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_savings_group(text, numeric, integer, numeric, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.auto_confirm_contribution(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
declare c contributions; newbal numeric;
begin
  select * into c from contributions where id = _id for update;
  if c.id is null or c.status <> 'pending' then return; end if;
  update contributions set status = 'confirmed' where id = _id;
  update stokvels set balance = balance + c.amount where id = c.stokvel_id returning balance into newbal;
  update members set total_contributed = total_contributed + c.amount where id = c.member_id;
  insert into transactions (stokvel_id, member_id, type, amount, balance_after) values (c.stokvel_id, c.member_id, 'Contribution', c.amount, newbal);
end $$;
REVOKE ALL ON FUNCTION public.auto_confirm_contribution(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.auto_confirm_contribution(uuid) TO service_role;