#!/bin/sh

set -e

mkdir -p /srv/public/static

cat <<EOT > /srv/public/static/config.json
{
  "apiUrl": "$API_URL",
  "format": {
    "dateTime": "YYYY-MM-DD HH:MM:SS"
  }
}
EOT

exec "$@"
