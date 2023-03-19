from flask import Flask, request
from flask_apscheduler import APScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_MISSED, EVENT_JOB_ERROR
from flask_cors import CORS
# from flask_socketio import SocketIO
from models import *
import site_parser
import mongo
import json

app = Flask(__name__)
CORS(app)

# socketio=SocketIO(app)
class BoolWrap(object):
    def __init__(self) -> None:
        self.status = False
        pass
    def set_status(self, arg):
        self.status = arg

is_job_running = BoolWrap()

scheduler = APScheduler()

def listener(event):
    is_job_running.set_status(False)
    print(f'Job {event.job_id} raised {event.exception.__class__.__name__}')


def scheduleTask():
    is_job_running.set_status(True)
    print("PARSING SITES")
    site_parser.parse_sites()
    site_parser.update_our_items()
    print("DONE")
    is_job_running.set_status(False)


scheduler.add_listener(listener, EVENT_JOB_EXECUTED | EVENT_JOB_MISSED | EVENT_JOB_ERROR)
scheduler.add_job(id = 'Scheduled Task', func=scheduleTask, trigger="interval", hours=1)
scheduler.start()

# @socketio.on('connect')
# def ws_connect():
#     pass


@app.route('/run_update', methods=['POST'])
def run_update():
    if not is_job_running.status:
        scheduleTask()
        return "OK"
    else:
        return "Already running"

@app.route('/get_items', methods=['GET'])
def get_items():
    init_date = request.args.get('init_date')
    end_date = request.args.get('end_date')
    print(init_date, end_date)
    items = mongo.get_items(init_date, end_date)

    return items
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
    # entry = Item(**raw_item)
    mongo.update_item(raw_item)
    return 'Hello, World!'

@app.route('/link_item', methods=['PUT'])
def link_item():
    our_item_id = request.json["our_item_id"]
    enemy_item_id = request.json["enemy_item_id"]
    mongo.link_items(enemy_item_id, our_item_id)    
    return 'Hello, World!'

@app.route('/init_data', methods=['PUT'])
def init_data():
    site_parser.export_from_xlsx()
    return 'Hello, World!'

# if __name__ == '__main__':
app.run(host="0.0.0.0", port=5000)
