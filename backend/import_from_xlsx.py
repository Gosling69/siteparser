

import mongo
from models import *
import pandas as pd

INIT_DATA_NAME = "init_data.xlsx"

def import_items():
    xl = pd.ExcelFile(INIT_DATA_NAME)
    for i in range(2):
        dataframe = pd.read_excel(INIT_DATA_NAME, sheet_name=xl.sheet_names[i])
        names = dataframe['Name'].values
        links = dataframe['Link'].values
        for i in range(len(names)):
            new_item = Item(
                name = names[i],
                item_link = links[i]
            )
            mongo.add_item(new_item)
            
def import_our_items():
    xl = pd.ExcelFile(INIT_DATA_NAME)
    dataframe = pd.read_excel(INIT_DATA_NAME, sheet_name=xl.sheet_names[3])
    names = dataframe['Name'].values
    links = dataframe['Link'].values
    for i in range(len(names)):
        new_item = OurItem(
            name = names[i],
            item_link = links[i]
        )
        mongo.add_item(new_item)
