from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from models import *
from bs4 import BeautifulSoup
import requests
import re
import time
from typing import Tuple
 

options = Options()
options.add_argument('--no-sandbox')
options.add_argument('--disable-gpu')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--headless')
options.add_argument('--start-maximized')
options.add_argument('--ignore-certificate-errors')
options.add_argument('--ignore-ssl-errors')

def parse_selenium(item:dict, site: Site) -> Tuple[int, int]:
    quantity, price = -1, -1
    driver = webdriver.Chrome(options=options)
    driver.get(item["item_link"])
    price_kwargs = site.path_to_price
    price_text = driver.find_element(by=price_kwargs["by"], value=price_kwargs["value"]).get_property("innerText")
    price = int(re.sub('[^0-9]','', price_text.split(".")[0]))
    print(item["item_link"])
    for pipeElement in site.actions:
        if pipeElement.action == "send_keys":
            target =  driver.find_element(by=By.CSS_SELECTOR, value=pipeElement.target)
            target.send_keys(pipeElement.action_args)
        elif pipeElement.action == "remove":
            time.sleep(1)
            
            target =  driver.find_element(by=By.CSS_SELECTOR, value=pipeElement.target)
            # element = driver.find_element_by_class_name('classname')
            driver.execute_script("""
            var target = arguments[0];
            target.parentNode.removeChild(target);
            """, target)
        elif pipeElement.action == "click":
            target =  driver.find_element(by=By.CSS_SELECTOR, value=pipeElement.target)
            target.click()
        elif pipeElement.action == "sleep":
            time.sleep(2)
        elif pipeElement.action == "switch_to_alert":
            alert = driver.switch_to.alert
            quantity = int(alert.text.split("-")[1])
            alert.accept()
    print(item["item_link"], price, quantity)
    driver.close()
    return quantity, price

def parse_regular(item:dict, site: Site) -> Tuple[int, int]:
    quantity, price = -1, -1
    page = requests.get(item["item_link"],  verify=False)
    soup = BeautifulSoup(page.text, "html.parser")
    quant_kwargs = site.path_to_quantity
    price_kwargs = site.path_to_price
    if len(quant_kwargs) == 0 or len(price_kwargs) == 0:
            print(f'NO PATH FOR PRICE OR QUANTITY FOR: {item["item_link"]}')
            return quantity, price
    quantity_target = soup.find(**quant_kwargs)
    if quantity_target != None:
        quantity = int(quantity_target.attrs['data-max'])
    price_target = soup.find(**price_kwargs)
    if price_target != None:
        price = int(re.sub('[^0-9]','', price_target.text))
    return quantity, price
    
def parse_our_site(item:OurItem, our_site: Site):
    page = requests.get(item.item_link.replace(" ",""),  verify=False)
    print(item.item_link)
    soup = BeautifulSoup(page.content, "html.parser")
    price_kwargs = our_site[0].path_to_price
    price_target = soup.find(**price_kwargs)
    print(price_target)
    update_dict={"_id":{"$oid":item.pk.__str__()}}
    if price_target != None:
        price = int(re.sub('[^0-9]','', price_target.text))
        print( price)
        update_dict["last_price"] = price
    return update_dict