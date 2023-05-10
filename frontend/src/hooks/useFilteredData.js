import { useState, useEffect } from 'react';
import {useFilters} from "../Providers/FilterProvider"

function useFilteredData(value) {
    // const dispatch = useFilterDispatch();      
    const filters = useFilters();
    const categories = filters.map(el => el.category)
    // console.log("TUTA",categories)
    // console.log(categories.length)
    const [filteredData, setFilteredData] = useState(value);

    useEffect(() => {
        // console.log("IN EFFECT")
        // console.log(categories)
        setFilteredData(
            value.filter(entry => {
                if(!categories.length) return true
                let targetCategory = categories.find(el=> el.name === entry.category?.name)
                if (targetCategory) {
                    let values = targetCategory.values
                    for (let prop in values ) {
                        if(!values[prop]) continue
                        if(entry.category?.values?.[prop] != values[prop]) {
                            return false
                        }
                    }
                    return true
                } else {
                    return false
                }
            })
        )
    }, [filters, value]); 
    return filteredData;
}

export default useFilteredData;