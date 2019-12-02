#!/bin/sh

set -e

mkdir -p /srv/backend/static

cat <<EOT >> /srv/backend/static/config.json
{
  "apiHost": "$API_HOST",
  "format": {
    "timeZone": "Australia/Melbourne",
    "dateTime": "YYYY-MM-DD HH:mm:ss",
    "pickerDateTime": "yyyy-MM-dd HH:mm"
  }
}
EOT

exec "$@"
