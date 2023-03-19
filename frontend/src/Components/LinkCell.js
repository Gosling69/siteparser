import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import DetailComponent from './DetailComponent';
import {Button} from "devextreme-react"

import {Row,Col} from "react-bootstrap"

const LinkCell = (props) => {

    return (
    <>
        <Row >
            <Col>
                {props.data.displayValue}
            </Col>
            <Col className="d-flex justify-content-end" >
            <Button
                icon="arrowright"
                onClick={() => window.open(props.data.data.item_link, "_blank")}                                         
            />
            </Col>
        </Row>
    </>
    );
}
export default LinkCell