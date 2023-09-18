ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS account_holder varchar; -- 예금주
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS bank_name varchar; -- 입금 은행명
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS bank_account varchar; -- 입금 계좌번호

