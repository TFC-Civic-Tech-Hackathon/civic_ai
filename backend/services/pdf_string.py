import requests
from io import BytesIO
from PyPDF2 import PdfReader


def extract_text_from_pdf(pdf_url: str) -> str:
    """
    Downloads a PDF from the given Cloudinary URL and extracts its text.

    Args:
        pdf_url (str): Secure URL of the PDF file.

    Returns:
        str: Extracted text from the PDF.
    """
    try:
        # Step 1: Download the PDF
        response = requests.get(pdf_url)
        if response.status_code == 200:
            # Step 2: Read and extract text
            pdf_bytes = BytesIO(response.content)
            reader = PdfReader(pdf_bytes)
            text = ""

            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

            return text.strip()  # Remove extra whitespace
        else:
            print(
                f"❌ Failed to download PDF. Status Code: {response.status_code}")
            return ""
    except Exception as e:
        print(f"❌ Error processing PDF: {e}")
        return ""
