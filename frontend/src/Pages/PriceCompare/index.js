import { useState, useEffect } from "react"
import {Row, Col, OverlayTrigger, Tooltip, Tab, Form, Container, InputGroup} from "react-bootstrap"
import {Button} from "devextreme-react"
import StoreCard from "../../Components/Cards/StoreCard"
import NavBar from "../../Components/Toolbars/NavBar"
import UilExternalLinkAlt from '@iconscout/react-unicons/icons/uil-external-link-alt'
import useFetch from "../../hooks/useFetch"
import useFilteredData from "../../hooks/useFilteredData"
import PriceCompareTable from "../../Components/Tables/PriceCompareTable"

 const PriceCompare = (props) => {

    const [nameFilter, setNameFilter] = useState("")
    const [activeItem, setActiveItem] = useState("")

    const {
        data:ourItems, 
        error:ourItemsError, 
        loading:ourItemsLoading, 
        refetch:refreshOurItems
    } = useFetch("/get_our_items", "GET", {}, true)

    const {
        data:categories, 
        error:categoriesError, 
        loading:categoriesLoading, 
        refetch:refreshCategories
    } = useFetch("/get_categories", "GET", {}, true)

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

    const CardListView = () => {
        // const rowStyle = {
        //     overflowY:"scroll",
        //     height:"65vh"
        // }

        return <>
        {(ourItems ?? [])
        .map((el) =>
            <Tab.Pane key={el._id.$oid} eventKey={el._id.$oid}>
            <Row className="mt-2" xs={1} lg={2} xxl={3}>
            {el.linked_items.map(item =>
                <Col key={item._id.$oid} className="mb-5" >
                <StoreCard
                    item={item}
                    ourPrice={el.last_price}
                />
                </Col>
            )}
            </Row>
            </Tab.Pane>
        )}
        </>
    }


    const OurItemsList = (data) => {
        return <>
            {
                (useFilteredData(ourItems) ?? [])
                .filter(el => el.name.toLowerCase().includes(nameFilter.toLowerCase()))
                .map((el) =>
                {
                    let prices = el.linked_items.map(el => el.last_price)
                    let color = setColor(prices, el.last_price)
                    return(
                        <Row 
                            className="align-items-center mx-1 mt-0 mb-0 pb-1 pt-1 d-flex"  
                            style={{
                                "color":color,
                                "backgroundColor":activeItem === el._id.$oid? "#FBEA58":"white",
                                "cursor":"pointer",
                                "borderRadius":"10px"
                            }} 
                            key={el._id.$oid}
                            onClick={() => setActiveItem(el._id.$oid)} 
                        >
                            <Col 
                                className="pr-0" 
                                xs={6} 
                            >
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
        </>
    }


    return(
        <>
        <NavBar categories={categories} />
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
                <OurItemsList />
                </Col>
                 <Col className="mx-4">
                 <Tab.Content>
                 <CardListView/>
                 </Tab.Content>
                 </Col>
             </Row>
         </Tab.Container>
        </>
    )

 }

 export default PriceCompare