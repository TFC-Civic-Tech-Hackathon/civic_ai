import requests
import json
import pandas as pd
from datetime import datetime
from pathlib import Path

def format_date(date_str):
    if not date_str or date_str == 'N/A':
        return 'N/A'
    try:
        # Parse ISO format date
        date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        # Format to readable string
        return date_obj.strftime('%B %d, %Y at %I:%M %p UTC')
    except ValueError:
        return date_str

def fetch_federal_register_documents(document_ids):
    all_data = []
    
    for doc_id in document_ids:
        url = f"https://www.federalregister.gov/api/v1/documents/{doc_id}.json"
        
        try:
            print(f"\nFetching document ID: {doc_id}")
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Get action and check for rule or notice
            action = data.get('action', '').lower()
            if any(keyword in action for keyword in ['rule', 'notice']):
                csv_data = {
                    'ID': data.get('document_number', 'N/A'),
                    'AGENCY': data.get('agencies', [{}])[0].get('name', 'N/A'),
                    'ACTION': data.get('action', 'N/A'),
                    'SUMMARY': data.get('abstract', 'N/A'),
                    'DATES': data.get('dates', 'N/A'),
                    'PUBLIC_INSPECTION_PDF_URL': data.get('public_inspection_pdf_url', 'N/A'),
                    'LAST_UPDATED': data.get('page_views', {}).get('last_updated', 'N/A'),
                    'PUBLICATION_DATE': data.get('publication_date', 'N/A')
                }
                all_data.append(csv_data)
                print(f"Added document {doc_id} to dataset")
            else:
                print(f"Skipping document {doc_id} - Not a rule or notice")
                
        except requests.exceptions.RequestException as e:
            print(f"Error fetching document {doc_id}: {e}")
    
    return all_data

if __name__ == "__main__":
    # List of document IDs to process
    document_ids = ['2024-16963', '2024-27280', '2023-04815']  
    
    # Fetch all documents
    data = fetch_federal_register_documents(document_ids)
    
    if data:
        # Convert to pandas DataFrame
        df = pd.DataFrame(data)
        
        # Create output directory
        output_dir = Path('data')
        output_dir.mkdir(exist_ok=True)
        
        # Save to CSV with timestamp and pipe separator
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        csv_filename = output_dir / f'federal_register_data_{timestamp}.csv'
        df.to_csv(csv_filename, index=False, sep='|')
        
        print(f"\nData saved to CSV: {csv_filename}")
        # print("\nDataFrame Preview:")
        # print("=" * 50)
        # Display DataFrame with pipe separator
        # print(df.to_string(index=False).replace('  ', ' | '))
    else:
        print("No valid documents found")
