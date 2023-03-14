from flask import Flask, request
from flask_apscheduler import APScheduler
from flask_cors import CORS

from models import *
import site_parser
import mongo
import json

app = Flask(__name__)
CORS(app)

scheduler = APScheduler()

def scheduleTask():
    print("PARSING SITES")
    site_parser.parse_sites()
    site_parser.update_our_items()
    print("DONE")


scheduler.add_job(id = 'Scheduled Task', func=scheduleTask, trigger="interval", hours=1)
scheduler.start()

@app.route('/run_update', methods=['POST'])
def run_update():
    scheduleTask()
    return "SAS"

@app.route('/get_items', methods=['GET'])
def get_items():
    init_date = request.args.get('init_date')
    end_date = request.args.get('end_date')

    items = mongo.get_items(init_date, end_date)

    return items


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

@app.route('/get_items', methods=['GET'])
def get_items():
    items = mongo.get_items()
    return items.to_json()

@app.route('/get_our_items', methods=['GET'])
def get_our_items():
    items = mongo.get_our_items_with_linked()
    return items


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
