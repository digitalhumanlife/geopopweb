create user groundcontrol ENCRYPTED PASSWORD 'zLRsVEFeVZGM7H7CDCnkCxEw';
alter role groundcontrol ENCRYPTED PASSWORD 'zLRsVEFeVZGM7H7CDCnkCxEw';

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id serial NOT NULL,
	email text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	activated bool NOT NULL DEFAULT true,
	activate_token varchar NULL,
	forgot_token varchar NULL,
	first_name varchar NULL,
	last_name varchar NULL,
	contact varchar NULL,
	address varchar NULL,
	avatar varchar NULL,
	CONSTRAINT user_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX user_email_unique ON public.users USING btree (email);
ALTER TABLE users OWNER TO groundcontrol;

DROP TABLE IF EXISTS p2p_request;
CREATE TABLE p2p_request (
	id serial NOT NULL,
	data text NOT NULL,
	status text NOT NULL,
	CONSTRAINT p2p_request_pkey PRIMARY KEY (id)
);
ALTER TABLE p2p_request OWNER TO groundcontrol;

CREATE TABLE audit_logs (
	id serial NOT NULL,
	user_id int8 NOT NULL,
	event_id text NOT NULL,
	"data" text NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	pre_data text NULL,
	post_data text NULL,
	admin_id int8 NOT NULL,
	CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);

ALTER TABLE audit_logs OWNER TO groundcontrol;

ALTER TABLE public.users DROP COLUMN first_name;
ALTER TABLE public.users DROP COLUMN last_name;
ALTER TABLE public.users DROP COLUMN contact;
ALTER TABLE public.users DROP COLUMN address;
ALTER TABLE public.users DROP COLUMN avatar;
ALTER TABLE public.users ADD "name" varchar NULL;
ALTER TABLE public.users ADD "day" varchar NULL;
ALTER TABLE public.users ADD "month" varchar NULL;
ALTER TABLE public.users ADD "year" varchar NULL;
ALTER TABLE public.users ADD gender varchar NULL;
ALTER TABLE public.users ADD phone1 varchar NULL;
ALTER TABLE public.users ADD phone2 varchar NULL;
ALTER TABLE public.users ADD phone3 varchar NULL;
ALTER TABLE public.users ADD "user_id" varchar NULL;

CREATE TABLE qnas (
	id serial NOT NULL,
	name text NOT NULL,
	email text NOT NULL,
	domain text NOT NULL,
	phone1 text NOT NULL,
	phone2 text NOT NULL,
	phone3 text NOT NULL,
	title text NOT NULL,
	content text NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT qnas_pkey PRIMARY KEY (id)
);

ALTER TABLE qnas OWNER TO groundcontrol;

CREATE TABLE user_investments (
	id serial NOT NULL,
	invest_id text NOT NULL,
	title text NOT NULL,
	process_percent double precision NOT NULL,
	amount int8 NOT NULL,
	min_value int8 NOT NULL,
	max_value int8 NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT user_investments_pkey PRIMARY KEY (id)
);

ALTER TABLE user_investments OWNER TO groundcontrol;

CREATE TABLE investments (
	id serial NOT NULL,
	invest_id text NOT NULL,
	title text NOT NULL,
	invest_time text NOT NULL,
	profit double precision NOT NULL,
	time_code text NOT NULL,
	min_invest int8 NOT NULL,
	max_invest int8 NOT NULL,
	current_invest int8 NOT NULL,
	start_date timestamptz NOT NULL DEFAULT now(),
	end_date timestamptz NOT NULL DEFAULT now(),
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT investments_pkey PRIMARY KEY (id)
);

ALTER TABLE investments OWNER TO groundcontrol;

ALTER TABLE public.investments ADD recruitment_amount varchar NULL;
ALTER TABLE public.investments ADD won_per_account int8 NULL;
ALTER TABLE public.investments ADD total_account int8 NULL;
ALTER TABLE public.user_investments ADD investment_id int8 NULL;
ALTER TABLE public.user_investments ADD sign_name varchar NULL;

