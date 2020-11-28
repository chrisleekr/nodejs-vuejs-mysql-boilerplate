#!/bin/sh

echo "   _____  .__                     __  .__                "
echo "  /     \ |__| ________________ _/  |_|__| ____   ____   "
echo " /  \ /  \|  |/ ___\_  __ \__  \\   __\  |/  _ \ /    \  "
echo "/    Y    \  / /_/  >  | \// __ \|  | |  (  <_> )   |  \ "
echo "\____|__  /__\___  /|__|  (____  /__| |__|\____/|___|  / "
echo "        \/  /_____/            \/                    \/  "

set -e

printf "Checking database connection...\n\n"
mysql_ready() {
    mysqladmin ping --host="$DB_HOST" --user="$DB_USER" --password="$DB_PASSWORD" > /dev/null 2>&1
}

while ! (mysql_ready)
do
    sleep 3
    echo "Waiting for database connection ..."
done

echo "Database is ready..."

echo "Starting migration..."
npm run migrate:up
echo "Finished migration..."

