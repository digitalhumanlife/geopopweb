-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION groundcontrol;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.audit_logs_id_seq;

CREATE SEQUENCE public.audit_logs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.audit_logs_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.audit_logs_id_seq TO groundcontrol;

-- DROP SEQUENCE public.bookmarks_id_seq;

CREATE SEQUENCE public.bookmarks_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.bookmarks_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.bookmarks_id_seq TO groundcontrol;

-- DROP SEQUENCE public.investments_id_seq;

CREATE SEQUENCE public.investments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.investments_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.investments_id_seq TO groundcontrol;

-- DROP SEQUENCE public.nice_token_id_seq;

CREATE SEQUENCE public.nice_token_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.nice_token_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.nice_token_id_seq TO groundcontrol;

-- DROP SEQUENCE public.notices_id_seq;

CREATE SEQUENCE public.notices_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.notices_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.notices_id_seq TO groundcontrol;

-- DROP SEQUENCE public.p2p_request_id_seq;

CREATE SEQUENCE public.p2p_request_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.p2p_request_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.p2p_request_id_seq TO groundcontrol;

-- DROP SEQUENCE public.qnas_id_seq;

CREATE SEQUENCE public.qnas_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.qnas_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.qnas_id_seq TO groundcontrol;

-- DROP SEQUENCE public.user_guides_id_seq;

CREATE SEQUENCE public.user_guides_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_guides_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.user_guides_id_seq TO groundcontrol;

-- DROP SEQUENCE public.user_investments_id_seq;

CREATE SEQUENCE public.user_investments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_investments_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.user_investments_id_seq TO groundcontrol;

-- DROP SEQUENCE public.users_id_seq;

CREATE SEQUENCE public.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.users_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.users_id_seq TO groundcontrol;

-- DROP SEQUENCE public.vote_id_seq;

CREATE SEQUENCE public.vote_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.vote_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.vote_id_seq TO groundcontrol;

-- DROP SEQUENCE public.vote_record_id_seq;

CREATE SEQUENCE public.vote_record_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.vote_record_id_seq OWNER TO groundcontrol;
GRANT ALL ON SEQUENCE public.vote_record_id_seq TO groundcontrol;
-- public.audit_logs definition

-- Drop table

-- DROP TABLE public.audit_logs;

CREATE TABLE public.audit_logs (
	id serial4 NOT NULL,
	user_id int8 NOT NULL,
	event_id text NOT NULL,
	"data" text NULL,
	created_at timestamptz NOT NULL,
	pre_data text NULL,
	post_data text NULL,
	admin_id int8 NOT NULL
);

-- Permissions

ALTER TABLE public.audit_logs OWNER TO groundcontrol;
GRANT ALL ON TABLE public.audit_logs TO groundcontrol;


-- public.bookmarks definition

-- Drop table

-- DROP TABLE public.bookmarks;

CREATE TABLE public.bookmarks (
	id serial4 NOT NULL,
	user_id int8 NOT NULL,
	investment_id int8 NOT NULL,
	created_at timestamptz NOT NULL
);

-- Permissions

ALTER TABLE public.bookmarks OWNER TO groundcontrol;
GRANT ALL ON TABLE public.bookmarks TO groundcontrol;


-- public.investments definition

-- Drop table

-- DROP TABLE public.investments;

CREATE TABLE public.investments (
	id serial4 NOT NULL,
	invest_id text NOT NULL,
	title text NOT NULL,
	invest_time text NOT NULL,
	profit float8 NOT NULL,
	max_invest int8 NOT NULL,
	current_invest int8 NOT NULL,
	start_date timestamptz NOT NULL,
	end_date timestamptz NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL,
	recruitment_amount varchar NULL,
	thumbnail1 varchar NULL,
	thumbnail2 varchar NULL,
	thumbnail3 varchar NULL,
	description1 varchar NULL,
	description2 varchar NULL,
	description3 varchar NULL,
	description4 varchar NULL,
	description5 varchar NULL,
	detailimage1 varchar NULL,
	detailimage2 varchar NULL,
	latitude float8 NULL,
	longitude float8 NULL,
	document1 varchar NULL,
	document2 varchar NULL,
	document3 varchar NULL,
	won_per_account int8 NULL,
	status varchar NOT NULL DEFAULT '모집'::character varying,
	termstitle1 varchar NULL,
	termstitle2 varchar NULL,
	termstitle3 varchar NULL,
	termscontent2 varchar NULL,
	termscontent1 varchar NULL,
	termscontent3 varchar NULL
);

-- Permissions

