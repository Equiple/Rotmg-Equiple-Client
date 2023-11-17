FROM node:16.20.0 AS build
WORKDIR /src
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.25.0 AS final
COPY nginx/nginx.conf.template /etc/nginx/templates
COPY --from=build /src/dist/my-app /usr/share/nginx/html
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
ENV NGINX_PORT=80