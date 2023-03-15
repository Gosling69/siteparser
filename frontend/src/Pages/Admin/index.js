import { useEffect, useState } from "react"
import ApiService from "../../Api/api"
import {Row, Col, Form, Button, Container, InputGroup, Dropdown, DropdownButton, Offcanvas, Tab, Tabs } from "react-bootstrap"
import LinkItemsComponent from "../../Components/LinkItemsComponent"
import ItemEdit from "../../Components/ItemEdit"
import OurItemEdit from "../../Components/OurItemEdit"
import SiteEdit from "../../Components/SiteEdit"

const AdminPage = (props) => {

    const[items, setItems] = useState([])
    const[ourItems, setOurItems] = useState([])
    const [sites, setSites] = useState([])
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

    // let siteNames = Array.from(new Set(items.map(el => el.site.name)))

    return(
        // <Container className="mx-1">
        <>
            <Tabs  
                defaultActiveKey="items"
                id="fill-tab-example"
                className="mt-3 mx-3"
                fill
                justify
            >
            {/* <Tab className="mx-5" eventKey="link" title="Link Items">
                <LinkItemsComponent
                    items={items}
                    ourItems={ourItems}
                />
            </Tab> */}
            <Tab className="mx-5 mt-2" eventKey="items" title="Items">
                <ItemEdit
                    refresh={refreshItems}
                    items={items}
                    sites={sites}
                />
            </Tab>
            <Tab className="mx-5 mt-2" eventKey="ouritems" title="Our Items">
                <OurItemEdit
                    refresh={refreshOurItems}
                    items={items}
                    ourItems={ourItems}
                />
            </Tab>
            <Tab className="mx-5 mt-2" eventKey="sites" title="Sites">
                <SiteEdit
                    refresh={refreshSites}
                    sites={sites}
                />
            </Tab>
            <Tab className="mx-5 mt-2" eventKey="other" title="Other">
                <Row>
                    <Col>
                    <Button
                        onClick={ApiService.runUpdate}
                    >
                        Run Update
                    </Button>
                    </Col>
                </Row>
            </Tab>
            </Tabs>
                
        {/* </Container> */}
        </>
    )

}

export default AdminPage