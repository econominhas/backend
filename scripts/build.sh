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
cp scripts/cd-prepare.sh dist/scripts/cd-prepare.sh
cp scripts/cd-start.sh dist/scripts/cd-start.sh
cp scripts/cd-stop.sh dist/scripts/cd-stop.sh
cp scripts/cd-validate.sh dist/scripts/cd-validate.sh
