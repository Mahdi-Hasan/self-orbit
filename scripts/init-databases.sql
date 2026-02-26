-- Initialize separate databases for each microservice
CREATE DATABASE selforbit_expense;
CREATE DATABASE selforbit_productivity;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE selforbit_expense TO postgres;
GRANT ALL PRIVILEGES ON DATABASE selforbit_productivity TO postgres;
