#!/usr/bin/env bash

if [ -a "options.sh" ]; then
    source "options.sh"
fi

# Default is "pipeline-worker-api" which is mostly guaranteed to not be correct when running standalone.
if [ -z "${PIPELINE_WORKER_API_HOST}" ]; then
    echo "PIPELINE_WORKER_API_HOST must be set."
    exit 1
fi

nohup npm run devel &

sleep 2

chmod 775 nohup.out
