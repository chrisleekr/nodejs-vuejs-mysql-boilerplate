#!/bin/sh

set -e

mkdir -p /srv/frontend-vue/static

cat <<EOT > /srv/frontend-vue/static/config.json
{
  "apiUrl": "$API_URL",
  "format": {
    "dateTime": "YYYY-MM-DD HH:MM:SS"
  }
}
EOT

exec "$@"
