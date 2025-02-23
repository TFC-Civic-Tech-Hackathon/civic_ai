import snowflake.connector
import configparser

# Load configuration
config = configparser.ConfigParser()
config.read("configuration.properties")

def snowflake_connection():
    try:
        user = config['SNOWFLAKE']['user']
        password = config['SNOWFLAKE']['password']
        account = config['SNOWFLAKE']['account']
        role = config['SNOWFLAKE']['role']
        warehouse = config['SNOWFLAKE']['warehouse']
        database = config['SNOWFLAKE']['database']
        schema = config['SNOWFLAKE']['schema']
        table = config['SNOWFLAKE']['table']

        SNOWFLAKE_CONFIG = {
            "user": user,
            "password": password,
            "account": account,
            "role": role,
            "warehouse": warehouse,
            "database": database,
            "schema": schema
        }
        conn = snowflake.connector.connect(**SNOWFLAKE_CONFIG)

        return conn, table
    except Exception as e:
        print("Exception in mongo_connection function: ",e)
        return None, None
