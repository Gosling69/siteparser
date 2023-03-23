from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from models import *
from errors import *
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

    try:
        assert requests.get(item["item_link"]).status_code == 200
    except Exception:
        raise AverageError({
            "description":PAGE_NOT_FOUND_ERROR,
            "arguments" : [item["item_link"]]
        })

    driver.get(item["item_link"])
    price_kwargs = site.path_to_price

    try:
        price_text = driver.find_element(by=price_kwargs["by"], value=price_kwargs["value"]).get_property("innerText")
    except NoSuchElementException as e:
        raise MinorError({
            "description":str(e),
            "arguments" : [item["item_link"]]
        })
    
    price = int(re.sub('[^0-9]','', price_text.split(".")[0]))
    print(item["item_link"])
    for pipeElement in site.actions:
        if pipeElement.action == "send_keys":
            target =  driver.find_element(by=By.CSS_SELECTOR, value=pipeElement.target)
            target.send_keys(pipeElement.action_args)
        elif pipeElement.action == "remove":
            time.sleep(1)

            try:
                target =  driver.find_element(by=By.CSS_SELECTOR, value=pipeElement.target)
            except:
                pass

            driver.execute_script("""
            var target = arguments[0];
            target.parentNode.removeChild(target);
            """, target)
        elif pipeElement.action == "click":

            try:
                target =  driver.find_element(by=By.CSS_SELECTOR, value=pipeElement.target)
            except NoSuchElementException as e:
                 raise MinorError({
                    "description":str(e),
                    "arguments" : [item["item_link"]]
                })

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
        raise AverageError({
            "description":PATH_FOR_PRICE_QUANTITY,
            "arguments" : [item["item_link"]]
        })
    quantity_target = soup.find(**quant_kwargs)
    if quantity_target == None:
        raise MinorError({
            "description":QUANTITY_ERROR,
            "arguments" : [item["item_link"]]
        })
    quantity = int(quantity_target.attrs['data-max'])
    price_target = soup.find(**price_kwargs)
    if price_target == None:
        raise MinorError({
            "description":PRICE_ERROR,
            "arguments" : [item["item_link"]]
        })
    price = int(re.sub('[^0-9]','', price_target.text))
    return quantity, price

@ErrorHandler
def parse_our_site(item:OurItem, our_site: Site):
    page = requests.get(item.item_link.replace(" ",""),  verify=False)
    if page.status_code != 200:
        raise AverageError({
            "description":PAGE_NOT_FOUND_ERROR,
            "arguments" : [item["item_link"]]
        })
    print(item.item_link)
    soup = BeautifulSoup(page.content, "html.parser")
    price_kwargs = our_site[0].path_to_price
    price_target = soup.find(**price_kwargs)
    print(price_target)
    update_dict={"_id":{"$oid":item.pk.__str__()}}
    if price_target == None:
        raise MinorError({
            "description":PRICE_ERROR,
            "arguments" : [item["item_link"]]
        })
    price = int(re.sub('[^0-9]','', price_target.text))
    print(price)
    update_dict["last_price"] = price
    return update_dict