ALTER TABLE public.investments OWNER TO groundcontrol;
GRANT ALL ON TABLE public.investments TO groundcontrol;


-- public.nice_token definition

-- Drop table

-- DROP TABLE public.nice_token;

CREATE TABLE public.nice_token (
	id serial4 NOT NULL,
	access_token varchar NOT NULL,
	token_type varchar NOT NULL,
	expires_in int8 NOT NULL,
	"scope" varchar NOT NULL,
	created_at timestamptz NOT NULL
);

-- Permissions

ALTER TABLE public.nice_token OWNER TO groundcontrol;
GRANT ALL ON TABLE public.nice_token TO groundcontrol;


-- public.notices definition

-- Drop table

-- DROP TABLE public.notices;

CREATE TABLE public.notices (
	id serial4 NOT NULL,
	title text NOT NULL,
	"content" text NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT notices_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.notices OWNER TO groundcontrol;
GRANT ALL ON TABLE public.notices TO groundcontrol;


-- public.p2p_request definition

-- Drop table

-- DROP TABLE public.p2p_request;

CREATE TABLE public.p2p_request (
	id serial4 NOT NULL,
	"data" text NOT NULL,
	status text NOT NULL
);

-- Permissions

ALTER TABLE public.p2p_request OWNER TO groundcontrol;
GRANT ALL ON TABLE public.p2p_request TO groundcontrol;


-- public.qnas definition

-- Drop table

-- DROP TABLE public.qnas;

CREATE TABLE public.qnas (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	email text NOT NULL,
	"domain" text NOT NULL,
	phone1 text NOT NULL,
	phone2 text NOT NULL,
	phone3 text NOT NULL,
	title text NOT NULL,
	"content" text NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL
);

-- Permissions

ALTER TABLE public.qnas OWNER TO groundcontrol;
GRANT ALL ON TABLE public.qnas TO groundcontrol;


-- public.user_guides definition

-- Drop table

-- DROP TABLE public.user_guides;

CREATE TABLE public.user_guides (
	id serial4 NOT NULL,
	title text NOT NULL,
	"content" text NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT user_guides_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.user_guides OWNER TO groundcontrol;
GRANT ALL ON TABLE public.user_guides TO groundcontrol;


-- public.user_investments definition

-- Drop table

-- DROP TABLE public.user_investments;

CREATE TABLE public.user_investments (
	id serial4 NOT NULL,
	invest_id text NOT NULL,
	title text NOT NULL,
	process_percent float8 NOT NULL,
	amount int8 NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL,
	investment_id int8 NULL,
	sign_name varchar NULL,
	paid_status varchar NOT NULL DEFAULT ''::character varying
);

-- Permissions

ALTER TABLE public.user_investments OWNER TO groundcontrol;
GRANT ALL ON TABLE public.user_investments TO groundcontrol;


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	email text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	created_at timestamptz NOT NULL,
	activated bool NOT NULL,
	activate_token varchar NULL,
	forgot_token varchar NULL,
	"name" varchar NULL,
	"day" varchar NULL,
	"month" varchar NULL,
	"year" varchar NULL,
	gender varchar NULL,
	phone1 varchar NULL,
	phone2 varchar NULL,
	phone3 varchar NULL,
	user_id varchar NULL,
	ci varchar NULL,
	sms_send_agree bool NOT NULL DEFAULT false,
	email_send_agree bool NOT NULL DEFAULT false,
	address text NULL,
	type VARCHAR(255) NOT NULL DEFAULT 'individual',
	file varchar NULL,
	business_number varchar NULL,
	company_name varchar NULL
);

-- Permissions

ALTER TABLE public.users OWNER TO groundcontrol;
GRANT ALL ON TABLE public.users TO groundcontrol;


-- public.vote definition

-- Drop table

-- DROP TABLE public.vote;

CREATE TABLE public.vote (
	id serial4 NOT NULL,
	title text NOT NULL,
	investment_id int8 NULL,
	"content" text NOT NULL DEFAULT ''::text,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL,
	file varchar NULL,
	status varchar NULL DEFAULT 'ongoing'::character varying
);

-- Permissions

ALTER TABLE public.vote OWNER TO groundcontrol;
GRANT ALL ON TABLE public.vote TO groundcontrol;


-- public.vote_record definition

-- Drop table

-- DROP TABLE public.vote_record;

CREATE TABLE public.vote_record (
	id serial4 NOT NULL,
	vote_id text NOT NULL,
	record text NOT NULL,
	created_by int8 NOT NULL,
	created_at timestamptz NOT NULL
);