#!/bin/sh


echo "   _____ __________.___"
echo "  /  _  \\______   \   |"
echo " /  /_\  \|     ___/   |"
echo "/    |    \    |   |   |"
echo "\____|__  /____|   |___|"
echo "        \/"


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

exec "$@"
