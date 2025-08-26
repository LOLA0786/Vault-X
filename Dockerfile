# Development Dockerfile
FROM node:18-alpine

ENV NODE_ENV=development

# Install tools useful during development (add postgresql-client for pg_isready)
RUN apk add --no-cache bash python3 make g++ git postgresql-client

WORKDIR /usr/src/app

# Copy manifest and install all dependencies (including devDependencies)
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy the rest of the source
COPY . .

# Make sure the dev server ports are exposed (API + Vite)
EXPOSE 8080 5173

# Default command for local development: run the dev script (uses tsx for server + vite)
CMD ["npm", "run", "dev"]
