
-- 법인회원에 대한 관리자 승인 여부 필드 추가
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS business_confirm boolean;
