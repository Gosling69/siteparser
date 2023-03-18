from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import mongo
from models import *
from bs4 import BeautifulSoup
import requests
import pandas as pd
import re
import time
from typing import Tuple
 


INIT_DATA_NAME = "init_data.xlsx"
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
    for pipeElement in site.actions:
        if pipeElement.action == "send_keys":
            target =  driver.find_element(by=By.CSS_SELECTOR, value=pipeElement.target)
            target.send_keys(pipeElement.action_args)
        elif pipeElement.action == "click":
            target =  driver.find_element(by=By.CSS_SELECTOR, value=pipeElement.target)
            target.click()
        elif pipeElement.action == "sleep":
            time.sleep(1)
        elif pipeElement.action == "switch_to_alert":
            alert = driver.switch_to.alert
            quantity = int(alert.text.split("-")[1])
            alert.accept()
    # print(int(re.sub('[^0-9]','', price.split(".")[0])), quantity)
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
            return
    quantity_target = soup.find(**quant_kwargs)
    if quantity_target != None:
        quantity = int(quantity_target.attrs['data-max'])
    price_target = soup.find(**price_kwargs)
    if price_target != None:
        price = int(re.sub('[^0-9]','', price_target.text))
    return quantity, price

def parse_enemy_site(item:dict, site: Site):
    quantity, price = -1, -1
    if site.driver_type == DriverType.REGULAR:
        quantity, price = parse_regular(item, site)
    else:
        quantity, price = parse_selenium(item, site)
    # If any of quantity or price is negative, send alert to telegram
    if quantity == -1 or price == -1:
        print("NOT FOUND PRICE OR QUANTITY")
        print(item["item_link"])
        return
    parse_data = ParseData(quantity=quantity, price=price)
    mongo.add_data_to_item(item["_id"]["$oid"], parse_data)

def parse_our_site(item:OurItem, our_site=mongo.get_sites({"url":"https://www.xn--38-vlcai5ag2d.xn--p1ai"})):
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
    mongo.update_our_item(update_dict)

def parse_sites():
    sites = mongo.get_sites()
    items = mongo.get_items()
    for item in items:
        target_site = [site for site in sites if site.pk.__str__() == item["site"]["_id"]["$oid"] ]
        if len(target_site) == 1:
            parse_enemy_site(item, target_site[0])

def update_our_items():
    our_items = mongo.get_our_items()
    our_site = mongo.get_sites({"url":"https://www.xn--38-vlcai5ag2d.xn--p1ai"})
    if len(our_site) == 0:
        print("OUR SITE NOT FOUND")
        return
    if len(our_site) > 1:
        print("MORE THAN ONE SITE FOUND")
        return
    indexes = []
    for i in range(len(our_items)//10 + 1):
        indexes.append([10*i, 10*(i+1)])
        pass
    # price_kwargs = our_site[0].path_to_price
    for [init,end] in indexes:
        for item in our_items[init:end]:
            parse_our_site(item, our_site)
        time.sleep(60)
    
# parse_sites()
# update_our_items()
# time.sleep(60)
# update_our_items(10,20)
def export_from_xlsx():
    xl = pd.ExcelFile(INIT_DATA_NAME)
    for i in range(2):
        dataframe = pd.read_excel(INIT_DATA_NAME, sheet_name=xl.sheet_names[i])
        names = dataframe['Name'].values
        links = dataframe['Link'].values
        for i in range(len(names)):
            new_item = Item(
                name = names[i],
                item_link = links[i]
            )
            mongo.add_item(new_item)
            
def export_our_from_xlsx():
    xl = pd.ExcelFile(INIT_DATA_NAME)
    dataframe = pd.read_excel(INIT_DATA_NAME, sheet_name=xl.sheet_names[3])
    names = dataframe['Name'].values
    links = dataframe['Link'].values
    for i in range(len(names)):
        new_item = OurItem(
            name = names[i],
            item_link = links[i]
        )
        mongo.add_item(new_item)
# export_our_from_xlsx()
