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
        <Tab.Container  id="left-tabs-example" defaultActiveKey="first">
            <Row className="mt-4 mx-2">
                <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                    {items.map((el, index) =>
                    {
                        let prices = el.linked_items.map(el => el.last_price)
                        let color = prices.some((elem) => elem > el.last_price)? "green":"red"
                        // let prices = new Set(el.linked_items.map(el => el.last_price))
                        // console.log(priceSet)

                        return(
                            <Nav.Item>
                                <Nav.Link 
                                    // style={{"backgroundColor": el.last_price > el.linked_items}} 
                                    style={{"backgroundColor":color}}
                                    eventKey={index}
                                >
                                    {`${el.name} - ${el.last_price}`}
                                </Nav.Link>
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
                            {/* {[
                                'Danger',
                                'Danger',
                                'Success',
                                'Danger',
                                'Success',
                                'Success',
                                'Success',
                                'Danger',
                            ].map((variant) => (
                                <Col>

                                <StoreCard
                                    variant={variant}
                                />
                                </Col>
                            ))} */}
                            </Row>
                            
                         </Tab.Pane>
                    )}
                </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )

 }

 export default PriceCompare