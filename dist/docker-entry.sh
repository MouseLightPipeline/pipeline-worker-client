#!/usr/bin/env bash

logName=$(date '+%Y-%m-%d_%H-%M-%S');

export DEBUG=pipeline*

mkdir -p /var/log/pipeline

node server/pipelineWorkerClientServer.js &> /var/log/pipeline/worker-client-${HOSTNAME}-${logName}.log
