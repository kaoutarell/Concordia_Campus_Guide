-- Create the database 'gis_db' if it doesn't exist
CREATE DATABASE gis_db
    WITH OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    TABLESPACE = pg_default;

-- Create the user 'dev_experts' if it doesn't exist
CREATE ROLE dev_experts WITH LOGIN PASSWORD 'soen390';

-- Allow the role to create databases
ALTER ROLE dev_experts CREATEDB;

-- Grant all privileges on the 'gis_db' database to 'dev_experts'
GRANT ALL PRIVILEGES ON DATABASE gis_db TO dev_experts;



