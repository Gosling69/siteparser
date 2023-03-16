import { useState, useEffect } from "react"
import ApiService from "../../Api/api"
import {Row, Col, Nav, Tab, Card, Button} from "react-bootstrap"
import StoreCard from "../../Components/StoreCard"
 
 const PriceCompare = (props) => {

    const [items, setItems] = useState([])


    useEffect(() => {
        ApiService.getOurItems()
        .then((res) =>{
            console.log(res)
            setItems(res)
        })
        // setItems(data)
    },[])

    
    return(
        <>
        <Tab.Container  id="left-tabs-example" defaultActiveKey="first">
            <Row className="mt-4 mx-2">
                <Col style={{"overflowY":"scroll", "height":"85vh"}} sm={3}>
                <Nav variant="pills" className="flex-column">
                    {items.map((el, index) =>
                    {
                        let prices = el.linked_items.map(el => el.last_price)
                        let color = !prices.length? "black" : prices.some((elem) => elem > el.last_price) ? "#198754":"#DC3545"
                        return(
                            <Nav.Item>
                                <Row>
                                    <Col>
                                    <Nav.Link 
                                        style={{"backgroundColor":"white", "color":color}}
                                        eventKey={index}
                                    >
                                        {`${el.name} - ${el.last_price}`}
                                    </Nav.Link>
                                    </Col>
                                    <Col>
                                    <Button
                                        onClick={() => window.open(el.item_link, "_blank")} variant="primary"

                                    >
                                        Ссылка на товар
                                    </Button>
                                    </Col>
                                </Row>
                                
                               
                            </Nav.Item>
                        )
                    }
                    )}
                </Nav>
                </Col>
                <Col sm={9}>
                <Tab.Content>
                    {items.map((el, index) =>
                         <Tab.Pane eventKey={index}>
                            <Row xs={2} md={4}  lg={5}>
                            {el.linked_items.map(item =>
                                <Col>
                                <StoreCard
                                    item={item}
                                    ourPrice={el.last_price}
                                />
                                </Col>
                            )}
                            </Row>
                         </Tab.Pane>
                    )}
                </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </>
    )

 }

 export default PriceCompare