FROM node:alpine as builder

# build-time variables
# prod|sandbox its value will be come from outside
ARG env=prod

# Store node_nodules on a separate layer to prevent unnecessary npm installs at each build stage
# RUN npm ci && mkdir /app && mv ./node_modules ./app

# Move our files into directory name "app"
WORKDIR /app
COPY . .

RUN npm install

# Build with $env variable from outside
RUN npm run build:$env

# Build a small nginx image with static website
FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
# COPY certs/* /etc/ssl/
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chmod -R o+rX /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
