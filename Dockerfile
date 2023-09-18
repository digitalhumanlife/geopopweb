FROM node:16.19.0-bullseye AS node

RUN npm install -g serve

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY web-app/.yarn/releases/ /usr/src/app/.yarn/releases/
COPY web-app/.yarn/plugins/ /usr/src/app/.yarn/plugins/
COPY web-app/.yarnrc.yml web-app/package.json web-app/yarn.lock /usr/src/app/

RUN yarn

COPY web-app/. /usr/src/app

RUN yarn build

EXPOSE 4007

CMD ["serve", "-s", "build", "-l", "4007"]