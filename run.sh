#!/usr/bin/env bash

LAST_NODE_ENV=${NODE_ENV}

export NODE_ENV=production

if [ "$#" -gt 0 ]; then
    source ${1}
fi

nohup npm run dev &

NODE_ENV=${LAST_NODE_ENV}
