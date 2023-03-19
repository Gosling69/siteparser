
import { useState } from "react"
import {Card, Row, Col} from "react-bootstrap"
import { Button } from "devextreme-react"

const StoreCard = (props) => {

    const [item, setItem] = useState(props.item)
    const [variant, setVariant] = useState(props.ourPrice < item.last_price ? "success" : "danger")
    const triangleUp ="\u25B2"
    const triangleDown ="\u25BC"
    return(
            <Card
                bg={variant}
                key={item.item_link}
                text={'white'}
                style={{ 
                    width: '18rem', 
                    border:"None" ,
                    filter: "drop-shadow(0px 4px 5px rgba(0, 0, 0, 0.25))",
                }}
            >

            <Card.Header 
                style={{"backgroundColor":"white"}}
            >
                <div
                    style={{"color": variant === "success" ? "green" : "red"}}
                >
                    {item.site?.name}
                </div>
            </Card.Header>
            <Card.Body>

            <Row >
                <Col> 
                    {item.name}
                </Col>
                <Col xs={1}></Col>
                <Col style={{"textAlign":"center", "fontSize":"large"}} xs={4}>
                    {`${item.last_price} р`}
                </Col>
            </Row>
            <Row className="mb-5">
                <Col> 
                </Col>
                <Col style={{"fontSize":"20px"}} xs={1}>
                {variant === "success" ? triangleUp : triangleDown}
                </Col>
                <Col style={{"textAlign":"center", "fontSize":"large"}} xs={4}>
                {`${Math.abs(props.ourPrice - item.last_price)} р`}
                </Col>
            </Row>
            </Card.Body>
            <Card.Footer>
            <Row>
                <Col>
                    Ссылка на товар в магазине
                </Col>
                <Col xs={3}>
                    <Button 
                        icon="link"
                        onClick={() => window.open(item.item_link, "_blank")} 
                        // variant="primary"
                    >
                    </Button>
                </Col>
            </Row>    
            </Card.Footer>
            </Card>
    )

}

export default StoreCard