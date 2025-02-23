import sys
from pathlib import Path

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from litellm import completion
import logging
from configs.ollama_config import OllamaConfig

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Ollama configuration
ollama_config = OllamaConfig()

# Define request model
class QueryRequest(BaseModel):
    query: str

@app.post("/query")
async def process_query(request: QueryRequest):
    try:
        # Test connection first
        is_connected, conn_test = ollama_config.test_connection()
        if not is_connected:
            raise HTTPException(
                status_code=503,
                detail="Failed to connect to Ollama server"
            )

        # Make request to Ollama
        logger.debug(f"Processing query: {request.query}")
        response = completion(**ollama_config.get_completion_params(request.query))

        # Extract the response text
        response_text = response.choices[0].message.content
        logger.debug(f"Received response: {response_text}")

        return JSONResponse(
            content={
                "status": "success",
                "query": request.query,
                "response": response_text
            }
        )

    except Exception as e:
        logger.error(f"Error occurred: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)