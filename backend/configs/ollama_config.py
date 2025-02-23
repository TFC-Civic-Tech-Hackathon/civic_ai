import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class OllamaConfig:
    def __init__(self):
        self.api_base = os.getenv('OLLAMA_API_BASE', 'http://localhost:11434').rstrip('/')
        self.model_name = "ollama/llama3.2:1b"
        self.temperature = 0.7
        self.request_timeout = 30

    def get_completion_params(self, message):
        return {
            "model": self.model_name,
            "messages": [{"role": "user", "content": message}],
            "api_base": self.api_base,
            "temperature": self.temperature,
            "request_timeout": self.request_timeout
        }

    def test_connection(self):
        import requests
        try:
            response = requests.get(f"{self.api_base}/api/version")
            return response.status_code == 200, response
        except requests.exceptions.RequestException as e:
            logger.error(f"Connection error: {e}")
            return False, None