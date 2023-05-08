
from work_with_db.mongo import *
import parse_funcs.parse_funcs as parse_funcs
from models.models import *
import time
from errors.errors import ErrorHandler
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)


OUR_URL = os.environ.get('OUR_URL') 

@ErrorHandler
def parse_enemy_site(item:dict, site: Site):
    parse_data = ParseData()
    if site.driver_type == DriverType.REGULAR:
        parse_data = parse_funcs.parse_regular(item, site)
    else:
        parse_data = parse_funcs.parse_selenium(item, site)
    add_data_to_item(item["_id"]["$oid"], parse_data)

@ErrorHandler
def parse_our_site(item, our_site):
    update_dict = parse_funcs.parse_ours(item, our_site)
    update_our_item(update_dict)

def parse_sites():
    sites = get_sites()
    items = get_items()
    for item in items:
        target_site = [site for site in sites if site.pk.__str__() == item["site"]["_id"]["$oid"]]
        # print(type(target_site))
        if len(target_site) == 1:
            target_site = target_site[0]
            parse_enemy_site(item, target_site)
            # quantity, price = -1, -1
            # if target_site.driver_type == DriverType.REGULAR:
            #     quantity, price = parse_funcs.parse_regular(item, target_site)
            # else:
            #     quantity, price = parse_funcs.parse_selenium(item, target_site)
            # parse_data = ParseData(quantity=quantity, price=price)
            # mongo.add_data_to_item(item["_id"]["$oid"], parse_data)


# parse_sites()
def update_our_items():
    our_items = get_our_items()
    our_site =  get_sites({"url":OUR_URL})
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
            # update_dict = parse_funcs.parse_ours(item, our_site)
            # mongo.update_our_item(update_dict)
        time.sleep(60)
    
# parse_sites()
# update_our_items()
# time.sleep(60)
# update_our_items(10,20)

# export_our_from_xlsx()
