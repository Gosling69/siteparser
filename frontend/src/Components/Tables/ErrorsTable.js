import DataGrid, {Column} from 'devextreme-react/data-grid';
import { useEffect, useState } from 'react';
import DateToolbar from '../Toolbars/DateToolbar';
import {Row, Col} from "react-bootstrap"
import MultiValueCell from '../CellRenders/MultiValueCell';

const ErrorsTable = ({errors}) => {
    const[endDate, setEndDate] = useState(new Date().toISOString().slice(0,10))
    const [initDate, setInitDate] = useState(new Date(Date.now() - 86400000).toISOString().slice(0,10))

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

    return(
        <>
        <Row className="mt-3 mb-3">
            <Col></Col>
            <Col xs={5}>
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
            dataSource={errors}
            keyExpr="_id"
            showColumnLines={false}
            allowColumnResizing={true}
            showRowLines={false}
            showBorders={false}
            rowAlternationEnabled={true}
            height={550}
        >
        <Column dataField="_id.description" caption="Description" />
        <Column dataField="_id.level" caption="Level" />
        <Column dataField="_id.item_link" caption="Item Link" />
        <Column dataField="count" caption="Count" />


        <Column 
            dataField="date_times" 
            cellRender={data => <MultiValueCell data={data}/>} 
            caption="DateTime" 
        />
        </DataGrid>
        </>
    )
}
export default ErrorsTable