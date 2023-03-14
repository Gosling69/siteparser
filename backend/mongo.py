from mongoengine import *
from models import *
from urllib.parse import urlsplit
from typing import Union

MONGO_HOST = "mongo"
MONGO_PORT = 27017

def get_sites(query:dict={}) -> list:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    result = Site.objects(**query)
    disconnect('test')
    return result

def add_site(site: Site ) -> dict:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    site.save()
    disconnect('test')
    return {}

def update_site(entry: dict ) -> dict:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    target_site = Site.objects(url=entry['url'])
    if target_site.count() > 0:
        update_dict = {}
        for key in entry:
            update_dict[f"set__{key}"] = entry[key]
        target_site.update(**update_dict)
    disconnect('test')
    return {}

def add_item(entry: Union[Item, OurItem]) -> dict:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    item_exists = entry.__class__.objects(item_link=entry.item_link).count() != 0
    if item_exists:
        print("ALREADY EXISTS")
        return {}
    split_url = urlsplit(entry.item_link)
    url = split_url.scheme + '://' + split_url.netloc 
    item_site = Site.objects(url=url)
    if item_site.count() == 0:
        split_url = urlsplit(entry.item_link)
        new_site = Site(
            url = split_url.scheme + '://' + split_url.netloc 
        )
        new_site.save()
    entry.site = Site.objects.get(url=url)
    entry.save()
    disconnect('test')
    return {}

def link_items(enemy_item_id: str, our_item_id: str) -> dict:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    enemy_item = Item.objects(pk=enemy_item_id).get()
    if enemy_item == None:
        print("ENEMY ITEM NOT FOUND")
        return {}
    OurItem.objects(pk=our_item_id).update_one(push__linked_items=enemy_item)
    disconnect('test')
    return {}

def add_data_to_item(item_id:str, parse_data: ParseData) -> dict:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    Item.objects(pk=item_id).update_one(
        push__data=parse_data, 
        set__last_price=parse_data.price, 
        set__last_quantity=parse_data.quantity
    )
    disconnect('test')         
    return {}

def update_our_item(item_id: str, update_dict:dict) -> dict:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    target_item = OurItem.objects(pk=item_id)
    if target_item.count() > 0:
        target_item.update(**update_dict)
    disconnect('test')

# def update_item(entry: Union[Item, OurItem] ) -> dict:
#     connect('test',host=MONGO_HOST, port=MONGO_PORT)
#     target_item = entry.__class__.objects(item_link=entry['item_link'])
#     if target_item.count() > 0:
#         update_dict = {}
#         for key in entry:
#             if key not in ["data","item_link"]:
#                 update_dict[f"set__{key}"] = entry[key]
#         target_item.update(**update_dict)
#     disconnect('test')
#     return {}


def get_items() -> list:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    result = Item.objects().all()
    disconnect('test')
    return result
def get_our_items() -> list:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    result = OurItem.objects().all()
    disconnect('test')
    return result
    
def get_our_items_with_linked() -> list:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    our_items = OurItem.objects().aggregate([
        { 
            "$lookup": {
            "from": "item",
            "let": {
                "linked_items": "$linked_items"
            },
            "pipeline": [
                {
                "$match": {
                    "$expr": {
                    "$in": [
                        "$_id",
                        "$$linked_items"
                    ]
                    }
                }
                }
            ],
            "as": "linked_items"
            }
        },
        {
            "$project": {
            "_id": 1,
            "name": 1,
            "item_link": 1,
            "last_price": 1,
            "linked_items.name": 1,
            "linked_items.last_price": 1,
            "linked_items.item_link": 1
            }
        }

    ])
    result = []
    for item in our_items:
        item['_id'] = {"$oid":item['_id'].__str__()}  
        result.append(item)
    disconnect('test')
    return result