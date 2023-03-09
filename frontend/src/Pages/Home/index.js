import { useEffect, useState } from "react"
import ApiService from "../../Api/api"
import DataGrid,
{
  Column,
  MasterDetail,
} from 'devextreme-react/data-grid';
import DetailComponent from "../../Components/DetailComponent";

const HomePage = (props) => {

    const [items, setItems] = useState([])

    useEffect(() => {
        ApiService.getItems()
        .then((res) =>{
            // console.log(res)
            setItems(res)
        })
        // setItems(data)
    },[])
    return(
        <>
            <DataGrid id="grid-container"
                dataSource={items}
                keyExpr="_id"
                showBorders={true}
            >
            <Column dataField="name"/>
            <Column dataField="item_link" />
            <MasterDetail
                enabled={true}
                component={DetailComponent}
            />
            </DataGrid>
        </>
    )

}

export default HomePage