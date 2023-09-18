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