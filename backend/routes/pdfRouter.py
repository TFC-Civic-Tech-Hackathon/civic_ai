from fastapi import APIRouter, HTTPException
from services.pdf_string import extract_text_from_pdf
from models.PDFRequest import PDFRequest
import configparser
import requests
from routes.chatRouter import process_query
from io import BytesIO
from PyPDF2 import PdfReader
from litellm import completion

from configs.ollama_config import OllamaConfig


router = APIRouter()

ollama_config = OllamaConfig()


config = configparser.ConfigParser()
config.read("configuration.properties")

api_base = config['OLLAMA']['OLLAMA_API_BASE']


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


@router.post("/data")
async def get_pdf_insight(userId: str, pdf_url: str):
    try:
        pdf_string = read_pdf_data(pdf_url)
        query_payload = {"query": pdf_string}
        query_response = process_query(query_payload)
        response = query_payload
        # response = await completion(**ollama_config.get_completion_params())
        response = completion(
            model="ollama/llama3.2:1b",  # Updated model name to match available model
            messages=[{"role": "user", "content": pdf_string + "\n\n\n\n explain this PDF data to me in a simple way and give me the summary of the PDF"}],
            api_base=api_base,
            temperature=0.7,
            request_timeout=30
        )

        # ✅ Handle /query API response
        if response:
            return {
                "message": "PDF insights generated successfully",
                "userId": userId,
                "pdf_url": pdf_url,
                "query_response": response.choices[0].message.content
            }
        else:
            raise HTTPException(
                status_code=query_response.status_code, detail=query_response.text)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing PDF insights: {str(e)}")

