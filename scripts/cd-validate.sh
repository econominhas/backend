#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Validate service
if pm2 status "ECONOMINHAS" | grep -q 'online';
then
  exit 0
else
	pm2 status "ECONOMINHAS"
  exit 1
fi
