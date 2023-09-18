

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS panel_image_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS thumbnail1_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS thumbnail2_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS thumbnail3_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS detailImage1_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS detailImage2_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS detailImage3_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS floor_plan_image_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS perspective_drawing_image1_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS perspective_drawing_image2_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS perspective_drawing_image3_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document1_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document2_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document3_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document4_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document5_org varchar;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS expected_schedule_image_org varchar;
