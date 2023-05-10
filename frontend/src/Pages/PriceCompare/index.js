import { useState, useEffect } from "react"
import ApiService from "../../Api/api"
import {Row, Col, OverlayTrigger, Tooltip, Tab, Form, Container} from "react-bootstrap"
import {Button} from "devextreme-react"
import StoreCard from "../../Components/Cards/StoreCard"
import NavBar from "../../Components/Toolbars/NavBar"
import UilExternalLinkAlt from '@iconscout/react-unicons/icons/uil-external-link-alt'

 const PriceCompare = (props) => {

    const [items, setItems] = useState([])
    const [nameFilter, setNameFilter] = useState("")
    const [activeItem, setActiveItem] = useState("")
    
    const successColor = "#198754"
    const dangerColor = "#DC3545"
    const noneColor = "#CACDD1"

    const setColor = (priceList, ourLastPrice) => {
        if (!priceList.length) return noneColor
        if(priceList.some((elem) => elem < ourLastPrice)) {
            return dangerColor
        }
        if (priceList.some((elem) => elem > ourLastPrice)) {
            return successColor
        }
        return "black"
    }

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
                    .map((el) =>
                        {
                            let prices = el.linked_items.map(el => el.last_price)
                            let color = setColor(prices, el.last_price)
                            // let color = !prices.length ? "black" : prices.some((elem) => elem > el.last_price) ? "#198754":"#DC3545"
                            return(
                                <Row 
                                    className="align-items-center mx-1 mt-0 mb-0 pb-1 pt-1 d-flex"  
                                    style={{
                                        "color":color,
                                        "backgroundColor":activeItem === el._id.$oid? "#FBEA58":"white",
                                        "cursor":"pointer",
                                        "borderRadius":"10px"
                                    }} 
                                    onClick={() => setActiveItem(el._id.$oid)} 
                                >
                                    <Col 
                                        // style={{
                                        //     "overflow": "hidden",
                                        //     "whiteSpace": "nowrap",
                                        //     "textOverflow": "ellipsis",

                                        // }} 
                                        className="pr-0" 
                                        xs={6} 
                                    >
                                        {/* {el.name} */}
                                    <OverlayTrigger overlay={<Tooltip placement="top" id={el._id.$oid + " tooltip"}>{el.name}</Tooltip>}>
                                        <p style={{
                                            "overflow": "hidden",
                                            "whiteSpace": "nowrap",
                                            "textOverflow": "ellipsis",
                                            margin:0,
                                            padding:0

                                        }} >{el.name}</p>

                                    </OverlayTrigger>

                                    </Col>
                                    <Col className="d-flex justify-content-center" >
                                        {`${el.last_price} р`}
                                    </Col>
                                    <Col xs={2} className="d-flex justify-content-end" >
                                
                                    <UilExternalLinkAlt
                                        className="clickIcon"
                                        size="24" 
                                        color="#6F7888"
                                        onClick={() => window.open(el.item_link, "_blank")} 

                                    />
                                    </Col>
                                </Row>  
                            )
                        })
                    }
                </Col>
                <Col className="mx-4">
                <Tab.Content>
                    {items.map((el) =>
                         <Tab.Pane eventKey={el._id.$oid}>
                            <Row className="mt-2" xs={1} lg={2} xl={3}>
                            {el.linked_items.map(item =>
                                <Col className="mb-5" >
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