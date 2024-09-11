FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
ARG deploy
RUN npm run $deploy

FROM nginx:1.25.3-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/sakai-ng /usr/share/nginx/html
EXPOSE 80
