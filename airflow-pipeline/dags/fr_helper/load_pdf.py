import configparser
from PyPDF2 import PdfReader
import requests
from io import BytesIO

config = configparser.ConfigParser()
config.read('/opt/airflow/dags/configuration.properties')

def read_pdf_data(pdf_link):
    try:
        response = requests.get(pdf_link)
        if response.status_code == 200:
            pdf_bytes = BytesIO(response.content)

            # Step 2: Read and extract text
            reader = PdfReader(pdf_bytes)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        else:
            print("Failed to download the PDF.")
            text = ""
        return text
    except Exception as e:
        print("Exception in read_pdf_data function: ",e)
        return ""
    
def load_pdf_data(data):
    pdf_text = {}
    for d in data:
        pdf_text[d["PUBLIC_INSPECTION_PDF_URL"]] = read_pdf_data(d["PUBLIC_INSPECTION_PDF_URL"])
    print(len(pdf_text))
    return pdf_text