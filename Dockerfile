FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci && npm install typescript --location=global

COPY ./ /app/

RUN tsc

RUN rm -rf /app/node_modules # delete dev dependencies

RUN npm install --omit=dev # install production dependencies

#Create NODE deployment
FROM node:lts

WORKDIR /app

COPY --from=build-stage /app/package*.json /app/
COPY --from=build-stage /app/out /app/

CMD node start.js