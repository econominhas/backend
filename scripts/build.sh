#!/bin/bash

# Build
npx nest build --builder webpack

# Create necessary folders
mkdir dist/prisma

# Copy env files
cp .env.production dist/.env

# Copy package files
cp package.json dist/package.json
cp yarn.lock dist/yarn.lock

# Copy database files
cp -r prisma/migrations dist/prisma/migrations
cp prisma/schema.prisma dist/prisma/schema.prisma
