
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address_detail text; -- 상세주소
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS address_detail text; -- 상세주소
