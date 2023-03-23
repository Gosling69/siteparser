
import { useState } from "react";
import {Modal, Button, Row, Col} from "react-bootstrap"
import * as _ from "lodash"


const UploadModal = (props) => {
    
    const handleClose = () => props.setShow(false);
    const [loading, setLoading] = useState(false)
    // const [data, setData] = useState(props.data)

    const bodyStyle = {
        height:"500px",
        overflowY:"scroll"
    }

    // const deleteItem = (link) => {
    //     let newData = _.cloneDeep(data)
    //     let targetIndex = newData.findIndex(el => el.item_link === link)
    //     if (!targetIndex) return
    //     newData.splice(targetIndex, 1)
    //     setData(newData)
    // }

    // const uploadData = () =>


    return (

        <Modal centered size="xl" show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title >{props.type} Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body style={bodyStyle}>
            {props.data.map(el =>
                <Row className="mb-4" key={el.item_link}>
                    <Col xs={3}>{el.name}</Col>
                    <Col>{el.item_link}</Col>
                    {/* <Col xs={1}>
                        <Button variant="danger" onClick={() => deleteItem(el.item_link)}>
                            Delete
                        </Button>
                    </Col> */}
                </Row>
                // <p>{`${el.name} - ${el.item_link}`}</p>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.clearData}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {props.importFromXlsx()}}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    )
}
export default UploadModal
UploadModal.defaultProps = {
    show:false,
    setShow: () => console.log("NO FUNC IN MODAL"),
    data:[],
    clearData:() => console.log("NO FUNC IN CLEAR DATA"),
    type:"item",
   
}