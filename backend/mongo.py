from mongoengine import *
from models import *
from urllib.parse import urlsplit
from typing import Union

from bson.json_util import dumps
from datetime import datetime

MONGO_HOST = "mongo"
MONGO_PORT = 27017

#decorator to connect and disconnect from database
def database_connector(func):
    def wrapper_database_connector(*args, **kwargs):
        connect('test', host=MONGO_HOST, port=MONGO_PORT)
        result = func(*args, **kwargs)
        disconnect('test')
        return result
    return wrapper_database_connector


@database_connector
def get_sites(query:dict={}) -> list:
    result = Site.objects(**query)
    return result


@database_connector
def add_site(site: Site ) -> dict:
    site.save()
    return {}


@database_connector
def update_site(entry: dict ) -> dict:
    target_site = Site.objects(url=entry['url'])
    if target_site.count() > 0:
        update_dict = {}
        for key in entry:
            update_dict[f"set__{key}"] = entry[key]
        target_site.update(**update_dict)
    return {}

@database_connector
def add_item(entry: Union[Item, OurItem]) -> dict:
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
    return {}


@database_connector
def link_items(enemy_item_id: str, our_item_id: str) -> dict:
    enemy_item = Item.objects(pk=enemy_item_id).get()
    if enemy_item == None:
        print("ENEMY ITEM NOT FOUND")
        return {}
    OurItem.objects(pk=our_item_id).update_one(push__linked_items=enemy_item)
    return {}

@database_connector
def add_data_to_item(item_id:str, parse_data: ParseData) -> dict:
    Item.objects(pk=item_id).update_one(
        push__data=parse_data, 
        set__last_price=parse_data.price, 
        set__last_quantity=parse_data.quantity
    )      
    return {}


@database_connector
def update_our_item(item_id: str, update_dict:dict) -> dict:
    target_item = OurItem.objects(pk=item_id)
    if target_item.count() > 0:
        target_item.update(**update_dict)

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


@database_connector
def get_items(init_date: str = None, end_date: str = None) -> list:
    #if init_date and end_date empty
    if init_date is None and end_date is None:
        result = Item.objects().all()
        return result.to_json()


    try:
        #if only given end_date
        if init_date is None:
            pipeline = [
            {
                u"$match": {}
            }, 
            {
                u"$project": {
                    u"_id": 0.0,
                    u"name": u"$name",
                    u"item_link": u"$item_link",
                    u"site": u"$site",
                    u"data": {
                        u"$filter": {
                            u"input": u"$data",
                            u"as": u"data",
                            u"cond": {
                                u"$lte": [
                                    u"$$data.date_time",
                                    datetime.strptime(f"{end_date}", "%Y-%m-%d")
                                ]
                            }
                        }
                    }
                }
            }
            ]

        #if only given init_date
        elif end_date is None:
            pipeline = [
            {
                u"$match": {}
            }, 
            {
                u"$project": {
                    u"_id": 0.0,
                    u"name": u"$name",
                    u"item_link": u"$item_link",
                    u"site": u"$site",
                    u"data": {
                        u"$filter": {
                            u"input": u"$data",
                            u"as": u"data",
                            u"cond": {
                                u"$gte": [
                                    u"$$data.date_time",
                                    datetime.strptime(f"{init_date}", "%Y-%m-%d")
                                ]
                            }
                        }
                    }
                }
            }
            ]

        #if given init_date and end_date
        else:
            pipeline = [
            {
                u"$match": {}
            }, 
            {
                u"$project": {
                    u"_id": 0.0,
                    u"name": u"$name",
                    u"item_link": u"$item_link",
                    u"site": u"$site",
                    u"data": {
                        u"$filter": {
                            u"input": u"$data",
                            u"as": u"data",
                            u"cond": {
                                u"$and": [
                                    {
                                        u"$gte": [
                                            u"$$data.date_time",
                                            datetime.strptime(f"{init_date}", "%Y-%m-%d")
                                        ]
                                    },
                                    {
                                        u"$lte": [
                                            u"$$data.date_time",
                                            datetime.strptime(f"{end_date}", "%Y-%m-%d")
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    u"_id": 0.0
                }
            }
            ]
    
        result = dumps(Item.objects().aggregate(pipeline))
    except ValueError:
        return "ERROR: Wrong type of arguments \"init_date\" or \"end_date\""
    return result


@database_connector
def get_our_items() -> list:
    result = OurItem.objects().all()
    return result
    

@database_connector
def get_our_items_with_linked() -> list:
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
    return result