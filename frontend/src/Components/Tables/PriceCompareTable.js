import DataGrid, {
    Column,
    Popup,
    Item,
    Form,
    Editing,
    Lookup,
  } from 'devextreme-react/data-grid';  
import { useState, useEffect } from 'react';
import { createPath } from 'react-router-dom';
  
const PriceCompareTable = ({data}) => {

    const [colCount, setColCount] = useState(0)
    const [cols, setCols] = useState([])

    useEffect(() =>{
        if(!data || !data.length) return
        console.log("SUQA")
        setColCount(data
            .reduce((prev, current) => (prev.linked_items.length > current.linked_items.length) ? prev : current)
            .linked_items.length
        )
    },[data])

    useEffect(() => {
        let newCols = []
        for (let i = 0; i < colCount; i++) {
            newCols.push(<Column caption="Price" dataField={`linkedItem ${i} Price`}/>)
            newCols.push(<Column caption="Qunatity" dataField={`linkedItem ${i} Quantity`}/>)
        }
        setCols(
            newCols
        )
    },[colCount])
   
    console.log(data)

    return (
        <div className='mt-5' >
        <DataGrid
            dataSource={data}
            keyExpr="_id"
            // showColumnLines={false}
            allowColumnResizing={true}
            showRowLines={false}
            showBorders={false}
            rowAlternationEnabled={true}
            height={550}
        >
        <Column dataField="name" width={300} />
        <Column dataField="last_price"/>
        {
            cols
        }
        </DataGrid>
        </div>
    )
}
export default PriceCompareTable