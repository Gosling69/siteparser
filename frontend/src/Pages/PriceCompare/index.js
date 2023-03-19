import { useState, useEffect } from "react"
import ApiService from "../../Api/api"
import {Row, Col, Nav, Tab, Form} from "react-bootstrap"
import {Button} from "devextreme-react"
import StoreCard from "../../Components/StoreCard"
import NavBar from "../../Components/NavBar"
 const PriceCompare = (props) => {

    const [items, setItems] = useState([])
    const [nameFilter, setNameFilter] = useState("")
    const [activeItem, setActiveItem] = useState("")


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
        <NavBar/>

        <Tab.Container activeKey={activeItem} id="left-tabs-example" defaultActiveKey="first">
            <Row className="mt-3 mx-1">
                <Col 
                    className="navcol"
                    xs={4}
                >
                    <div className="stickme">
                    <Form.Control
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="mb-3 mt-3" 
                        type="text" 
                        placeholder="Item name" 
                    />
                    </div>
                    
                    {items
                    .filter(el => el.name.toLowerCase().includes(nameFilter.toLowerCase()))
                    .map((el, index) =>
                        {
                            let prices = el.linked_items.map(el => el.last_price)
                            let color = !prices.length? "black" : prices.some((elem) => elem > el.last_price) ? "#198754":"#DC3545"
                            return(
                                <Row 
                                    className="align-items-center mx-1 mt-0 mb-0 d-flex"  
                                    style={{
                                        "color":color,
                                        "backgroundColor":activeItem === index? "#FBEA58":"white",
                                        "cursor":"pointer",
                                        "borderRadius":"10px"
                                    }} 
                                    onClick={() => setActiveItem(index)} 
                                >
                                    <Col  className="pr-0 itemNameCol" xs={6} >
                                        {el.name}
                                    </Col>
                                    <Col className="d-flex justify-content-center" >
                                        {`${el.last_price} р`}
                                    </Col>
                                    <Col xs={2} className="d-flex justify-content-end" >
                                    <Button
                                        icon="link"
                                        onClick={() => window.open(el.item_link, "_blank")} 
                                    />
                                    {/* <UilExternalLinkAlt 
                                        onClick={() => window.open(el.item_link, "_blank")} 
                                        size="40" 
                                        color="#6F7888" 
                                        className="yellowhover"
                                    /> */}
                                    </Col>
                                </Row>  
                            )
                        })
                    }
                </Col>
                <Col className="mx-4">
                <Tab.Content>
                    {items.map((el, index) =>
                         <Tab.Pane eventKey={index}>
                            <Row  xs={1} sm={2} md={2} lg={3}>
                            {el.linked_items.map(item =>
                                <Col >
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