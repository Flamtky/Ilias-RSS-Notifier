FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci && npm install typescript --location=global

COPY ./ /app/

RUN tsc

RUN rm -rf /app/node_modules # delete dev dependencies

RUN npm install --omit=dev # install production dependencies

#Create NODE deployment
FROM node:lts-alpine

WORKDIR /app

COPY --from=build-stage /app/package*.json /app/
COPY --from=build-stage /app/out /app/

# Setup Times
RUN apk add tzdata
RUN cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime
RUN echo "Europe/Berlin" >  /etc/timezone
RUN apk del tzdata

RUN npm install --production

CMD node start.js