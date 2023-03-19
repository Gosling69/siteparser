from mongoengine import *
from models import *
from urllib.parse import urlsplit
from typing import Union
from json import loads
from bson.json_util import dumps
from bson.objectid import ObjectId
from datetime import datetime
import parse_funcs

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
    entry_site = Site.objects.get(url=url)
    entry.site = entry_site
    entry.save()
    if type(entry) is Item:
        if entry_site.driver_type == DriverType.REGULAR:
            parsefunc = parse_funcs.parse_regular
        else:
            parsefunc = parse_funcs.parse_selenium
        quantity, price = parsefunc(entry, entry_site)
        if quantity != -1 and price != -1:
            add_data_to_item(entry.pk.__str__(), ParseData(quantity=quantity, price=price))
    else:
        update_dict = parse_funcs.parse_our_site(entry, entry_site)
        update_our_item(update_dict)
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
def update_item(entry: dict ) -> dict:
    target_item = Item.objects(id=entry["_id"]["$oid"])
    if target_item.count() > 0:
        update_dict = {}
        for key in entry:
            if key in ["name","item_link","site"]:
                if type(entry[key]) is dict:
                    update_dict[f"set__{key}"] = ObjectId(entry[key]["_id"]["$oid"]) 
                else:
                    update_dict[f"set__{key}"] = entry[key]
        # print(update_dict)
        target_item.update(**update_dict)
    return {}

@database_connector
def update_our_item(entry: dict ) -> dict:
    target_item = OurItem.objects(id=entry["_id"]["$oid"])
    if target_item.count() > 0:
        update_dict = {}
        for key in entry:
            if key in ["name","item_link", "linked_items","last_price"]:
                if type(entry[key]) is dict:
                    update_dict[f"set__{key}"] = ObjectId(entry[key]["_id"]["$oid"]) 
                elif type(entry[key]) is list:
                    update_dict[f"set__{key}"] = list(map(lambda el : ObjectId(el), entry[key])) 
                else:
                    update_dict[f"set__{key}"] = entry[key]
        print(update_dict)
        target_item.update(**update_dict)
    return {}


@database_connector
def get_items(init_date: str = None, end_date: str = None) -> list:
    #if init_date and end_date empty
    if init_date is None and end_date is None:
        pipeline = [
            {
                "$lookup":
                    {
                        "from": "site",
                        "localField": "site",
                        "foreignField": "_id",
                        "as": "site"
                    }
            },
            { "$unwind": { "path": "$site" } },
            {
                "$project": 
                {
                    "_id": 1,
                    "name": 1,
                    "item_link": 1,
                    "last_price": 1,
                    "last_quantity":1,
                    "site.name": 1,
                    "site._id":1,
                    # "data":1,
                }
            }
        ]
        result = loads(dumps(Item.objects().aggregate(pipeline)))
        return result


    try:
        #if only given end_date
        if init_date is None:
            pipeline = [
            {
                u"$match": {}
            }, 
            {
                u"$project": {
                    u"_id": 1,
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
                    u"_id": 1,
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
                "$lookup":
                    {
                        "from": "site",
                        "localField": "site",
                        "foreignField": "_id",
                        "as": "site"
                    }
            },
            { "$unwind": { "path": "$site" } },
            {
                "$project": 
                {
                    "_id": 1,
                    "name": 1,
                    "item_link": 1,
                    # "last_price": 1,
                    # "last_quantity":1,
                    "site.name": 1,
                    "site._id":1,
                    "data":1,
                }
            },
            {
                u"$match": {}
            }, 
            {
                u"$project": {
                    u"_id": 1,
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
                    u"_id": 1
                }
            }
            ]
    
        result = loads(dumps(Item.objects().aggregate(pipeline)))
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
                    "$match": 
                    {
                        "$expr": {
                        "$in": [
                            "$_id",
                            "$$linked_items"
                        ]
                        }
                    }
                },
                {
                    "$lookup":
                    {
                        "from": "site",
                        "localField": "site",
                        "foreignField": "_id",
                        "as": "site"
                    }
                },
                { 
                    "$unwind": 
                    { 
                        "path": "$site" 
                        } 
                },
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
            "linked_items._id":1,
            "linked_items.name": 1,
            "linked_items.last_price": 1,
            "linked_items.last_quantity": 1,
            "linked_items.site._id": 1,
            "linked_items.site.name": 1,
            "linked_items.item_link": 1
            }
        }

    ])
    result = []
    #Replace with map function or project id's 
    for item in our_items:
        item['_id'] = {"$oid":item['_id'].__str__()}
        for linked_item in item["linked_items"]:
            linked_item['_id'] = {"$oid":linked_item['_id'].__str__()}
            linked_item["site"]['_id'] = {"$oid":linked_item["site"]['_id'].__str__()}
        result.append(item)
    return result