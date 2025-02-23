from flask import Flask, Blueprint, jsonify
from flask_cors import CORS
from litellm import completion
import os
from dotenv import load_dotenv
import logging
import requests

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)
CORS(app)

# Create blueprint
test_bp = Blueprint('test', __name__)

@test_bp.route('/test', methods=['GET'])
def test_ollama():
    try:
        # Log API base URL
        api_base = os.getenv('OLLAMA_API_BASE').rstrip('/')
        logger.debug(f"Using Ollama API base: {api_base}")

        # Test connection first
        conn_test = requests.get(f"{api_base}/api/version")
        logger.debug(f"Connection test status: {conn_test.status_code}")

        # Hardcoded test query
        test_message = "Who is the president of United States? Now it is 2025 guess who is the president"

        # Make request to Ollama with more detailed logging
        logger.debug("Starting LiteLLM completion request...")
        response = completion(
            model="ollama/llama3.2:1b",  # Updated model name to match available model
            messages=[{"role": "user", "content": test_message}],
            api_base=api_base,
            temperature=0.7,
            request_timeout=30
        )

        # Extract the response text
        response_text = response.choices[0].message.content
        logger.debug(f"Received response: {response_text}")

        return jsonify({
            "status": "success",
            "query": test_message,
            "response": response_text
        })

    except requests.exceptions.RequestException as e:
        logger.error(f"Connection error: {e}")
        return jsonify({
            "status": "error",
            "message": f"Connection error: {str(e)}",
            "api_base": api_base
        }), 503
        
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": str(e),
            "api_base": api_base
        }), 500

# Register blueprint
app.register_blueprint(test_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)