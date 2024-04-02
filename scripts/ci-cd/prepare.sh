#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Go to project folder
cd /home/ubuntu/econominhas

# Install dependencies
pnpm i --prod --frozen-lockfile --ignore-scripts

# Generate prisma client
npx prisma generate --generator client
