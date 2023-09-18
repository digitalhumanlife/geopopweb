
-- Users 테이블에 주소 필드 추가
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS  address text;

-- Users 테이블에 법인/개인 구분을 위한 타입 필드 추가
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS type VARCHAR(255) NOT NULL DEFAULT 'individual';

-- 사업자 등록증 pdf 파일 필드 추가
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS file varchar;

-- 사업자 등록 번호 필드 추가
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS business_number varchar;

-- 법인명 필드 추가
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_name varchar;
