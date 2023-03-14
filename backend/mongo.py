from mongoengine import *
from models import *
from urllib.parse import urlsplit
from typing import Union

from bson.json_util import dumps
from datetime import datetime

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
# items = {
#     "Сетка 0,5 к":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743538-setka_2_0_kladochnaya_1_5_kh_0_48",
#     "Сетка п блок":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743539-setka_2_5_kladochnaya_1_5_kh_0_64",
#     "Сетка 1 к":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743536-setka_1_0_kladochnaya_1_5_kh_0_24",
#     "Сетка 1,5 к" :"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743537-setka_1_5_kladochnaya_1_5_kh_0_38",
#     "Сетка 1*3*0,15":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743534-setka_1_kh_3_kh_0_15",
#     "Сетка 1*3*0,2":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743535-setka_1_kh_3_kh_0_20",
#     "Сетка 1*3*0,1":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743533-setka_1_kh_3_kh_0_10",
#     "Керамзит 10/20":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/239962051-keramzit_10_20_40_l_mesh",
#     "Керамзит 5/10":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/240114612-keramzit_0_10_mm_900_l_mkr",
#     "Теплит лайт":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/39635984-uteplitel_teplit_pte_50_3_m_2_tolshchina_50_mm",
#     "Теплит 50":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743524-uteplitel_teplit_50_3_m2",
#     "Теплит 75":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743523-uteplitel_teplit_75_3_m2",
#     "Пеноплекс 50" :"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/188320861-extrudirovanny_penopolistirol_penoplex_50_mm_4_8526_m2_585kh1185_mm",
#     "Пеноплекс 30" :"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743528-extruzionny_penopolisterol_30mm_9_8m2",
#     "Двп 3,2 1,7*2,75":"https://www.xn--38-vlcai5ag2d.xn--p1ai/goods/46743521-osp_9_mm_122_kh_244",

# }
# enemy_items = {
#     "Сетка 0,5 к":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/kladochnaya-setka/setka-kladochnaya-0-12kh1-5-m/",
#     "Сетка п блок":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/kladochnaya-setka/setka-kladochnaya-0-18kh1-5-m/",
#     "Сетка 1 к":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/kladochnaya-setka/setka-kladochnaya-0-24kh1-5-m/",
#     "Сетка 1,5 к" :"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/kladochnaya-setka/setka-kladochnaya-0-38kh1-5-m/",
#     "Сетка 1*3*0,15":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/kladochnaya-setka/setka-kladochnaya-1kh3-m-15kh15-10-otkrytyy-kontur/",
#     "Сетка 1*3*0,2":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/kladochnaya-setka/setka-kladochnaya-1kh3-m-20kh20-10-otkrytyy-kontur/",
#     "Сетка 1*3*0,1":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/kladochnaya-setka/setka-kladochnaya-1kh3-m-10kh10-10-otkrytyy-kontur/",
#     "Керамзит 10/20":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/keramzit_1/keramzit-fraktsiya-10-20-mm_1/",
#     "Керамзит 5/10":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/keramzit_1/keramzit-fraktsiya-5-10-mm_1/",
#     "Теплит лайт":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/bazalt-minplita/min-plita-teplit-layt-super-pl-27kg-m3-1000kh500kh50-6-plit-3m2-0-15m3-t-u/",
#     "Теплит 50":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/bazalt-minplita/min-plita-teplit-blok-standart-pl-45kg-m3-1000kh500kh50-6-plit-3m2-0-15m3-t-u/",
#     "Теплит 75":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/bazalt-minplita/min-plita-p-75-teplit-1000kh500kh50-6-plit-3m2-0-15m3-t-u/",
#     "Пеноплекс 30" :"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/ekstruziya-xps/penopolistirol-penopleks-komfort-50-mm/",
#     "Двп 3,2 1,7*2,75":"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/ekstruziya-xps/plity-penopleks-komfort-30kh585kh1185-t-15-13-sht-0-2704-m3-s-16-07-2018/",
#     "Пеноплекс 50" :"https://xn--80afpacjdwcqkhfi.xn--p1ai/catalog/dvp/dvp-3-4kh1700kh2745-168-lesosibirsk/",

# }
# def run_add():
#     for name in items:
#         new_item = OurItem(
#             name=name,
#             item_link=items[name]
#         )
#         add_item(new_item)
# run_add()
# def run_add_enemy():
#     for name in enemy_items:
#         new_item = Item(
#             name=name,
#             item_link=enemy_items[name]
#         )
#         add_item(new_item)
# run_add_enemy()
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