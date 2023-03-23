import axios from "axios"
import * as _ from 'lodash';

export default class ApiService {

    static endpoint = "http://localhost:5000"
    // static endpoint = "http://192.168.88.3:5000"


    // ITEMS METHODS
    static async getItems(params={}) {
        let response = await axios.get(ApiService.endpoint + "/get_items", {params:params})
        return response.data
    }
    static async addItem(item) {
        if (item._id) {
            delete item._id
        }
        
        console.log(item)
        let response = await axios.post(ApiService.endpoint + "/add_item", {item:item})
        return response.status
    }
    static async deleteItem(id) {
        let response = await axios.delete(ApiService.endpoint + `/delete_item/${id}`)
        return response.data
    }
    static async updateItem(item) {
        let response = await axios.put(ApiService.endpoint + "/update_item", {item:item})
        return response.status
    }
    static async importItems(itemsList) {
        let response = await axios.post(ApiService.endpoint + "/import_items", {data:itemsList})
        return response.data
    }



    //OUR ITEMS METHODS
    static async getOurItems(){
        let response = await axios.get(ApiService.endpoint + "/get_our_items")
        return response.data
    }
    static async getOurItemsNoAggr(){
        let response = await axios.get(ApiService.endpoint + "/get_our_items_no_aggr")
        return response.data
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
    static async addOurItem(item) {
        if (item._id) {
            delete item._id
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
    static async importOurItems(itemsList) {
        // return axios.post(ApiService.endpoint + "/import_our_items", {data:itemsList})
        let response = await axios.post(ApiService.endpoint + "/import_our_items", {data:itemsList})
        return response.data
    }
    static async deleteOurItem(id) {
        let response = await axios.delete(ApiService.endpoint + `/delete_our_item/${id}`)
        return response.data
    }

    //SITE METHODS
    
    static async getSites() {
        let response = await axios.get(ApiService.endpoint + "/get_sites")
        return response.data
    }
    static async updateSite() {
        
    }
    
    static async initStandartSites() {
        let response = await axios.post(ApiService.endpoint + "/init_standart_sites",{})
        return response.data
    }
    static async deleteSite(id) {
        let response = await axios.delete(ApiService.endpoint + `/delete_site/${id}`)
        return response.data
    }

    //MISC
    static async runUpdate(){
        let response = await axios.post(ApiService.endpoint + "/run_update")
        window.alert(response.data)
        return response
    }
   
   
    
    
}