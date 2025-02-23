from fastapi import FastAPI
import json
from datetime import datetime
from configs.snowflake_configs import snowflake_connection

app = FastAPI()


def fetch_data(query):
    """Fetch data from Snowflake"""
    conn, table_name = snowflake_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    columns = [col[0] for col in cursor.description]  # Column names
    cursor.close()
    conn.close()
    return [dict(zip(columns, row)) for row in data]

@app.get("/policies")
def get_policies():
    """Fetch all policies"""
    query = "SELECT * FROM NOTICE_RULE"
    return fetch_data(query)

@app.get("/policies-per-month")
def get_policies_per_month():
    """Fetch count of new policies per month"""
    query = """
    SELECT 
        TO_CHAR(PUBLICATION_DATE, 'MMMM') AS month_name, 
        COUNT(*) AS policy_count 
    FROM NOTICE_RULE 
    GROUP BY month_name 
    ORDER BY MIN(PUBLICATION_DATE)
    """
    return fetch_data(query)

@app.get("/agency-distribution")
def get_agency_distribution():
    """Fetch distribution of policies by agency"""
    query = """
    SELECT AGENCY, COUNT(*) AS count 
    FROM NOTICE_RULE 
    GROUP BY AGENCY 
    ORDER BY count DESC
    """
    return fetch_data(query)

@app.get("/sub-agency-distribution")
def get_sub_agency_distribution():
    """Fetch distribution of policies by sub agency"""
    query = """
    SELECT SUB_AGENCY, COUNT(*) AS count 
    FROM NOTICE_RULE 
    GROUP BY SUB_AGENCY 
    ORDER BY count DESC
    """
    return fetch_data(query)
