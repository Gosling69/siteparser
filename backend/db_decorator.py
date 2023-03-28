from mongoengine import connect, disconnect

MONGO_HOST = "mongo"
MONGO_PORT = 27017

def database_connector(func):
    def wrapper_database_connector(*args, **kwargs):
        connect('test', host=MONGO_HOST, port=MONGO_PORT)
        result = func(*args, **kwargs)
        disconnect('test')
        return result
    return wrapper_database_connector