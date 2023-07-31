# Stage 1: Dependencies stage
FROM node:18.16.0 AS dependencies

LABEL maintainer="Fevin Patel <fevin.tech@aol.com>"
LABEL description="Fragments UI manual test platform"

ENV NODE_ENV=production

# We default to use port 8080 in our service
ENV PORT=1234

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

# relative path - Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
COPY package*.json ./

RUN npm ci --only=production

# Stage 2: Build stage
# Parent(base) image to use as a astarting point
# Use node version 18.16.0
FROM dependencies AS builder

WORKDIR /app

COPY --from=dependencies /app /app

# Copying source code into the image filesystem
COPY . .

# Building the site (dist/)
RUN npm install

# Staage 3: Deployment stage
FROM nginx:stable AS deploy

# Copy custom Nginx configuration if required
# COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app /usr/share/nginx/html/

# Port that container will listen to. We run our service on port 8080
EXPOSE 80

HEALTHCHECK --interval=15s --start-period=5s --retries=3 --timeout=30s\
  CMD curl --fail localhost:80 || exit 1
