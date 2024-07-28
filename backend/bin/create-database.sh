#!/bin/sh

set -e

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <database_host> <database_name> <postgres_user> <postgres_password>"
    exit 1
fi

DATABASE_HOST=$1
DATABASE_NAME=$2
POSTGRES_USER=$3
POSTGRES_PASSWORD=$4

echo "Connecting to host: $DATABASE_HOST"
ping -c 3 $DATABASE_HOST || exit 1

export PGPASSWORD=$POSTGRES_PASSWORD

# Check if the user exists
USER_EXISTS=$(psql -h "$DATABASE_HOST" -U postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$POSTGRES_USER';" | grep -q 1 && echo "exists")

if [ "$USER_EXISTS" != "exists" ]; then
    echo "Creating user $POSTGRES_USER"
    psql -h "$DATABASE_HOST" -U postgres -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
fi

# Check if the database exists
DB_EXISTS=$(psql -h "$DATABASE_HOST" -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DATABASE_NAME';" | grep -q 1 && echo "exists")

if [ "$DB_EXISTS" != "exists" ]; then
    echo "Creating database $DATABASE_NAME"
    psql -h "$DATABASE_HOST" -U postgres -c "CREATE DATABASE $DATABASE_NAME;"
fi

# Grant privileges to the user
psql -h "$DATABASE_HOST" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DATABASE_NAME TO $POSTGRES_USER;"
psql -h "$DATABASE_HOST" -U postgres -c "ALTER SCHEMA public OWNER TO $POSTGRES_USER;"

unset PGPASSWORD

echo "Database $DATABASE_NAME created successfully."
