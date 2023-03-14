import axios from "axios"

export default class ApiService {

    static endpoint = "http://localhost:5000"

    static async getItems() {
        let response = await axios.get(ApiService.endpoint + "/get_items")
        return response.data
    }
    static async getOurItems(){
        let response = await axios.get(ApiService.endpoint + "/get_our_items")
        return response.data
    }
    static async updateItem() {
        
    }
    static async addItem() {
        
    }
    static async getSites() {
        
    }
    static async updateSite() {
        
    }
    
}