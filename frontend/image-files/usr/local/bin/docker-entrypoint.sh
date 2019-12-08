#!/bin/sh

set -e

mkdir -p /srv/frontend/static

cat <<EOT > /srv/frontend/static/config.json
{
  "apiUrl": "$API_URL",
  "format": {
    "dateTime": "YYYY-MM-DD HH:MM:SS"
  }
}
EOT

exec "$@"
