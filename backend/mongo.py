from mongoengine import *
from models import *
from urllib.parse import urlsplit
from typing import Union
from json import loads
from bson.json_util import dumps
from bson.objectid import ObjectId
from datetime import datetime
import parse_funcs
import json
from db_decorator import database_connector
from errors import ErrorHandler
from work_with_telegram import send_message_to_group

# SITE METHODS
@database_connector
def init_standart_sites():
    site_list = [
        {
            "url" : "https://xn--80afpacjdwcqkhfi.xn--p1ai",
            "path_to_price" : {
                "name" : "span",
                "class_" : "price_value"
            },
            "path_to_quantity" : {
                "name" : "span",
                "class_" : "plus"
            },
            "driver_type" : "regular",
            "actions" : [

            ],
            "name" : "СтройЛогистика"
        },
        {
            "url" : "https://irkutsk.pechnoy-mir.ru",
            "path_to_price" : {
                "name" : "span",
                "class_" : "price_value"
            },
            "path_to_quantity" : {
                "name" : "span",
                "class_" : "plus"
            },
            "driver_type" : "regular",
            "actions" : [

            ],
            "name" : "Печной Мир"
        },
        {
            "url" : "https://www.xn--38-vlcai5ag2d.xn--p1ai",
            "path_to_price" : {
                "name" : "i",
                "class_" : "bp-price"
            },
            "path_to_quantity" : {

            },
            "driver_type" : "regular",
            "actions" : [

            ],
            "name" : "НашКирпич"
        },
        {
            "url" : "https://shop.palp-nord.ru",
            "path_to_price" : {
                "by" : "class name",
                "value" : "single_item_price"
            },
            "path_to_quantity" : {

            },
            "driver_type" : "selenium",
            "actions" : [
                {
                    "target" : "body > jdiv",
                    "action" : "remove",
                    "action_args" : ""
                },
                {
                    "target" : "#input-quantity",
                    "action" : "send_keys",
                    "action_args" : "10000000"
                },
                {
                    "target" : "#add_to_cart",
                    "action" : "click",
                    "action_args" : ""
                },
                {
                    "target" : "",
                    "action" : "sleep",
                    "action_args" : "1"
                },
                {
                    "target" : "",
                    "action" : "switch_to_alert",
                    "action_args" : ""
                }
            ],
            "name" : "ПалпНарод"
        }
    ]
    for site in site_list:
        new_site = Site.from_json(json_data=json.dumps(site))
        if Site.objects(url=new_site.url).count() == 0:
            new_site.save()
        else:
            print(new_site.url, "ALREADY THERE")

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
def delete_site(site_id: str):

    #pipeline to copy selected site to dump collection
    pipeline = [
        {
            u"$match": {
                u"_id": ObjectId(f"{site_id}")
            }
        }, 
        {
            u"$merge": {
                u"into": u"dump_site"
            }
        }
    ]

    Site.objects().aggregate(pipeline)
    #saving selected site to check if we already deleted it
    to_delete = Site.objects(id = ObjectId(f"{site_id}"))
    if len(to_delete) == 0:
        return f"ERROR: site with id {site_id} doesn't exist"
    to_delete.delete()
    return f"deleted site with id {site_id}"

# CATEGORIES METHODS
@database_connector
def get_categories(query:dict={}) -> list:
    result = Category.objects(**query)
    return result

@ErrorHandler
@database_connector
def add_category(entry:Category) -> dict:
    item_exists = entry.__class__.objects(name=entry.name).count() != 0
    if item_exists:
        print("ALREADY EXISTS")
        return {"error":"ALREADY EXISTS"}
    entry.save()
    return {"status":"OK"}

@database_connector
def update_category(entry: dict ) -> dict:
    target_item = Category.objects(id=entry["_id"]["$oid"])
    if target_item.count() > 0:
        update_dict = {}
        for key in entry:
            if key in ["name", "properties", "site"]:
                if type(entry[key]) is dict:
                    update_dict[f"set__{key}"] = ObjectId(entry[key]["_id"]["$oid"]) 
                else:
                    update_dict[f"set__{key}"] = entry[key]
        # print(update_dict)
        target_item.update(**update_dict)
    return {}

@database_connector
def delete_category(category_id: str):   
    #saving selected item to check if we already deleted it
    to_delete = Category.objects(id = ObjectId(f"{category_id}"))
    
    if len(to_delete) == 0:
        return f"ERROR: item with id {category_id} doesn't exist"
    
    to_delete.delete()
    return f"deleted item with id {category_id}"


# ITEM METHODS

@ErrorHandler
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
        parse_data = parsefunc(entry, entry_site)
        add_data_to_item(entry.pk.__str__(), parse_data)
    else:
        update_dict = parse_funcs.parse_ours(entry, [entry_site])
        update_our_item(update_dict)
    return {}

# @database_connector
# def add_data_to_report(item:Item, parse_data: ParseData) -> dict:
#     report_item = ReportItem(
#         price_before = item.last_price,
#         price_now = parse_data.price,
#         # site_name = item.site.name,
#         link = item.item_link,
#         name =item.name,
#     )
#     target_report = Report.objects(date=parse_data.date_time).get()
#     if target_report is None:
#         new_report = Report(
#             items=[report_item]
#         )
#         new_report.save()
#     else:
#         target_report.update_one(push__items = report_item)
#     # target_report.save()
#     return {}

