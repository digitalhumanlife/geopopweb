ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bank_name varchar;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_num varchar; -- 계좌번호
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bankbook varchar; -- 통장사본
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS id_card varchar; -- 신분증사본
