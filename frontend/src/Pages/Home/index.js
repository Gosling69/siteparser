import { useEffect, useState } from "react"
import ApiService from "../../Api/api"
import DataGrid,
{
  Column,
  MasterDetail,
  Scrolling,
  Toolbar,
  Item
} from 'devextreme-react/data-grid';
import {Button, DateBox, SelectBox} from "devextreme-react"
import DetailComponent from "../../Components/DetailComponent";
import { Container } from "react-bootstrap";

const HomePage = (props) => {

    const [items, setItems] = useState([])
    const[endDate, setEndDate] = useState(new Date())
    const [initDate, setInitDate] = useState(new Date(Date.now() - 86400000))

    const refresh = () => {
        ApiService.getItems({init_date:initDate.toISOString().slice(0,10), end_date:endDate.toISOString().slice(0,10)})
        .then((res) =>{
            console.log(res)
            setItems(res)
        })
    }

    useEffect(() => {
        refresh()
        // setItems(data)
    },[])
    return(
        <Container className="mt-3">
            <DataGrid 
                id="grid-container"
                dataSource={items}
                keyExpr="_id"
                showBorders={true}
                height={700}
                style={{}}
            >
            <Toolbar>
            <Item location="center">
                <DateBox    
                    // defaultValue={initDate}
                    value={initDate}
                    onValueChanged={(e) => setInitDate(e.value)}

                />
            </Item>
            <Item location="center">
                <DateBox    
                    value={endDate}
                    onValueChanged={(e) => setEndDate(e.value)}
                    // defaultValue={endDate}
                />
            </Item>
            <Item location="after">
                <Button
                    icon='refresh'
                    onClick={refresh}
                    // onClick={this.refreshDataGrid} 
                />
            </Item>
            
            </Toolbar>
            <Column dataField="name"/>
            <Column dataField="item_link" />
            <Scrolling mode="virtual" />
            <MasterDetail
                enabled={true}
                component={DetailComponent}
            />
            </DataGrid>
        </Container>
    )

}

export default HomePage