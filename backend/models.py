from mongoengine import *
from enum import Enum
import datetime

class ParseData(EmbeddedDocument):
    price = IntField()
    quantity = IntField()
    date_time = DateTimeField(default=datetime.datetime.utcnow)

class DriverType(Enum):
    SELENIUM = 'selenium'
    REGULAR = 'regular'

class Action(EmbeddedDocument):
    target = StringField()
    action = StringField()
    
class Site(Document):
    url = URLField()
    path_to_price = DictField()
    path_to_quantity = DictField()
    driver_type = EnumField(DriverType, default=DriverType.REGULAR)
    actions = EmbeddedDocumentListField(Action)

class Item(Document):
    name = StringField()
    item_link = URLField()
    site = ReferenceField(Site)
    linked_item = ObjectIdField()
    data = EmbeddedDocumentListField(ParseData)


