from datetime import timedelta
from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator 
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from airflow.utils.task_group import TaskGroup
from fr_helper.scrape_ids import scrape_data

def extract_data_for_url(url, id, **kwargs):
  result_df = scrape_data(url=url)
  kwargs['ti'].xcom_push(key=f'extract_df_metadata_{id}', value=result_df)


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
  city_tasks = []
  for i, url in enumerate(urls):
    # Task for extracting metadata
    extract_task = PythonOperator(
      task_id=f"extract_metadata_{i}",
      python_callable=extract_data_for_url,
      op_args=[url, id],
      provide_context=True,
      dag=dag,
    )
    city_tasks.append((extract_task))

# End Task
end_task = DummyOperator(task_id='end', dag=dag)

# Set the task dependencies
start_task >> url_task_group >> end_task

