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
    const [activeTab, setActiveTab] = useState("items")
    // const [ourItem, setOurItem] = useState({})
    // const [enemyItem, setEnemyItem] = useState("")
    // const [siteFilter, setSiteFilter] = useState("")
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
    const ButtonStyle={
        "minHeight":90,
        "boxShadow": "0px 4px 5px rgba(0, 0, 0, 0.25)",
        "backgroundColor":"white",
        "color":"black",
        "border":"none",
        '&:active': {
            "backgroundColor": '#FBEA58 !important',
          } 
    }
    // let siteNames = Array.from(new Set(items.map(el => el.site.name)))

    return(
        // <Container className="mx-1">
        <>
        <NavBar/>

        <Tab.Container activeKey={activeTab} id="left-tabs-example" defaultActiveKey="items">
            <Row className="align-items-center" style={{"marginRight":"40px"}}>
                <Col xs={11}>
                <Tab.Content>
                <Tab.Pane  className="mx-5 mt-2 " eventKey="items" title="Items">
                    <ItemEdit
                        refresh={refreshItems}
                        items={items}
                        sites={sites}
                    />
                </Tab.Pane >
                <Tab.Pane  className="mx-5 mt-2" eventKey="ouritems" title="Our Items">
                    <OurItemEdit
                        refresh={refreshOurItems}
                        items={items}
                        ourItems={ourItems}
                    />
                </Tab.Pane >
                <Tab.Pane  className="mx-5 mt-2" eventKey="sites" title="Sites">
                    <SiteEdit
                        refresh={refreshSites}
                        sites={sites}
                    />
                </Tab.Pane >
                {/* <Tab.Pane  className="mx-5 mt-2" eventKey="other" title="Other">
                    <Row>
                        <Col>
                        <Button
                            
                            onClick={ApiService.runUpdate}
                        >
                            Run Update
                        </Button>
                        </Col>
                    </Row>
                </Tab.Pane > */}
                </Tab.Content>

                
                </Col>
                <Col xs={1}>
                    <Row className="mb-3 mt-5 ">
                    <Button
                        // variant='secondary'
                        style={ButtonStyle}
                        onClick={() => setActiveTab("items")}
                        active={activeTab === "items"}
                    >
                        Items
                    </Button>
                    </Row>
                    <Row className="mb-3">
  
                    <Button
                        // variant='secondary'
                        style={ButtonStyle}
                        active={activeTab === "ouritems"}

                        onClick={() => setActiveTab("ouritems")}
                    >
                        Our Items
                    </Button>
                    </Row>
                    <Row className="mb-3">
                    <Button
                        // variant='secondary'
                        style={ButtonStyle}
                        active={activeTab === "sites"}

                        onClick={() => setActiveTab("sites")}

                    >
                        Sites
                    </Button>
                    </Row>
                    <Row className="mb-3">
                    <Button
                        variant='secondary'
                        onClick={ApiService.runUpdate}
                    >
                            Run Update
                        </Button>
                    </Row>

                  
                   
                   
                {/* <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                        <Nav.Link eventKey="items">Items</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="ouritems">Our Items</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="sites">Sites</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="other">Other</Nav.Link>
                    </Nav.Item>
                </Nav> */}
                </Col>
            </Row>

            {/* <Tabs  
                defaultActiveKey="items"
                id="fill-tab-example"
                className="mt-3 mx-3"
                fill
                justify
            > */}
            {/* <Tab className="mx-5" eventKey="link" title="Link Items">
                <LinkItemsComponent
                    items={items}
                    ourItems={ourItems}
                />
            </Tab> */}
            
        </Tab.Container>
        </>
    )

}

export default AdminPage