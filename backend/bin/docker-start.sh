#!/bin/sh

printenv

echo "Waiting 1m for DB image to start"
sleep 1m

echo "Creating database..."
./create-database.sh "$PG_HOST" "$PG_DB" "$PG_USER" "$PG_PASSWORD"

# Setup DB
echo "Setting up the database!"
npm run db-setup

pm2 start pm2.config.js --attach
