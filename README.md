# Pipeline Worker Client

## Quick Notes

On a machine with one worker API server and client (standalone or container) this can be started with `run.sh` or just
by starting the container.

If you are running multiple workers on the same machine, additional workers must modify
* `PIPELINE_WORKER_CLIENT_PORT`
* `PIPELINE_WORKER_API_PORT`

typically via an`options.sh` file that will be automatically loaded by `run.sh` for standlone use, or by the environment arguments
passed to docker run.

If the client is running on a different host than the worker API server
* `PIPELINE_WORKER_API_HOST`

must be defined.
