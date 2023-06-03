FROM node:16.20.0 AS build
WORKDIR /src
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.25.0 AS final
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist/my-app /usr/share/nginx/html
COPY keys.json /usr/share/nginx/html