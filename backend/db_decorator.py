from mongoengine import connect, disconnect
from dotenv import load_dotenv

import os

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

MONGO_HOST = os.environ.get('MONGO_HOST')
MONGO_PORT = int(os.environ.get('MONGO_PORT'))

def database_connector(func):
    def wrapper_database_connector(*args, **kwargs):
        connect('test', host=MONGO_HOST, port=MONGO_PORT)
        result = func(*args, **kwargs)
        disconnect('test')
        return result
    return wrapper_database_connector