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