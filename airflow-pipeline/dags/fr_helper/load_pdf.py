import configparser
from PyPDF2 import PdfReader
import requests
from io import BytesIO
import litellm
from transformers import AutoTokenizer
from pinecone import Pinecone
from litellm import completion
from sentence_transformers import SentenceTransformer

config = configparser.ConfigParser()
config.read('/opt/airflow/dags/configuration.properties')

def pinecone_connection():
    try:
        pinecone_api_key = config['PINECONE']['pinecone_api_key']
        index_name = config['PINECONE']['index']
        return pinecone_api_key, index_name
    except Exception as e:
        print("Exception in pinecone_connection function: ",e)
        return "", ""

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

def chunk_text(text, chunk_size=512):
    try:
        tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

        # Tokenize the entire text
        tokens = tokenizer.encode(text, truncation=False, add_special_tokens=False)

        # Split tokens into chunks of max `chunk_size`
        token_chunks = [tokens[i:i + chunk_size] for i in range(0, len(tokens), chunk_size)]

        # Decode token chunks back to text
        text_chunks = [tokenizer.decode(chunk, skip_special_tokens=True) for chunk in token_chunks]

        return text_chunks
    except Exception as e:
        print("Exception in chunk_text function:", e)
        return []

def summarize_text(prompt, text):
    try:
        # Log API base URL
        api_base = config['OLLAMA']['OLLAMA_API_BASE']

        # Test connection first
        conn_test = requests.get(f"{api_base}/api/version")

        # Hardcoded test query
        test_message = f"{prompt} {text}"

        # Make request to Ollama with more detailed logging
        response = completion(
            model="ollama/llama3.2:1b",  # Updated model name to match available model
            messages=[{"role": "user", "content": test_message}],
            api_base=api_base,
            temperature=0.7,
            request_timeout=30
        )

        return response.choices[0].message.content
    except Exception as e:
        print("Exception in summarize_text function: ",e)
        return ""


def embedding(final_summary):
    try:

        # response = await litellm.embedding(
        #     model="ollama/nomic-embed-text",  # Ollama model
        #     # Log API base URL
        #     api_base = config['OLLAMA']['OLLAMA_API_BASE'], # Ollama API base
        #     input=final_summary
        # )
        model = SentenceTransformer('all-MiniLM-L6-v2', device="cpu")
        return model.encode(final_summary)

        # return response.data[0]["embedding"]

    except Exception as e:
        print("Exception in embedding function: ",e)
        return []

def upsert_to_pinecone(all_embeddings):
    pinecone_api_key, index_name = pinecone_connection()
    print("Pinecone API Key: ", pinecone_api_key)
    print("Index Name: ", index_name)
    if pinecone_api_key == "" or index_name == "":
        return None

    pinecone = Pinecone(api_key=pinecone_api_key)
    index = pinecone.Index(name=index_name)
    index.upsert(all_embeddings)



def load_pdf_data(data):
    chunk_summzrize_prompt = "Below is the pdf content of the regulation update by goverment agencies in food and agriculture industry. Can you summarize the important content that can affect the small scale food businesses? In summary, keep the important content like agency name and numbers and remove the unnecessary details."
    final_summary_prompt = "Can you strictly summarize the important content from the below summarized text? Keep important content like agency name and numbers and remove the unnecessary details."

    all_embeddings = []
    
    for d in data:
        pdf_text = read_pdf_data(d["PUBLIC_INSPECTION_PDF_URL"])
        text_chunks = chunk_text(pdf_text)
        summarized_text_chunk = ""
        for _,text_c in enumerate(text_chunks):
            summarized_text_chunk += summarize_text(chunk_summzrize_prompt, text_c)
            
        final_summary = summarize_text(final_summary_prompt, summarized_text_chunk)
        embedded_vector = embedding(final_summary)
        embedding_data = {
                "id": d["ID"],
                "values": embedded_vector,
                "metadata": {
                    "pdf_url": d["PUBLIC_INSPECTION_PDF_URL"],
                    "summary": final_summary,
                }
            }
        all_embeddings.append(embedding_data)
        
        if len(all_embeddings) == 10:
            upsert_to_pinecone(all_embeddings)
            all_embeddings = []
    
    return