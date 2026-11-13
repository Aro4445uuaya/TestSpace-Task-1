
# Task 01 - Extract and Load Data Pipeline

## 1. Project Overview

This project implements a simple data extraction and loading pipeline using Python.

The pipeline extracts exam submission records from MongoDB Atlas and loads them into a separate MySQL data warehouse.

It also performs basic data transformations and validates the number of records loaded into the target database.

## 2. What I Did

- Connected Python to MongoDB Atlas using PyMongo.
- Retrieved exam submission documents from the `examSubmissions` collection.
- Extracted the required fields from each document.
- Performed basic transformations, including MongoDB ObjectId conversion, JSON serialization, and datetime handling.
- Connected Python to MySQL using mysql-connector-python.
- Loaded the extracted records into the `exam_submissions_raw` table.
- Implemented duplicate handling using MySQL's `ON DUPLICATE KEY UPDATE`.
- Verified the loaded data by comparing source and target row counts.

## 3. Architecture

MongoDB Atlas → Python (Extract and Transform) → MySQL Data Warehouse

**Source:**
- Database: `testspace`
- Collection: `examSubmissions`

**Target:**
- Database: `testspace_warehouse`
- Table: `exam_submissions_raw`

## 4. Key Decisions

- Used Python to connect both databases and manage the pipeline.
- Created a separate MySQL warehouse to avoid modifying the original application database.
- Used `mongo_id` as a unique key to prevent duplicate records.
- Used parameterized SQL queries for safer data insertion.
- Stored connection credentials in a `.env` file instead of hardcoding them.
- Used `ON DUPLICATE KEY UPDATE` to make repeated pipeline runs update existing records instead of creating duplicates.

## 5. Validation Results

The pipeline was successfully executed and the row counts were verified.

| Validation | Result |
|---|---:|
| MongoDB source records | 8 |
| MySQL target records | 8 |
| Row count validation | Passed |

## 6. Project Structure

```text
task-01-extract-load/
│
├── extract_load.py
├── .env
└── README.md
```

The `.env` file contains local database credentials and must not be committed to GitHub.

## 7. Requirements

- Python 3
- MongoDB Atlas
- MySQL Server

Install the required Python packages:

```bash
pip install pymongo mysql-connector-python python-dotenv
```

## 8. Configuration

Create a `.env` file in the project directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=testspace
MONGO_COLLECTION=examSubmissions

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=testspace_warehouse
```

Replace the placeholder values with your own connection details.

## 9. How to Run

Activate the Python virtual environment and execute:

```bash
python extract_load.py
```

The script connects to MongoDB, extracts the records, loads them into MySQL, and displays the row count validation result.

## 10. Conclusion

Successfully implemented and tested a Python-based data extraction and loading pipeline that transfers exam submission records from MongoDB Atlas to a separate MySQL data warehouse.

The pipeline supports repeated execution through duplicate handling and includes basic row count validation.
