import {Button} from "devextreme-react"
import {Row,Col} from "react-bootstrap"
import UilExternalLinkAlt from '@iconscout/react-unicons/icons/uil-external-link-alt'

const LinkCell = (props) => {
    return (
    <>
        <Row >
            <Col>
                {props.data.displayValue}
            </Col>
            <Col className="d-flex justify-content-end" >
                <UilExternalLinkAlt
                    className="clickIcon"
                    size="24" 
                    color="#6F7888"
                    onClick={() => window.open(props.data.data.item_link, "_blank")}                                         

                />
            {/* <Button
                icon="arrowright"
                onClick={() => window.open(props.data.data.item_link, "_blank")}                                         
            /> */}
            </Col>
        </Row>
    </>
    );
}
export default LinkCell