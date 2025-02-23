from datetime import timedelta
from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator 
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from airflow.utils.task_group import TaskGroup
import pandas as pd

from fr_helper.scrape_ids import scrape_data
from fr_helper.api_call import collect_data
from fr_helper.load_snowflake import load_to_snowflake
from fr_helper.load_pdf import load_pdf_data

def extract_data_for_url(url, id, **kwargs):
  data = scrape_data(url=url)
  kwargs['ti'].xcom_push(key=f'extract_ids_{id}', value=data)


def collect_data_for_url(id, **kwargs):
  extracted_id = kwargs['ti'].xcom_pull(task_ids=f'url_tasks.extract_metadata_{id}', key=f'extract_ids_{id}')
  print(extracted_id)
  collected_data = collect_data(extracted_id)
  kwargs['ti'].xcom_push(key=f'collected_data_{id}', value=collected_data)
  
def load_data_to_snowflake(id, **kwargs):
  data = kwargs['ti'].xcom_pull(task_ids=f'url_tasks.collect_data_{id}', key=f'collected_data_{id}')
  df = pd.DataFrame(data)
  load_to_snowflake(df)

def load_pdf_data_to_pinecone(id, **kwargs):
  data = kwargs['ti'].xcom_pull(task_ids=f'url_tasks.collect_data_{id}', key=f'collected_data_{id}')
  load_pdf_data(data)

urls = ["https://www.federalregister.gov/documents/search?conditions%5Bagencies%5D%5B%5D=food-and-drug-administration&conditions%5Bagencies%5D%5B%5D=food-and-consumer-service&conditions%5Bagencies%5D%5B%5D=food-safety-and-inspection-service&conditions%5Bagencies%5D%5B%5D=food-and-nutrition-service&conditions%5Bagencies%5D%5B%5D=national-institute-of-food-and-agriculture&conditions%5Bagencies%5D%5B%5D=reagan-udall-foundation-for-the-food-and-drug-administration#advanced"]

#----------------- DAG -----------------#

dag = DAG(
  dag_id="FR_DAG",
  schedule_interval=None,
  start_date=days_ago(0),
  catchup=False,
  dagrun_timeout=timedelta(minutes=360),
  max_active_runs=4,
  default_args={
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
  },
)

# Start Task
start_task = DummyOperator(task_id='start', dag=dag)

# Create a TaskGroup to hold tasks for each url
with TaskGroup("url_tasks", dag=dag) as url_task_group:
  # Dynamically generate tasks for each url
  url_tasks = []
  for i, url in enumerate(urls):
    # Task for extracting metadata
    extract_task = PythonOperator(
      task_id=f"extract_metadata_{i}",
      python_callable=extract_data_for_url,
      op_args=[url, i],
      provide_context=True,
      dag=dag,
    )
    # Task for transforming metadata
    collect_task = PythonOperator(
      task_id=f"collect_data_{i}",
      python_callable=collect_data_for_url,
      op_args=[i],
      provide_context=True,
      dag=dag,
    )
    load_task = PythonOperator(
      task_id=f"load_data_{i}",
      python_callable=load_data_to_snowflake,
      op_args=[i],
      provide_context=True,
      dag=dag,
    )
    load_pinecone_task = PythonOperator(
      task_id=f"load_pinecone_data_{i}",
      python_callable=load_pdf_data_to_pinecone,
      op_args=[i],
      provide_context=True,
      dag=dag,
    )
    extract_task >> collect_task >> load_task
    collect_task >> load_pinecone_task
    url_tasks.append((extract_task, collect_task, load_task, load_pinecone_task))

# End Task
end_task = DummyOperator(task_id='end', dag=dag)

# Set the task dependencies
start_task >> url_task_group >> end_task

