from pydantic import BaseModel


class PDFRequest(BaseModel):
    userId: str  # User ID
    pdf_url: str  # Cloudinary URL of the PDF
