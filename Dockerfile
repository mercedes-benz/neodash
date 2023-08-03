# build stage
FROM node:lts-alpine AS build-stage

RUN yarn global add typescript jest
WORKDIR /usr/local/src/neodash

# Pull source code if you have not cloned the repository
#RUN apk add --no-cache git
#RUN git clone https://github.com/neo4j-labs/neodash.git /usr/local/src/neodash

# Copy sources and install/build
COPY ./package.json /usr/local/src/neodash/package.json

RUN yarn install
COPY ./ /usr/local/src/neodash
RUN yarn run build-minimal

# production stage
FROM nginxinc/nginx-unprivileged:latest AS neodash

COPY --chown=nginx:nginx --from=build-stage /usr/local/src/neodash/dist /usr/share/nginx/html

COPY --chown=nginx:nginx ./conf/default.conf /etc/nginx/conf.d/

EXPOSE 5005

## Launch webserver as non-root user.
CMD ["nginx", "-g", "daemon off;"]
HEALTHCHECK cmd curl --fail http://localhost:5005 || exit 1
LABEL version="2.3.0"
