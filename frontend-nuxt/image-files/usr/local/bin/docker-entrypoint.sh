#!/bin/sh

set -e

/usr/local/bin/create-env.sh

exec "$@"
