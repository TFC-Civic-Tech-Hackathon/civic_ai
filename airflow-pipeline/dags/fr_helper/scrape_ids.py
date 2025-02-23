from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup as soup
import configparser

config = configparser.ConfigParser()
config.read('/opt/airflow/dags/configuration.properties')

webdriver_url = config['SCRAPE']['remote_url']
def scrape_data(url):
    chrome_options = Options()
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Remote(
        command_executor=webdriver_url, 
        options=chrome_options
    )

    all_results = []
    count = 1
    while True:
        if count ==2:
            break
        print(f"Scraping page {count}")
        driver.get(url)
        
        # Wait for the page to load
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Parse HTML
        html = driver.page_source
        market_soup = soup(html, 'html.parser')

        # Extract data from current page
        all_tags = market_soup.find_all('div', class_="document-clipping-actions")
        res = [tags.get('data-document-number') for tags in all_tags]
        all_results.extend(res)

        # Try to find the "Next" button
        try:
            next_button = driver.find_element(By.CSS_SELECTOR, "li.next a")
            next_page_url = next_button.get_attribute("href")

            if next_page_url:
                count += 1
                url = next_page_url  # Update the URL for the next loop iteration
            else:
                break  # No next page, exit the loop
        except:
            break  # No "Next" button found, stop the loop

    driver.quit()
    return all_results



# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager
# from bs4 import BeautifulSoup as soup

# def scrape_data(url):
#   chrome_options = Options()
#   chrome_options.add_argument("--disable-dev-shm-usage")

#   driver = webdriver.Remote(
#     command_executor="http://homelab.chaudharyanshul.com:4443/wd/hub", 
#     options=chrome_options
#   )

#   driver.get(url)
#   html = driver.page_source
#   market_soup = soup(html, 'html.parser')

#   driver.quit()

#   all_tags = market_soup.find_all('div', class_="document-clipping-actions")

#   res = [tags.get('data-document-number') for tags in all_tags]
#   return res



# from splinter import Browser
# from bs4 import BeautifulSoup as soup
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager

# # 35.232.212.154
# def scrape_data(url):
#   chrome_options = Options()
#   chrome_options.add_experimental_option("debuggerAddress", "35.232.212.154:4444")  # Connect to running Chrome

#   # Use WebDriver Manager to manage driver compatibility
#   browser = Browser('chrome', options=chrome_options, executable_path=ChromeDriverManager().install())

#   browser.visit(url)

#   html = browser.html
#   market_soup = soup(html, 'html.parser')

#   browser.quit()

#   all_tags = market_soup.find_all('div', class_="document-clipping-actions")

#   res = [tags.get('data-document-number') for tags in all_tags]

#   return res
