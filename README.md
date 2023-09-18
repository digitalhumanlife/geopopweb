# Setup

1. Docker Network

[Docker Compose File](./docker-compose.yml) 와 [Docker Compose PostgreSQL](./docker-compose-postgres.yml) 을 보면, external network 는 `gc` 라는 이름을 가지고 있습니다.

```sh
docker network create gc
```

위의 쉘 스크립트를 사용하여, `gc` 라는 이름의 Docker Network 를 생성합니다.
  
2. DB - PostgreSQL

    1. DB 실행

        DB는 Docker Compose 로 동작하는 PostgreSQL 로 구성되어 있습니다. 
        해당 서비스의 이름은 `postgres` 입니다. 아래 쉘 스크립트를 사용하여 `postgres` docker compose 서비스를 생성 및 실행 (up) 합니다.

        ```sh
        docker compose -f ./docker-compose-postgres.yml up -d
        ```

    2. DB 제거
          
        ```sh
        docker compose -f ./docker-compose-postgres.yml down 
        # linux, mac
        rm --rf data/postgres
        # windows powershell
        rm -r -fo data/postgres 
        # windows cmd
        deltree /y data/postgres
        ```

3. Web API 와 Web APP 의 실행

    Web API 의 실행은 [Web API README](./web-api/README.md) 를 참고해주세요.

    Web APP 의 실행은 [Web APP README](./web-app/README.md) 를 참고해주세요.
