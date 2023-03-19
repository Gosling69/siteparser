import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import DetailComponent from './DetailComponent';
import {Button} from "devextreme-react"
import UilChartLine from '@iconscout/react-unicons/icons/uil-chart-line'

import {Row,Col} from "react-bootstrap"
import DateToolbar from './DateToolbar';

const ChartCell = (props) => {
    const [show, setShow] = useState(false);
    const [initDate, setInitDate] = useState(props.initDate)
    const [endDate, setEndDate] = useState(props.endDate)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
    // console.log(props.data)
    return (
    <>
        <Row>
            <Col>
                {props.data.displayValue}

            </Col>
            <Col className="d-flex justify-content-end">
            <UilChartLine
                className="clickIcon"
                size="24" 
                color="#F3D223"
                onClick={handleShow}                                         
            />
            {/* <Button
                icon="chart"
                onClick={handleShow}                                         
            /> */}
            </Col>
        </Row>
        <Modal
            size='xl' 
            centered 
            show={show} 
            onHide={handleClose}
        >
        <Modal.Header closeButton>
            <Modal.Title>
                <Row>
                    <Col>{props.data.data.name}</Col>
                    <Col>{props.data.data.site.name}</Col>
                </Row>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row className='mb-3'>
                <Col></Col>
                <Col xs={6}>
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
            <DetailComponent
                {...props}
            />
        </Modal.Body>
        </Modal>
    </>
    );
}
export default ChartCell
ChartCell.defaultProps={
    initDate: new Date().toISOString().slice(0,10),
    endDate: new Date().toISOString().slice(0,10)
}