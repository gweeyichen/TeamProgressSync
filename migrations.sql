-- Create new tables with our updated schema

-- First drop existing tables if they exist (in correct order to avoid foreign key constraints)
DROP TABLE IF EXISTS report_configurations;
DROP TABLE IF EXISTS investment_models;
DROP TABLE IF EXISTS valuation_parameters;
DROP TABLE IF EXISTS financial_data;
DROP TABLE IF EXISTS industry_data;
DROP TABLE IF EXISTS users;

-- Create tables with new schema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE financial_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  data_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE industry_data (
  id SERIAL PRIMARY KEY,
  industry_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  data_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE valuation_parameters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  params_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE investment_models (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  model_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE report_configurations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  projects TEXT NOT NULL,
  report_day TEXT NOT NULL,
  report_time TEXT NOT NULL,
  report_title TEXT NOT NULL,
  include_summary BOOLEAN NOT NULL DEFAULT TRUE,
  include_completed BOOLEAN NOT NULL DEFAULT TRUE,
  include_progress BOOLEAN NOT NULL DEFAULT TRUE,
  include_upcoming BOOLEAN NOT NULL DEFAULT TRUE,
  include_blockers BOOLEAN NOT NULL DEFAULT TRUE,
  include_metrics BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create a default user
INSERT INTO users (username, password) VALUES ('demo', 'password');