import axios from "axios"
import * as _ from 'lodash';

export default class ApiService {

    static endpoint = "http://localhost:5000"

    static async getItems(params={}) {
        let response = await axios.get(ApiService.endpoint + "/get_items", {params:params})
        return response.data
    }
    static async getOurItems(){
        let response = await axios.get(ApiService.endpoint + "/get_our_items")
        return response.data
    }
    static async getOurItemsNoAggr(){
        let response = await axios.get(ApiService.endpoint + "/get_our_items_no_aggr")
        return response.data
    }

    static async linkItems(body){
        // console.log(body)
        let response = await axios.put(ApiService.endpoint + "/link_item", body)
        return response.status
    }
    static async runUpdate(){
        let response = await axios.post(ApiService.endpoint + "/run_update")
        return response
    }
    static async updateItem(item) {
        let response = await axios.put(ApiService.endpoint + "/update_item", {item:item})
        return response.status
    }
    static async updateOurItem(item) {
        // let propsToClear = ["last_price",""]
        delete item.last_price
        if(item.linked_items_ids) {
            item.linked_items = _.clone(item.linked_items_ids)
            delete item.linked_items_ids
        }
        console.log(item)
        let response = await axios.put(ApiService.endpoint + "/update_our_item", {ouritem:item})
        return response.status
    }
    static async addItem(item) {
        if (item._id) {
            delete item._id
        }
        
        console.log(item)
        let response = await axios.post(ApiService.endpoint + "/add_item", {item:item})
        return response.status
    }
    static async addOurItem(item) {
        if (item._id) {
            delete item.ouritem._id
        }
        for (let prop in item) {
            if ( _.isEmpty(item[prop])) {
                delete item[prop]
            }
        }
        if(item.linked_items_ids) {
            item.linked_items = _.clone(item.linked_items_ids)
            delete item.linked_items_ids
        }
        console.log(item)
        let response = await axios.post(ApiService.endpoint + "/add_our_item", {ouritem:item})
        return response.status
    }
    static async getSites() {
        let response = await axios.get(ApiService.endpoint + "/get_sites")
        return response.data
    }
    static async updateSite() {
        
    }
    
}