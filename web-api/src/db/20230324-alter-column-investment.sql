
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document4 varchar; -- 개인정보이용동의 PDF 파일 1
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document5 varchar; -- 개인정보이용동의 PDF 파일 2