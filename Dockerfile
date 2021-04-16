FROM nginx:alpine
VOLUME [ "/build" ]
COPY sites /etc/nginx/sites
COPY nginx.conf /etc/nginx/nginx.conf
RUN apk add --no-cache nodejs npm
COPY . /build
WORKDIR /build
RUN npm i
RUN npm run build
RUN rm -rf /usr/share/nginx/html/*
RUN mv build/* /usr/share/nginx/html
