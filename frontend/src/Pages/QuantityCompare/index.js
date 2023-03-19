 
import DataGrid,
{
  Column,
  MasterDetail,
  Scrolling,
  Toolbar,
  Item
} from 'devextreme-react/data-grid';
import {Row, Col} from "react-bootstrap"
import { useEffect, useState } from "react"
import ApiService from "../../Api/api"
import ChartCell from '../../Components/ChartCell';
import LinkCell from '../../Components/LinkCell';
import NavBar from '../../Components/NavBar';
import DateToolbar from '../../Components/DateToolbar';

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
    useEffect(() => {
        refresh()

        // console.log("INIT")
    },[initDate])
    useEffect(() => {
        refresh()

        // console.log("END")
    },[endDate])
    return(
        <>
        <NavBar/>
        <Row className="mt-3 mb-3">
            <Col></Col>
            <Col>
            <DateToolbar
                initDate={initDate}
                endDate={endDate}
                setDay={setDay}
                setWeek={setWeek}
                setMonth={setMonth}
                setInitDate={setInitDate}
                setEndDate={setEndDate}
            />
            </Col>
            <Col></Col>
        </Row>
        
            <DataGrid 
                id="grid-container"
                dataSource={items}
                keyExpr="_id"
                showColumnLines={false}
                showRowLines={false}
                showBorders={false}
                allowColumnResizing={true}
                rowAlternationEnabled={true}
                height={600}
            >
            <Column dataField="name" cellRender={data => <ChartCell initDate={initDate} endDate={endDate} data={data} />}/>
            <Column dataField="site.name" cellRender={data => <LinkCell data={data}/>} />
            <Column dataField="plusByPeriod" alignment={"center"} width={300} caption="Plus By Period" />
            <Column dataField="minusByPeriod" alignment={"center"} width={300} caption="Minus By Period" />

            </DataGrid>
        </>
    )
}

export default QuantityCompare