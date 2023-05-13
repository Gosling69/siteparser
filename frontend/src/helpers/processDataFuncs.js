import { isArray } from "lodash"
 
 export const addlinkedItemsIds = (resData) => {
    if (!isArray(resData)) return
    return resData.map(el => {
        el.linked_items_ids = el.linked_items.map(item => item._id.$oid) 
        return el
    })
}

export const calculateDeltasForQunatity = (resData) => {
    if (!isArray(resData)) return
    let result = resData.map(item =>  {
        let plusByPeriod = 0, minusByPeriod = 0
        for (let i = 1; i < item.data.length; i++) {
            if(item.data[i].quantity > item.data[i-1].quantity) {
                plusByPeriod += item.data[i].quantity - item.data[i-1].quantity
            } else if (item.data[i].quantity < item.data[i-1].quantity) {
                minusByPeriod += item.data[i-1].quantity - item.data[i].quantity
            }
        }
        item.plusByPeriod = plusByPeriod
        item.minusByPeriod = minusByPeriod
        return item
    })
    return result
}

export const unpackLinkedItems = (resData) => {
    if (!isArray(resData)) return
    // let colCount = 0
    const colCount = resData
    .reduce((prev, current) => (prev.linked_items.length > current.linked_items.length) ? prev : current)
    .linked_items.length
    // console.log("numCOLs", numCols)
    // resData.forEach(entry => {
    //     if(!entry.linked_items) return
    //     const linkedLen = entry.linked_items.length
    //     if(entry.linked_items.length > colCount) colCount = linkedLen
    // })
    let result = resData.map(entry => {
        for (let i = 1; i <= colCount; i++) {
            entry[`linkedItem ${i} Price`] = "" 
            entry[`linkedItem ${i} Qunatity`] = "" 

        }
        if (!entry.linked_items) return entry
        for (let i = 0; i < entry.linked_items.length; i++) {
            entry[`linkedItem ${i} Price`] = entry.linked_items[i].last_price
            entry[`linkedItem ${i} Quantity`] = entry.linked_items[i].last_quantity
        }
        return entry
    })
    return result

}