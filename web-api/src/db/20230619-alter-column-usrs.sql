
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_document varchar;


ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS bank_name varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS account_num varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS bankbook varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS id_card varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS auth_document varchar;