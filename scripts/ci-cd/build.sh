#!/bin/bash

# Generate prisma client
npx prisma generate --generator client

# Build
npx nest build --builder webpack

# Create necessary folders
mkdir dist/prisma
mkdir dist/scripts

# Copy env files
cp .env.production dist/.env

# Copy package files
cp package.json dist/package.json
cp yarn.lock dist/yarn.lock

# Copy database files
cp -r prisma/migrations dist/prisma/migrations
cp prisma/schema.prisma dist/prisma/schema.prisma

# Copy deploy files
cp appspec.yml dist/appspec.yml
cp scripts/ci-cd/prepare.sh dist/scripts/ci-cd/prepare.sh
cp scripts/ci-cd/start.sh dist/scripts/ci-cd/start.sh
cp scripts/ci-cd/stop.sh dist/scripts/ci-cd/stop.sh
cp scripts/ci-cd/validate.sh dist/scripts/ci-cd/validate.sh
