 
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
import { useEffect, useState } from "react"
import ApiService from "../../Api/api"
import { Container } from 'react-bootstrap';
import ChartCell from '../../Components/ChartCell';

const QuantityCompare = (props) => {

    const [items, setItems] = useState([])
    const[endDate, setEndDate] = useState(new Date())
    const [initDate, setInitDate] = useState(new Date(Date.now() - 86400000))

    const refresh = () => {
        ApiService.getItems({init_date:initDate.toISOString().slice(0,10), end_date:endDate.toISOString().slice(0,10)})
        .then((res) =>{
            console.log(res)
            setItems(
                    res.map(item => 
                    {
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
                        // item = item.data.reduce((prev, curr) => {
                        //     if(prev.quantity < curr.quantity){
                        //         return curr.quantity - prev.quantity 
                        //     } else {
                        //         return 0
                        //     }
                        // },0)
                        return item
                    })
            )
        })
    }

    useEffect(() => {
        refresh()
        // setItems(data)
    },[])
    return(
        
        <Container className='mt-3'>
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
            <Column dataField="name" cellRender={data => <ChartCell data={data} />}/>
            <Column dataField="site.name"/>
            <Column dataField="item_link" />

            {/* <Column dataField="" caption="Plus By Day" />
            <Column dataField="" caption="Minus By Day" />
            <Column dataField="" caption="Plus By Week" />
            <Column dataField="" caption="Minus By Week" /> */}
            <Column dataField="plusByPeriod" caption="Plus By Period" />
            <Column dataField="minusByPeriod" caption="Minus By Period" />

            <Scrolling mode="virtual" />
            {/* <MasterDetail
                enabled={true}
                component={DetailComponent}
            /> */}
            </DataGrid>
        </Container>
    )
}

export default QuantityCompare