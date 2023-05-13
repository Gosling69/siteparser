import axios from "axios"
import * as _ from 'lodash';
import { includes } from "lodash";
import { useCategoryOptions, useCategoryOptionsDispatch } from "../Providers/CategoryOptionsProvider";

// export default class ApiService {

     const endpoint = process.env.REACT_APP_BACKEND_ADDRESS;
    // static endpoint = "http://90.189.205.102:5000"
    // static endpoint = "http://192.168.88.3:5000"


    // ITEMS METHODS
      const getItems = async (params={}) => {
        let response = await axios.get(endpoint + "/get_items", {params:params})
        // const categories = useCategoryOptions()

        return response.data
    }
      const addItem = async (item) => {
        if (item._id) {
            delete item._id
        }
        if(item.category) {
            let catVals = item.category.values ?? {}
            for (let prop in catVals ) {
                if (!item.category.properties.includes(prop) ||  _.isEmpty(item.category.values[prop])) delete catVals[prop]
            }
        }
        console.log(item)
        let response = await axios.post(endpoint + "/add_item", {item:item})
        return response.status
    }
      const deleteItem = async (id) => {
        let response = await axios.delete(endpoint + `/delete_item/${id}`)
        return response.data
    }
      const updateItem = async (item) => {
        // console.log(item)
        if(item.category) {
            let catVals = item.category.values ?? {}
            for (let prop in catVals ) {
                if (!item.category.properties.includes(prop) ||  _.isEmpty(item.category.values[prop])) delete catVals[prop]
            }
        }
        // console.log(item)
        let response = await axios.put(endpoint + "/update_item", {item:item})
        return response.status
    }
      const importItems = async (itemsList) => {
        let response = await axios.post(endpoint + "/import_items", {data:itemsList})
        return response.data
    }



    //OUR ITEMS METHODS
      const getOurItems = async () =>{
        let response = await axios.get(endpoint + "/get_our_items")
        return response.data
    }
      const getOurItemsNoAggr = async () =>{
        let response = await axios.get(endpoint + "/get_our_items_no_aggr")
        return response.data
    }
      const updateOurItem = async (item) => {
        // let propsToClear = ["last_price",""]
        // delete item.last_price
        if(item.linked_items_ids) {
            item.linked_items = _.clone(item.linked_items_ids)
            delete item.linked_items_ids
        }
        if(item.category) {
            let catVals = item.category.values ?? {}
            for (let prop in catVals ) {
                if (!item.category.properties.includes(prop) ||  _.isEmpty(item.category.values[prop])) delete catVals[prop]
            }
        }
        // console.log(item)
        let response = await axios.put(endpoint + "/update_our_item", {ouritem:item})
        return response.status
    }
      const addOurItem = async (item) => {
        if (item._id) {
            delete item._id
        }
        for (let prop in item) {
            if ( _.isEmpty(item[prop])) {
                delete item[prop]
            }
        }
        if(item.category) {
            let catVals = item.category.values ?? {}
            for (let prop in catVals ) {
                if (!item.category.properties.includes(prop) ||  _.isEmpty(item.category.values[prop])) delete catVals[prop]
            }
        }
        if(item.linked_items_ids) {
            item.linked_items = _.clone(item.linked_items_ids)
            delete item.linked_items_ids
        }
        console.log(item)
        let response = await axios.post(endpoint + "/add_our_item", {ouritem:item})
        return response.status
    }
      const importOurItems = async (itemsList) => {
        // return axios.post(endpoint + "/import_our_items", {data:itemsList})
        let response = await axios.post(endpoint + "/import_our_items", {data:itemsList})
        return response.data
    }
      const deleteOurItem = async (id) => {
        let response = await axios.delete(endpoint + `/delete_our_item/${id}`)
        return response.data
    }

    //SITE METHODS
    
      const getSite = async () => {
        let response = await axios.get(endpoint + "/get_sites")
        return response.data
    }
      const updateSite = async () => {
        
    }
    
      const initStandartSites = async () => {
        let response = await axios.post(endpoint + "/init_standart_sites",{})
        return response.data
    }
      const deleteSite = async (id) => {
        let response = await axios.delete(endpoint + `/delete_site/${id}`)
        return response.data
    }

    // ERRORS
      const getErrors = async () =>{
        let response = await axios.get(endpoint + "/get_errors")
        return response.data
    }

    //CATEGORIES
      const getCategories = async () =>{
        let response = await axios.get(endpoint + "/get_categories")
        return response.data
    }
      const updateCategory = async (category) => {
        console.log(category)
        let response = await axios.put(endpoint + "/update_category", {category:category})
        return response.status
    }
      const addCategory = async (category) => {
        if (category._id) {
            delete category._id
        }
        for (let prop in category) {
            if ( _.isEmpty(category[prop])) {
                delete category[prop]
            }
        }
        let response = await axios.post(endpoint + "/add_category", {category:category})
        return response.status
    }
      const deleteCategory = async (id) => {
        let response = await axios.delete(endpoint + `/delete_category/${id}`)
        return response.data
    }

    //MISC
      const runUpdate = async () =>{
        let response = await axios.post(endpoint + "/run_update")
        // window.alert(response.data)
        return response
    }
      const getHohol = async () =>{
        let response = await axios.get(endpoint + "/get_hohol")
        return response.data === "True" 
    }
   
   
    
    
// }