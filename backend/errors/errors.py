
from work_with_db.db_decorator import database_connector
from models.models import Error, ErrorLevel
from typing import Union
from json import loads
from bson.json_util import dumps
from work_with_telegram.work_with_telegram import send_message
import traceback

QUANTITY_ERROR = "Quantity Not Found"
PRICE_ERROR = "Price Not Found"
PAGE_NOT_FOUND_ERROR = "Page not found"
PATH_FOR_PRICE_QUANTITY = "No path for price or quantity"

def ErrorHandler(func):
    def InnerFunc(*args, **kwargs):
        try:
            result = func(*args, **kwargs)
            return result
        except MinorError as e:
            add_error(e)
            print(e.__dict__)
        except AverageError as e:
            add_error(e)
            condition = True
            if condition:
                pass
                # send_message(e.__dict__.__repr__())
            print(e.__dict__)
        except SevereError as e:
            add_error(e)
            send_message(e.__dict__.__repr__())
            print(e.__dict__)
        except Exception as e:
            print(traceback.format_exc())
            send_message(traceback.format_exc())
    return InnerFunc

class MinorError(Exception):
    def __init__(self, *args, **kwargs: object) -> None:
        super().__init__(*args)
        self.description = kwargs.get('description', None)
        self.item_link = kwargs.get('item_link', None)
        self.level = ErrorLevel.MINOR

class AverageError(Exception):
    def __init__(self, *args, **kwargs: object) -> None:
        super().__init__(*args)
        self.description = kwargs.get('description', None)
        self.item_link = kwargs.get('item_link', None)
        self.level = ErrorLevel.AVERAGE

class SevereError(Exception):
    def __init__(self, *args, **kwargs: object) -> None:
        super().__init__(*args)
        self.description = kwargs.get('description', None)
        self.item_link = kwargs.get('item_link', None)
        self.level = ErrorLevel.SEVERE
    

@database_connector
def find_occured_error():
    pass

@database_connector
def add_error(error: Union[MinorError, AverageError, SevereError ] ) -> dict:
    db_error = Error(
        description = error.description,
        item_link = error.item_link,
        level = error.level
    )
    db_error.save()

@database_connector
def get_errors() -> dict:
    pipeline = [
        {"$group" : 
            {
                "_id":{"level":"$level", "description":"$description","item_link":"$item_link",}, 
                
                "count":{"$sum":1}, 
                "date_times":{"$push":"$date_time"}
            }
        },
        {"$sort":{"date_times.date":-1}}

    ]
    result = loads(dumps(Error.objects().aggregate(pipeline)))

    # print(result)
    return result

