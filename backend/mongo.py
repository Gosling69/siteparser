from mongoengine import *
from models import *
from urllib.parse import urlsplit

from bson.json_util import dumps
from datetime import datetime

MONGO_HOST = "mongo"
MONGO_PORT = 27017

def get_sites() -> list:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    result = Site.objects().all()
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

def add_item(entry: Item) -> dict:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    item_exists = Item.objects(item_link=entry.item_link).count() != 0
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

def add_data_to_item(item_id:str, parse_data: ParseData) -> dict:
    connect('test',host=MONGO_HOST, port=MONGO_PORT)
    Item.objects(pk=item_id).update_one(push__data=parse_data)
    disconnect('test')
    return {}

def update_item(entry: Item ) -> dict:
    return {}

def link_items(enemy_item: Item, our_item: Item) -> dict:
    return {}

def get_items(init_date: str = None, end_date: str = None) -> list:
    connect('test', host=MONGO_HOST, port=MONGO_PORT)

    #if init_date and end_date empty
    if init_date is None and end_date is None:
        result = Item.objects().all()
        disconnect('test')
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
        disconnect('test')
        return "ERROR: Wrong type of arguments \"init_date\" or \"end_date\""
    disconnect('test')
    return result

