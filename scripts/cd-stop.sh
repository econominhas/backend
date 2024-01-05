#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Stop previous build (if running)
if pm2 list | grep -q 'ECONOMINHAS';
then
  pm2 delete "ECONOMINHAS" || :
fi
