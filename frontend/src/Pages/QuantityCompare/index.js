 
import DataGrid,
{
  Column,
  MasterDetail,
  Scrolling,
  Toolbar,
  Item
} from 'devextreme-react/data-grid';
import {ButtonGroup, Button as BootButton,  Container, Form, InputGroup} from "react-bootstrap"
import {Button, DateBox, SelectBox} from "devextreme-react"
import DetailComponent from "../../Components/DetailComponent";
import { useEffect, useState } from "react"
import ApiService from "../../Api/api"
import ChartCell from '../../Components/ChartCell';
import LinkCell from '../../Components/LinkCell';
import NavBar from '../../Components/NavBar';

const QuantityCompare = (props) => {

    const [items, setItems] = useState([])
    const[endDate, setEndDate] = useState(new Date().toISOString().slice(0,10))
    const [initDate, setInitDate] = useState(new Date(Date.now() - 86400000).toISOString().slice(0,10))

    const refresh = () => {
        ApiService.getItems({init_date:initDate, end_date:endDate})
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
                        return item
                    })
            )
        })
    }

    const setWeek = () => {
        let endDate = new Date()
        let initDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7)
        setInitDate(initDate.toISOString().slice(0,10))
        setEndDate(endDate.toISOString().slice(0,10))

    }
    const setMonth = () => {
        let endDate = new Date()
        let initDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate())
        setInitDate(initDate.toISOString().slice(0,10))
        setEndDate(endDate.toISOString().slice(0,10))

    }
    const setDay = () => {
        let endDate = new Date()
        let initDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 1)
        setInitDate(initDate.toISOString().slice(0,10))
        setEndDate(endDate.toISOString().slice(0,10))

    }


    useEffect(() => {
        refresh()
        // setItems(data)
    },[])
    return(
        <>
            <NavBar/>

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
            <InputGroup>
                <BootButton onClick={setDay} variant="secondary">Day</BootButton>
                <BootButton onClick={setWeek} variant="secondary">Week</BootButton>
                <BootButton onClick={setMonth} variant="secondary">Month</BootButton>
                <Form.Control
                    value={initDate}
                    onChange={(e) => setInitDate(e.target.value)}
                    type='date'
                />
                <Form.Control
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    type='date'
                />
            </InputGroup>
                {/* <ButtonGroup aria-label="Basic example">
                    <BootButton variant="secondary">Day</BootButton>
                    <BootButton variant="secondary">Week</BootButton>
                    <BootButton variant="secondary">Month</BootButton>
                </ButtonGroup> */}
            </Item>
            {/* <Item location="center">
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
            </Item> */}
            <Item location="after">
                <Button
                    icon='refresh'
                    onClick={refresh}
                    // onClick={this.refreshDataGrid} 
                />
            </Item>
            
            </Toolbar>
            <Column dataField="name" cellRender={data => <ChartCell data={data} />}/>
            <Column dataField="site.name" cellRender={data => <LinkCell data={data}/>} />
            {/* <Column dataField="item_link" /> */}

            {/* <Column dataField="" caption="Plus By Day" />
            <Column dataField="" caption="Minus By Day" />
            <Column dataField="" caption="Plus By Week" />
            <Column dataField="" caption="Minus By Week" /> */}
            <Column dataField="plusByPeriod" width={200} caption="Plus By Period" />
            <Column dataField="minusByPeriod" width={200} caption="Minus By Period" />

            {/* <Scrolling mode="virtual" /> */}
            {/* <MasterDetail
                enabled={true}
                component={DetailComponent}
            /> */}
            </DataGrid>
        </Container>
        </>
    )
}

export default QuantityCompare