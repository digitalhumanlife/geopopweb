
-- 법인회원에 대한 관리자 승인 여부 필드 추가
-- 프론트에 하드코딩 될 수 있으므로 일단 반영하지 않음
-- ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS bank varchar;
-- ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS bank_account varchar;
-- ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS bank_account_owner_name varchar;

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS detailimage3 varchar; -- 상품 이미지 3번째

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS detail_description text; -- 상품 어필 내용

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS business_information text; -- 사업정보 내용

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS address text; -- 주소

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS business_overview text; -- 사업개요 내용

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS floor_plan_image varchar; -- 평면도 이미지

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS perspective_drawing_image1 varchar; -- 투시도 이미지
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS perspective_drawing_image2 varchar; -- 투시도 이미지
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS perspective_drawing_image3 varchar; -- 투시도 이미지

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS business_analysis text; -- 개략 사업 수지 분석

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS related_trust_company varchar; -- 연관 신탁회사
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS related_bank varchar; -- 연관 은행
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS related_accounting varchar; -- 연관 회계
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS related_legal_affairs varchar; -- 연관 법무

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS related_appraisal varchar; -- 연관 감정평가사

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS panel_image varchar; -- 최상단 패널(배경) 이미지

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS product_appeal text; -- 상품 어필

ALTER TABLE public.investments DROP COLUMN IF EXISTS related_bank; -- 연관 은행
ALTER TABLE public.investments DROP COLUMN IF EXISTS perspective_drawing_image;


