import { useEffect, useState } from "react"
import ApiService from "../../Api/api"
import {Row, Col, Form, Button, Nav, InputGroup, Dropdown, DropdownButton, Offcanvas, Tab, Tabs } from "react-bootstrap"
import LinkItemsComponent from "../../Components/LinkItemsComponent"
import ItemEdit from "../../Components/ItemEdit"
import OurItemEdit from "../../Components/OurItemEdit"
import SiteEdit from "../../Components/SiteEdit"
import NavBar from "../../Components/NavBar"

const AdminPage = (props) => {

    const[items, setItems] = useState([])
    const[ourItems, setOurItems] = useState([])
    const [sites, setSites] = useState([])
    const [activeTab, setActiveTab] = useState("Items")

    const refreshItems = () => {
        ApiService.getItems()
        .then((res) =>{
            console.log(res)
            setItems(res)
        }) 
    }
    const refreshOurItems = () => {
        ApiService.getOurItems()
        .then((res) =>{
            console.log(res)
            setOurItems(res.map(el => {
                el.linked_items_ids = el.linked_items.map(item => item._id.$oid) 
                return el
            }))
        }) 
    }
    const refreshSites = () => {
        ApiService.getSites()
        .then((res) => {
            setSites(res)
        })
    }
    useEffect(() =>{
        refreshItems()
        refreshOurItems()
        refreshSites()
    },[])
    const ButtonStyle= (item) =>{
        return{
            "minHeight":90,
            "boxShadow": "0px 4px 5px rgba(0, 0, 0, 0.25)",
            "backgroundColor":item === activeTab ? "#FBEA58":"white",
            "color":"black",
            "border":"none",
        }
    }
    return(
        <>
        <NavBar/>
        <Tab.Container activeKey={activeTab}>
            <Row className="align-items-center" style={{"marginRight":"40px"}}>
                <Col xs={11}>
                    <Tab.Content>
                    <Tab.Pane className="mt-2 " eventKey="Items" title="Items">
                        <ItemEdit
                            refresh={refreshItems}
                            items={items}
                            sites={sites}
                        />
                    </Tab.Pane >
                    <Tab.Pane  className="mt-2" eventKey="Our Items" title="Our Items">
                        <OurItemEdit
                            refresh={refreshOurItems}
                            items={items}
                            ourItems={ourItems}
                        />
                    </Tab.Pane >
                    <Tab.Pane  className="mt-2" eventKey="Sites" title="Sites">
                        <SiteEdit
                            refresh={refreshSites}
                            sites={sites}
                        />
                    </Tab.Pane >
                </Tab.Content>      
                </Col>
                <Col style={{"paddingLeft":"50px", "paddingRight":"0"}} xs={1}>
                    {["Items","Our Items","Sites"].map((el,index) =>
                        <Row className={index === 0 ? "mb-3 mt-5":" mb-3"}>
                        <Button
                            // variant='secondary'
                            style={ButtonStyle(el)}
                            onClick={() => setActiveTab(el)}
                            // active={activeTab === el}
                        >
                            {el}
                        </Button>
                        </Row>
                    )}               
                </Col>
            </Row>
        </Tab.Container>
        </>
    )

}

export default AdminPage