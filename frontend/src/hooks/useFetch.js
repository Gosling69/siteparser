import { useEffect, useState } from "react"
import axios from "axios"
import { useCategoryOptionsDispatch, useCategoryOptions } from "../Providers/CategoryOptionsProvider"
import { isArray } from "lodash"

export default function useFetch(url, method="GET", body={}, collectCategories = false, processDataFunc = (val) => {return val}){

    const endpoint = process.env.REACT_APP_BACKEND_ADDRESS + url;
    const [data,setData] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)

    const categories = useCategoryOptions()
    const dispatch = useCategoryOptionsDispatch()


    const gatherCategoryValues = (data) => {
        if (!isArray(data)) return
        for (let entry of data) {
            if (!entry.category) continue
            let targetCategory = categories[entry.category.name]
            if (!targetCategory) {
                dispatch({
                    type:"added",
                    name:entry.category.name,
                    properties:entry.category.properties,
                    values:entry.category.values,
                })
            } else {
                let values = entry.category.values
                for (let prop in values) {
                    dispatch({
                        type:"updated",
                        name:entry.category.name,
                        field:prop,
                        value:values[prop]
                    })
                }
            }
        }
    }

    const refetch = async () => {
        // console.log("REFRESH SUCCESS") 
        try{
            setLoading(true)
            let response
            switch(method) {
                case "GET":
                    response = await axios.get(endpoint, {params:body})
                    break;
                case "PUT":
                    response = await axios.put(endpoint, body)
                    break;
                case "POST":
                    response = await axios.post(endpoint, body)
                    break;
                case "DELETE":
                    response = await axios.delete(endpoint)
                    break;
                default:
                    response = await axios.get(endpoint)
                    break;
            }
            if(collectCategories) gatherCategoryValues(response.data)
            // console.log(categories)
            setData(processDataFunc(response.data))
            // console.log("HUI", response.data)
        }catch(err){
            setError(err)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        (refetch)()
    }, [url])

    return { data, error, loading, refetch }

}