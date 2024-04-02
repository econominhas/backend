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
cp pnpm-lock.yaml dist/pnpm-lock.yaml

# Copy database files
cp -r prisma/migrations dist/prisma/migrations
cp prisma/schema.prisma dist/prisma/schema.prisma

# Copy deploy files
cp appspec.yml dist/appspec.yml
cp -r scripts/ci-cd/ dist/scripts/ci-cd/
