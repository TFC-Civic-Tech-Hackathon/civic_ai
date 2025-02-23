import requests

def test_ollama_connection():
    api_base = "http://homelab.chaudharyanshul.com:11434"
    
    try:
        # Test basic connectivity
        response = requests.get(f"{api_base}/api/version")
        print(f"Connection test: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Test model availability
        models = requests.get(f"{api_base}/api/tags")
        print(f"\nAvailable models: {models.json()}")
        
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    test_ollama_connection()