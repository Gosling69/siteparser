 
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
import ChartCell from '../../Components/CellRenders/ChartCell';
import LinkCell from '../../Components/CellRenders/LinkCell';
import NavBar from '../../Components/Toolbars/NavBar';
import DateToolbar from '../../Components/Toolbars/DateToolbar';
import { calculateDeltasForQunatity } from '../../helpers/processDataFuncs';
import useFetch from '../../hooks/useFetch';
import useFilteredData from '../../hooks/useFilteredData';

const QuantityCompare = (props) => {

    const[endDate, setEndDate] = useState(new Date().toISOString().slice(0,10))
    const [initDate, setInitDate] = useState(new Date(Date.now() - 86400000).toISOString().slice(0,10))
    
    const {
        data:items, 
        error:itemsError, 
        loading:itemsLoading, 
        refetch:refreshItems
    } = useFetch("/get_items", "GET", {init_date:initDate, end_date:endDate}, true, calculateDeltasForQunatity)

    const {
        data:categories, 
        error:categoriesError, 
        loading:categoriesLoading, 
        refetch:refreshCategories
    } = useFetch("/get_categories", "GET", {}, true)


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
        refreshItems()
    },[initDate, endDate])
    
    return(
        <>
        <NavBar categories={categories}/>
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
                dataSource={useFilteredData(items)}
                keyExpr="_id"
                showColumnLines={false}
                showRowLines={false}
                showBorders={false}
                allowColumnResizing={true}
                rowAlternationEnabled={true}
                height={550}
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