
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS register_certified varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS register_certified varchar;