import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import DetailComponent from './DetailComponent';
import {Button} from "devextreme-react"

import {Row,Col} from "react-bootstrap"

const ChartCell = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
    <>
        <Row>
            <Col>
                {props.data.displayValue}

            </Col>
            <Col className="d-flex justify-content-end">
            <Button
                icon="chart"
                onClick={handleShow}                                         
            />
            </Col>
        </Row>
        <Modal
            size='xl' 
            centered 
            show={show} 
            onHide={handleClose}
        >
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <DetailComponent
                {...props}
            />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
            Save Changes
            </Button>
        </Modal.Footer>
        </Modal>
    </>
    );
}
export default ChartCell