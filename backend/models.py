from mongoengine import *
from enum import Enum
import datetime
class ErrorLevel(Enum):
    MINOR = 'minor'
    AVERAGE = 'average'
    SEVERE = 'severe'

class DriverType(Enum):
    SELENIUM = 'selenium'
    REGULAR = 'regular'

class Error(Document):
    description = StringField()
    arguments = ListField()
    level = EnumField(ErrorLevel, default=ErrorLevel.MINOR)
    date_time = DateTimeField(default=datetime.datetime.utcnow)


class ParseData(EmbeddedDocument):
    price = IntField()
    quantity = IntField()
    date_time = DateTimeField(default=datetime.datetime.utcnow)

class PipeElement(EmbeddedDocument):
    target = StringField()
    action = StringField()
    action_args = StringField()
    
class Site(Document):
    name = StringField()
    url = URLField()
    path_to_price = DictField()
    path_to_quantity = DictField()
    driver_type = EnumField(DriverType, default=DriverType.REGULAR)
    actions = EmbeddedDocumentListField(PipeElement)

class Item(Document):
    name = StringField()
    item_link = URLField()
    site = ReferenceField(Site)
    last_price = IntField()
    last_quantity = IntField()
    data = EmbeddedDocumentListField(ParseData)

class OurItem(Document):
    name = StringField()
    item_link = URLField()
    site = ReferenceField(Site)
    last_price = IntField()
    last_quantity = IntField()
    linked_items = ListField(ReferenceField(Item))
    data = EmbeddedDocumentListField(ParseData)