CREATE TABLE bookmarks (
	id serial NOT NULL,
	user_id int8 NOT NULL,
	investment_id int8 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT bookmarks_pkey PRIMARY KEY (id)
);

ALTER TABLE bookmarks OWNER TO groundcontrol;

ALTER TABLE public.investments DROP COLUMN time_code;
ALTER TABLE public.investments DROP COLUMN min_invest;
ALTER TABLE public.investments DROP COLUMN total_account;

ALTER TABLE public.user_investments DROP COLUMN min_value;
ALTER TABLE public.user_investments DROP COLUMN max_value;

CREATE TABLE notices (
	id serial NOT NULL,
	title text NOT NULL,
	content text NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT notices_pkey PRIMARY KEY (id)
);

ALTER TABLE notices OWNER TO groundcontrol;

ALTER TABLE public.investments ADD status varchar NOT NULL DEFAULT '모집';
ALTER TABLE public.user_investments ADD paid_status varchar NOT NULL DEFAULT '';

ALTER TABLE public.users ADD sms_send_agree bool NOT NULL DEFAULT false;
ALTER TABLE public.users ADD email_send_agree bool NOT NULL DEFAULT false;

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
-- 법인회원에 대한 관리자 승인 여부 필드 추가
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS business_confirm boolean;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS file_name varchar;

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

create table leaved_users
(
    id               serial NOT NULL,
    user_seq         integer not null,
    email            text                                                    not null,
    password         text                                                    not null,
    role             text                                                    not null,
    created_at       timestamp with time zone                                not null,
    leaved_at        timestamp with time zone                                not null default now(),
    activated        boolean                                                 not null,
    activate_token   varchar,
    forgot_token     varchar,
    name             varchar,
    day              varchar,
    month            varchar,
    year             varchar,
    gender           varchar,
    phone1           varchar,
    phone2           varchar,
    phone3           varchar,
    user_id          varchar,
    ci               varchar,
    sms_send_agree   boolean      default false                              not null,
    email_send_agree boolean      default false                              not null,
    business_confirm boolean,
    address          text,
    type             varchar(255) default 'individual'::character varying    not null,
    file             varchar,
    business_number  varchar,
    company_name     varchar,
    file_name        varchar
);



ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS investment_id int8; -- 상품별 공지

create table notification
(
    id               serial NOT NULL,
    user_id         integer not null,
    investment_id    integer not null,
    type             varchar,
    to_target        varchar,
    created_at       timestamp with time zone                                not null default now(),
    disabled_at      timestamp with time zone
);

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS expected_schedule_image varchar; -- 예상 일정 이미지

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address_detail text; -- 상세주소
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS address_detail text; -- 상세주소

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document4 varchar; -- 개인정보이용동의 PDF 파일 1
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS document5 varchar; -- 개인정보이용동의 PDF 파일 2

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS business_type varchar not null default '일반'; -- LH // 토지사업 // 일반사업 구분
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS recruitment_complete boolean not null default false; -- 결성완료 여부

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS account_holder varchar; -- 예금주
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS bank_name varchar; -- 입금 은행명
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS bank_account varchar; -- 입금 계좌번호

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bank_name varchar;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_num varchar; -- 계좌번호
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bankbook varchar; -- 통장사본
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS id_card varchar; -- 신분증사본

CREATE UNIQUE INDEX user_investments_investmentid_userid_idx ON user_investments (investment_id, created_by, paid_status);


create table banner
(
    id               serial NOT NULL,
    created_at       timestamp with time zone                                not null default now(),
    updated_at       timestamp with time zone                                not null default now(),
    disabled_at      timestamp with time zone,
    description      varchar,
    image            varchar,
    priority         integer
);

ALTER TABLE public.investments ALTER COLUMN business_type set default '분양';

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ not null DEFAULT now();
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS disabled_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_document varchar;

ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS bank_name varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS account_num varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS bankbook varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS id_card varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS auth_document varchar;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS register_certified varchar;
ALTER TABLE public.leaved_users ADD COLUMN IF NOT EXISTS register_certified varchar;

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