
import os
import json
from pathlib import Path

import mysql.connector
from pymongo import MongoClient
from dotenv import load_dotenv

# Load connection settings from the .env file beside this script
load_dotenv(Path(__file__).with_name(".env"))

mongo_client = None
mysql_conn = None

try:
    # Connect to MongoDB
    mongo_client = MongoClient(os.getenv("MONGO_URI"))
    mongo_db = mongo_client[os.getenv("MONGO_DB_NAME")]
    collection = mongo_db[os.getenv("MONGO_COLLECTION")]

    # Read source records
    documents = list(collection.find({}))
    source_count = len(documents)

    print(f"Records found in MongoDB: {source_count}")

    # Connect to MySQL warehouse
    mysql_conn = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE")
    )

    cursor = mysql_conn.cursor()

    insert_query = """
        INSERT INTO exam_submissions_raw (
            mongo_id, workspace_id, workspace_name,
            student_id, student_name, dno, email,
            answers, score, obtained_marks, total_marks,
            time_taken, submitted_at
        )
        VALUES (
            %s, %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s
        )
        ON DUPLICATE KEY UPDATE
            workspace_id = VALUES(workspace_id),
            workspace_name = VALUES(workspace_name),
            student_id = VALUES(student_id),
            student_name = VALUES(student_name),
            dno = VALUES(dno),
            email = VALUES(email),
            answers = VALUES(answers),
            score = VALUES(score),
            obtained_marks = VALUES(obtained_marks),
            total_marks = VALUES(total_marks),
            time_taken = VALUES(time_taken),
            submitted_at = VALUES(submitted_at)
    """

    # Extract and load each record
    for doc in documents:
        submitted_at = doc.get("submittedAt")

        # MySQL DATETIME stores a timezone-naive datetime
        if submitted_at is not None and submitted_at.tzinfo is not None:
            submitted_at = submitted_at.replace(tzinfo=None)

        values = (
            str(doc["_id"]),
            doc.get("workspaceId"),
            doc.get("workspaceName"),
            doc.get("studentId"),
            doc.get("studentName"),
            doc.get("dno"),
            doc.get("email"),
            json.dumps(doc.get("answers", {})),
            doc.get("score"),
            doc.get("obtainedMarks"),
            doc.get("totalMarks"),
            doc.get("time"),
            submitted_at
        )

        cursor.execute(insert_query, values)

    mysql_conn.commit()

    # Verify the warehouse row count
    cursor.execute("SELECT COUNT(*) FROM exam_submissions_raw")
    target_count = cursor.fetchone()[0]

    print(f"Records in MySQL warehouse: {target_count}")

    if source_count == target_count:
        print("SUCCESS: Source and warehouse row counts match.")
    else:
        print("WARNING: Source and warehouse row counts do not match.")

    cursor.close()

except Exception as error:
    print("Pipeline failed:", error)
    if mysql_conn and mysql_conn.is_connected():
        mysql_conn.rollback()

finally:
    if mysql_conn and mysql_conn.is_connected():
        mysql_conn.close()

    if mongo_client:
        mongo_client.close()
