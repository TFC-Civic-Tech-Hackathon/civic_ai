from fastapi import APIRouter, HTTPException
from services.pdf_string import extract_text_from_pdf
from models.PDFRequest import PDFRequest
import configparser
import requests
from routes.chatRouter import process_query
router = APIRouter()

config = configparser.ConfigParser()
config.read("configuration.properties")

def get_pdf_content(pdf_url: str):
    pdf_string = extract_text_from_pdf(pdf_url)
    if not pdf_string:
        raise HTTPException(
            status_code=400, detail="Failed to extract text from PDF")
    
    return pdf_string


@router.post("/data")
async def get_pdf_insight(userId: str, pdf_url: str):
    try:
        pdf_string = get_pdf_content(pdf_url)
        query_payload = {"query": pdf_string}
        query_response = process_query(query_payload)

        # ✅ Handle /query API response
        if query_response.status_code == 200:
            query_result = query_response.json()
            return {
                "message": "PDF insights generated successfully",
                "userId": userId,
                "pdf_url": pdf_url,
                "query_response": query_result["response"]
            }
        else:
            raise HTTPException(
                status_code=query_response.status_code, detail=query_response.text)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing PDF insights: {str(e)}")

