#!/bin/bash

set -e

DATETIME=$(date '+%Y%m%d%H%M%S')

docker exec mysql mysqldump -h127.0.0.1 -uroot -proot --databases boilerplate > "backup/backup-${DATETIME}.sql"
