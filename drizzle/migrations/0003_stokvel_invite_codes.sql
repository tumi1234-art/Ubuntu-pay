ALTER TABLE public.stokvels ADD COLUMN IF NOT EXISTS invite_code text DEFAULT upper(substr(md5(gen_random_uuid()::text), 1, 6));
UPDATE public.stokvels SET invite_code = upper(substr(md5(gen_random_uuid()::text), 1, 6)) WHERE invite_code IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS stokvels_invite_code_key ON public.stokvels(invite_code);

CREATE OR REPLACE FUNCTION public.join_stokvel(_code text, _member_name text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _sid uuid; _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT id INTO _sid FROM stokvels WHERE invite_code = upper(trim(_code));
  IF _sid IS NULL THEN RAISE EXCEPTION 'Invite code not found'; END IF;
  IF EXISTS (SELECT 1 FROM members WHERE stokvel_id = _sid AND auth_user_id = _uid) THEN
    RAISE EXCEPTION 'You are already a member of this stokvel';
  END IF;
  INSERT INTO members (auth_user_id, stokvel_id, name, email, role)
  VALUES (_uid, _sid, coalesce(nullif(trim(_member_name), ''), 'Member'),
          (SELECT email FROM auth.users WHERE id = _uid), 'member');
  RETURN _sid;
END $$;
REVOKE ALL ON FUNCTION public.join_stokvel(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.join_stokvel(text, text) TO authenticated;