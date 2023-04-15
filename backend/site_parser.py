import mongo
import parse_funcs
from models import *
import time
from errors import ErrorHandler


OUR_URL = "https://www.xn--38-vlcai5ag2d.xn--p1ai"

@ErrorHandler
def parse_enemy_site(item:dict, site: Site):
    parse_data = ParseData()
    if site.driver_type == DriverType.REGULAR:
        parse_data = parse_funcs.parse_regular(item, site)
    else:
        parse_data = parse_funcs.parse_selenium(item, site)
    mongo.add_data_to_item(item["_id"]["$oid"], parse_data)

@ErrorHandler
def parse_our_site(item, our_site):
    update_dict = parse_funcs.parse_ours(item, our_site)
    mongo.update_our_item(update_dict)

def parse_sites():
    sites = mongo.get_sites()
    items = mongo.get_items()
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
    our_items = mongo.get_our_items()
    our_site = mongo.get_sites({"url":OUR_URL})
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
            if item["disable_parsing"] == False:
                parse_our_site(item, our_site)
            # update_dict = parse_funcs.parse_ours(item, our_site)
            # mongo.update_our_item(update_dict)
        time.sleep(60)
    
# parse_sites()
# update_our_items()
# time.sleep(60)
# update_our_items(10,20)

# export_our_from_xlsx()
