import snowflake.connector
import configparser
import pandas as pd
import tempfile
import os

# Read Snowflake Configurations
config = configparser.ConfigParser()
config.read('/opt/airflow/dags/configuration.properties')


def snowflake_connection():
    """Establish connection to Snowflake using credentials from the config file."""
    try:
        user = config['SNOWFLAKE']['user']
        password = config['SNOWFLAKE']['password']
        account = config['SNOWFLAKE']['account']
        role = config['SNOWFLAKE']['role']
        warehouse = config['SNOWFLAKE']['warehouse']
        database = config['SNOWFLAKE']['database']
        schema = config['SNOWFLAKE']['schema']
        table = config['SNOWFLAKE']['table']
        stage = config['SNOWFLAKE']['stage']
        file_format = config['SNOWFLAKE']['file_format']

        conn = snowflake.connector.connect(
            user=user,
            password=password,
            account=account,
            warehouse=warehouse,
            database=database,
            schema=schema,
            role=role
        )

        return conn, table, stage, file_format
    except Exception as e:
        print("❌ Exception in snowflake_connection function:", e)
        return None, None, None, None


def stage_csv(df, conn, stage):
    """Save a Pandas DataFrame to a temporary CSV file and stage it to Snowflake."""
    try:
        cursor = conn.cursor()

        # Create a temporary CSV file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp_file:
            temp_path = temp_file.name

        # Save DataFrame to CSV (without index)
        df.to_csv(temp_path, index=False, sep="|")

        # Extract file name from path
        csv_name = os.path.basename(temp_path)

        # Execute PUT command to stage file in Snowflake
        put_query = f"PUT file://{temp_path} @{stage} AUTO_COMPRESS=TRUE OVERWRITE=TRUE"
        cursor.execute(put_query)

        print(f"✅ Staging data...")
        print(f"📂 File {csv_name} staged successfully at {stage}.")

        # Clean up: Delete temporary file
        os.remove(temp_path)

        cursor.close()
        return csv_name  # Return the staged CSV file name

    except Exception as e:
        print("❌ Exception in stage_csv function:", e)
        return None


def load_to_snowflake(df):
    """Load DataFrame into Snowflake using staging and MERGE command."""
    try:
        conn, table, stage, file_format = snowflake_connection()
        if not conn:
            raise ValueError("❌ Failed to establish Snowflake connection.")

        cur = conn.cursor()

        # Stage CSV file
        csv_name = stage_csv(df, conn, stage)
        if not csv_name:
            raise ValueError("❌ Failed to stage CSV file.")

        # Define the MERGE SQL Query
        merge_query = f"""
            MERGE INTO {table} AS t
            USING (
                SELECT 
                    $1 AS ID, 
                    $2 AS AGENCY, 
                    $3 AS SUB_AGENCY, 
                    $4 AS ACTION_TYPE, 
                    $5 AS SUMMARY, 
                    $6 AS IMPORTANT_DATES, 
                    $7 AS PUBLIC_INSPECTION_PDF_URL, 
                    $8 AS LAST_UPDATED_DATE, 
                    $9 AS PUBLICATION_DATE
                FROM @{stage}/{csv_name} (FILE_FORMAT => {file_format})
            ) AS s
            ON t.ID = s.ID 
            WHEN MATCHED THEN
                UPDATE SET  
                    t.AGENCY = s.AGENCY,
                    t.SUB_AGENCY = s.SUB_AGENCY,
                    t.ACTION_TYPE = s.ACTION_TYPE,
                    t.SUMMARY = s.SUMMARY,
                    t.IMPORTANT_DATES = s.IMPORTANT_DATES,
                    t.PUBLIC_INSPECTION_PDF_URL = s.PUBLIC_INSPECTION_PDF_URL,
                    t.LAST_UPDATED_DATE = s.LAST_UPDATED_DATE,
                    t.PUBLICATION_DATE = s.PUBLICATION_DATE
            WHEN NOT MATCHED THEN
                INSERT (ID, AGENCY, SUB_AGENCY, ACTION_TYPE, SUMMARY, IMPORTANT_DATES, PUBLIC_INSPECTION_PDF_URL, LAST_UPDATED_DATE, PUBLICATION_DATE, DI_LOAD_DT)
                VALUES (s.ID, s.AGENCY, s.SUB_AGENCY, s.ACTION_TYPE, s.SUMMARY, s.IMPORTANT_DATES, s.PUBLIC_INSPECTION_PDF_URL, s.LAST_UPDATED_DATE, s.PUBLICATION_DATE, CURRENT_TIMESTAMP);
        """

        print("🔄 Merging data into Snowflake...")

        # Execute the merge query
        cur.execute(merge_query)

        print("✅ Data merged successfully!")

        # Close resources
        cur.close()
        conn.close()

    except Exception as e:
        print("❌ Exception in load_to_snowflake function:", e)
