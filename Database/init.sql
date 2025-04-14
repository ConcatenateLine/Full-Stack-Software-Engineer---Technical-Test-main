-- Create the new user
CREATE USER test WITH PASSWORD 'test';

-- Create the new database
CREATE DATABASE databasetest OWNER test;

-- Grant all privileges on the new database
GRANT ALL PRIVILEGES ON DATABASE databasetest TO test;

-- Allow the user to create databases
ALTER USER test CREATEDB;

-- Create test table in the new database
\c databasetest
CREATE TABLE test (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);