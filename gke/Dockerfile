# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:14-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy local code to the container image.
COPY . ./

# Build the application
RUN npm run build

# Port
ENV PORT 8080

# Run the web service on container startup.
CMD [ "npm", "run", "start:prod" ]
