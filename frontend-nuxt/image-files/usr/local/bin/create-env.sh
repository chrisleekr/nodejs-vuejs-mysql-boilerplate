#!/bin/sh

set -e


cat <<EOT > /srv/.env
BASE_URL=${BASE_URL:=/}
API_URL=${API_URL:=http://localhost/api}
FORMAT_DATETIME=${FORMAT_DATETIME:="YYYY-MM-DD HH:MM:SS"}
EOT

exec "$@"
