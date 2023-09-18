-- ALTER TABLE public.investments drop column IF EXISTS business_type;
-- ALTER TABLE public.investments drop column IF EXISTS recruitment_complete;

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS business_type varchar not null default '일반'; -- LH // 토지사업 // 일반사업 구분
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS recruitment_complete boolean not null default false; -- 결성완료 여부
