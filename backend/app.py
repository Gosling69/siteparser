from flask import Flask, request
from flask_apscheduler import APScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_MISSED, EVENT_JOB_ERROR
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from models import *
import site_parser
import mongo
import json
import errors
from event_provider import *


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
scheduler = APScheduler()
is_job_running = EventProvider()
is_job_running.attach(socketio)
# hohol.attach(socketio)

def scheduleDecorator(func):
    def InnerFunc(*args, **kwargs):
        is_job_running.set_status(True)
        is_job_running.notify_updating(is_job_running.status)
        func(*args, **kwargs)
        is_job_running.set_status(False)
        is_job_running.notify_updating(is_job_running.status)
    return InnerFunc

def listener(event):
    is_job_running.set_status(False)
    print(f'Job {event.job_id} raised {event.exception.__class__.__name__}')

@scheduleDecorator
def scheduleTask():
    site_parser.parse_sites()
    # site_parser.update_our_items()

scheduler.add_listener(listener, EVENT_JOB_EXECUTED | EVENT_JOB_MISSED | EVENT_JOB_ERROR)
scheduler.add_job(id = 'Scheduled Task', func=scheduleTask, trigger="interval", hours=3, max_instances=1)
scheduler.start()

@socketio.on('connect')
def ws_connect():
    print("CONNECTED")
    # emit("hohol", hohol.status)
    emit("isupdating", is_job_running.status)

@app.route('/run_update', methods=['POST'])
def run_update():
    if not is_job_running.status:
        scheduler.get_job(id ="Scheduled Task").modify(next_run_time=datetime.datetime.now())
        return "OK"
    else:
        return "Already running"

@app.route('/get_items', methods=['GET'])
def get_items():
    init_date = request.args.get('init_date')
    end_date = request.args.get('end_date')
    items = mongo.get_items(init_date, end_date)
    return items

@app.route('/get_one_item', methods=['GET'])
def get_one_item():
    item_id = request.args.get('item_id')
    init_date = request.args.get('init_date')
    end_date = request.args.get('end_date')
    item = mongo.get_one_item(item_id, init_date, end_date)
    return item

@app.route('/delete_item/<id>', methods=['DELETE'])
def delete_item(id):
    return mongo.delete_item(id)

@app.route('/delete_site/<id>', methods=['DELETE'])
def delete_site(id):
    return mongo.delete_site(id)

@app.route('/delete_our_item/<id>', methods=['DELETE'])
def delete_our_item(id):
    return mongo.delete_our_item(id)

@app.route('/get_sites', methods=['GET'])
def get_sites():
    sites = mongo.get_sites()
    return sites.to_json()

@app.route('/add_site', methods=['POST'])
def add_site():
    raw_site = request.json
    new_site = Site.from_json(json_data=json.dumps(raw_site))
    mongo.add_site(new_site)
    return 'Hello, World!'

@app.route('/update_site', methods=['PUT'])
def update_site():
    raw_site = request.json["site"]
    mongo.update_site(raw_site)
    return 'Hello, World!'

@app.route('/get_our_items', methods=['GET'])
def get_our_items():
    items = mongo.get_our_items_with_linked()
    return items

@app.route('/get_our_items_no_aggr', methods=['GET'])
def get_our_items_no_aggr():
    items = mongo.get_our_items()
    return items.to_json()

@app.route('/add_item', methods=['POST'])
def add_item_to_site():
    raw_item = request.json["item"]
    new_item = Item.from_json(json_data=json.dumps(raw_item))
    mongo.add_item(new_item)    
    return 'Hello, World!'

@app.route('/add_data_to_item', methods=['PUT'])
def add_data_to_item():
    raw_id = request.json["_id"]
    raw_data = request.json["data"]
    new_data = ParseData.from_json(json_data=json.dumps(raw_data))
    mongo.add_data_to_item(raw_id, new_data)
    return 'Hello, World!'

@app.route('/add_our_item', methods=['POST'])
def add_our_item():
    raw_item = request.json["ouritem"]
    new_item = OurItem.from_json(json_data=json.dumps(raw_item))
    mongo.add_item(new_item)    
    return 'Hello, World!'

@app.route('/update_our_item', methods=['PUT'])
def update_our_item():
    raw_item = request.json["ouritem"]
    # entry = Item(**raw_item)
    mongo.update_our_item(raw_item)
    return 'Hello, World!'

@app.route('/update_item', methods=['PUT'])
def update_item():
    raw_item = request.json["item"]
    # print(raw_item)
    # entry = Item(**raw_item)
    mongo.update_item(raw_item)
    return 'Hello, World!'

@app.route('/import_items', methods=['POST'])
def import_items():
    data = request.json["data"]
    print(data)
    for item in data:
        new_item = Item.from_json(json_data=json.dumps(item))
        mongo.add_item(new_item)    
    return 'Hello, World!'

@app.route('/import_our_items', methods=['POST'])
def import_our_items():
    data = request.json["data"]
    print(data)
    for our_item in data:
        new_item = OurItem.from_json(json_data=json.dumps(our_item))
        mongo.add_item(new_item)    
    return 'Hello, World!'

@app.route('/init_standart_sites', methods=['POST'])
def init_standart_sites():
    mongo.init_standart_sites()
    return 'Hello, World!'

@app.route('/get_errors', methods=['GET'])
def get_errors():
    # mongo.init_standart_sites()
    errs = errors.get_errors()
    return errs
    

@app.route('/get_categories', methods=['GET'])
def get_categories():
    # mongo.init_standart_sites()

    categories = mongo.get_categories()
    return categories.to_json()

@app.route('/update_category', methods=['PUT'])
def update_category():
    raw_category = request.json["category"]
    print(raw_category)
    # entry = Item(**raw_item)
    mongo.update_category(raw_category)
    return 'Hello, World!'

@app.route('/add_category', methods=['POST'])
def add_category():
    raw_category = request.json["category"]
    new_category = Category.from_json(json_data=json.dumps(raw_category))
    return mongo.add_category(new_category)   
    


@app.route('/delete_category/<id>', methods=['DELETE'])
def delete_category(id):
    return mongo.delete_category(id)



# if __name__ == '__main__':
socketio.run(app, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True )
# app.run(host="0.0.0.0", port=5000)
