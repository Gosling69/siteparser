from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webdriver import By
import mongo
from models import *
from bs4 import BeautifulSoup
import requests
import pandas as pd

INIT_DATA_NAME = "init_data.xlsx"

def parse_sites():
    sites = mongo.get_sites()
    items = mongo.get_items()
    for item in items:
        page = requests.get(item.item_link)
        soup = BeautifulSoup(page.text, "html.parser")
        quant_kwargs = {}
        price_kwargs = {}
        for site in sites:
            if site.pk == item.site.pk:
                price_kwargs = site.path_to_price
                quant_kwargs = site.path_to_quantity
                break
            if len(quant_kwargs) == 0 or len(price_kwargs) == 0:
                continue
            
        quantity, price = 0, 0
        quantity_target = soup.find(**quant_kwargs)
        if quantity_target != None:
            quantity = int(quantity_target.attrs['data-max'])

        price_target = soup.find(**price_kwargs)
        if price_target != None:
            price = int(price_target.text.replace(" ", ""))

        parse_data = ParseData(quantity=quantity, price=price)
        mongo.add_data_to_item(item.pk, parse_data)

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
