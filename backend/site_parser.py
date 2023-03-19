
import mongo
import parse_funcs
from models import *
import pandas as pd
import time



INIT_DATA_NAME = "init_data.xlsx"


def parse_enemy_site(item:dict, site: Site):
    quantity, price = -1, -1
    if site.driver_type == DriverType.REGULAR:
        quantity, price = parse_funcs.parse_regular(item, site)
    else:
        quantity, price = parse_funcs.parse_selenium(item, site)
    # If any of quantity or price is negative, send alert to telegram
    if quantity == -1 or price == -1:
        print("NOT FOUND PRICE OR QUANTITY")
        print(item["item_link"])
        return
    parse_data = ParseData(quantity=quantity, price=price)
    mongo.add_data_to_item(item["_id"]["$oid"], parse_data)


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
            update_dict = parse_funcs.parse_our_site(item, our_site)
            mongo.update_our_item(update_dict)
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