# add_data_to_report()
@ErrorHandler
@database_connector
def add_data_to_item(item_id:str, parse_data: ParseData) -> dict:
    target_item = Item.objects(pk=item_id)
    if len(target_item[0].data) and target_item[0].data.pop().price != parse_data.price:
        msg = f"Price change for:{target_item[0].item_link}\nbefore: {target_item[0].data[-1].price}\nafter: {parse_data.price} "
        send_message_to_group(msg)
        # add_data_to_report(target_item, parse_data)
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
            if key not in ["last_qunatity", "last_price", "_id", "site"]:
                update_dict[f"set__{key}"] = entry[key]

                # if type(entry[key]) is dict and "_id" in entry[key]:
                #     update_dict[f"set__{key}"] = ObjectId(entry[key]["_id"]["$oid"]) 
                # else:
                #     update_dict[f"set__{key}"] = entry[key]
        # print(update_dict)
        target_item.update(**update_dict)
    return {}


def remove_duplicates_from_items(items: list) -> list:
    new_items = []
    for item in items:
        prev_price = -1
        prev_quantity = -1
        
        new_data = []

        for data in item["data"]:
            if (data["quantity"] == prev_quantity) and (data["price"] == prev_price):
                continue
            else:
                new_data.append(data)
            
            prev_price = data["price"]
            prev_quantity = data["quantity"]

        item["data"] = new_data

        new_items.append(item)
        
    return new_items


@database_connector
def get_items(init_date: str = None, end_date: str = None) -> list:
    #if init_date and end_date empty
    if init_date is None or end_date is None:
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
            { "$unwind": { "path": "$site","preserveNullAndEmptyArrays": True } },
            # {
            # "$lookup":
            #     {
            #         "from": "category",
            #         "localField": "category",
            #         "foreignField": "_id",
            #         "as": "category"
            #     }
            # },
            # { "$unwind": { "path": "$category","preserveNullAndEmptyArrays": True  } },
            {
                "$project": 
                {
                    "_id": 1,
                    "name": 1,
                    "item_link": 1,
                    "last_price": 1,
                    "last_quantity":1,
                    "category":1,
                    # "category.values":1,
                    # "category._id":1,                    
                    # "category.name":1,
                    # "category.properties":1,
                    "site.name": 1,
                    "site._id":1,
                    # "data":1,
                }
            }
        ]
        result = loads(dumps(Item.objects().aggregate(pipeline)))
        return result


    #if given init_date and end_date
    try:
        
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
                "site.name": 1,
                "site._id":1,
                "category":1,
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

        items = Item.objects().aggregate(pipeline)
        unique_items = items
        # unique_items = remove_duplicates_from_items(items)
    
        result = loads(dumps(unique_items))

    except ValueError as e:
        print(f"ERROR is {e}")
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
            "disable_parsing":1,
            "category":1,
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

@database_connector
def update_our_item(entry: dict ) -> dict:
    target_item = OurItem.objects(id=entry["_id"]["$oid"])
    if target_item.count() > 0:
        update_dict = {}
        for key in entry:
            if key not in ["_id", "site"]:
                # if type(entry[key]) is dict and "_id" in entry[key]:
                #     update_dict[f"set__{key}"] = ObjectId(entry[key]["_id"]["$oid"]) 
                if type(entry[key]) is list:
                    update_dict[f"set__{key}"] = list(map(lambda el : ObjectId(el), entry[key])) 
                else:
                    update_dict[f"set__{key}"] = entry[key]
        # print(update_dict)
        target_item.update(**update_dict)
    return {}


@database_connector
def get_one_item(item_id: str = None, init_date: str = None, end_date: str = None) -> list:
    
    if item_id is None or init_date is None or end_date is None:
        return "ERROR: Wrong type of arguments \"item_id\" or \"init_date\" or \"end_date\""

    try:
        pipeline = [
        {
            u"$match": {
                u"_id": ObjectId(f"{item_id}")
            }
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

        items = Item.objects().aggregate(pipeline)

        unique_items = remove_duplicates_from_items(items)

        result = loads(dumps(unique_items))
    except ValueError:
        return "ERROR: Wrong type of arguments \"init_date\" or \"end_date\""
    return result

@database_connector
def delete_item(item_id: str):
    #pipeline to copy selected item to dump collection
    pipeline = [
        {
            u"$match": {
                u"_id": ObjectId(f"{item_id}")
            }
        }, 
        {
            u"$merge": {
                u"into": u"dump_item"
            }
        }
    ]

    Item.objects().aggregate(pipeline)
    #saving selected item to check if we already deleted it
    to_delete = Item.objects(id = ObjectId(f"{item_id}"))
    
    if len(to_delete) == 0:
        return f"ERROR: item with id {item_id} doesn't exist"
    
    to_delete.delete()
    return f"deleted item with id {item_id}"



@database_connector
def delete_our_item(our_item_id: str):

    #pipeline to copy selected our_item to dump collection
    pipeline = [
        {
            u"$match": {
                u"_id": ObjectId(f"{our_item_id}")
            }
        }, 
        {
            u"$merge": {
                u"into": u"dump_our_item"
            }
        }
    ]

    OurItem.objects().aggregate(pipeline)

    #saving selected our_item to check if we already deleted it
    to_delete = OurItem.objects(id = ObjectId(f"{our_item_id}"))
    
    if len(to_delete) == 0:
        return f"ERROR: our item with id {our_item_id} doesn't exist"
    
    to_delete.delete()
    return f"deleted our item with id {our_item_id}"
    
@database_connector
def add_error(error) -> dict:
    db_error = Error(
        description = error.ErrorArguments["description"],
        arguments = error.ErrorArguments["arguments"],
        level = error.__class__,
    )
    print(error.__class__)
    print(error.ErrorArguments["arguments"])
    print(error.ErrorArguments["description"])
    print(db_error)
    pass