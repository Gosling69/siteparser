import { useEffect, useState, useContext } from "react"
import ApiService from "../../Api/api"
import {Row, Col, Form, Button, Nav, InputGroup, Dropdown, DropdownButton, Offcanvas, Tab, Tabs } from "react-bootstrap"
import ItemEdit from "../../Components/Tables/ItemEdit"
import OurItemEdit from "../../Components/Tables/OurItemEdit"
import SiteEdit from "../../Components/Tables/SiteEdit"
import NavBar from "../../Components/Toolbars/NavBar"
import ErrorsTable from "../../Components/Tables/ErrorsTable"
import CategoriesTable from "../../Components/Tables/CategoriesEdit"
import useFilteredData from "../../hooks/useFilteredData"
import useFetch from "../../hooks/useFetch"
import { useCategoryOptions } from "../../Providers/CategoryOptionsProvider"

const AdminPage = (props) => {

    const[items, setItems] = useState([])
    const[ourItems, setOurItems] = useState([])
    const [sites, setSites] = useState([])
    const [errors, setErrors] = useState([])
    const [categories, setCategories] = useState([])
    const [activeTab, setActiveTab] = useState("Items")
    
    const {test, error, loading, refetch} = useFetch("http://localhost:5000/get_items", "GET", {}, true)
    // const filters = useFilters()
    

    // useEffect(() => {
    //     console.log("USPEH",filters)
    // },[filters])

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
    const refreshErrors = () => {
        ApiService.getErrors()
        .then((res) => {
            console.log(res)
            setErrors(res)
        })
    }
    const refreshCategories = () => {
        ApiService.getCategories()
        .then((res) => {
            console.log(res)
            setCategories(res)
        })
    }
    useEffect(() =>{
        refreshItems()
        refreshOurItems()
        refreshSites()
        refreshErrors()
        refreshCategories()
        refetch()
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
        <NavBar categories={categories}/>
        <Tab.Container activeKey={activeTab}>
            <Row className="align-items-center" style={{"marginRight":"40px"}}>
                <Col xs={11}>
                    <Tab.Content>
                    <Tab.Pane className="mt-2 " eventKey="Items" title="Items">
                        <ItemEdit
                            refresh={refreshItems}
                            items={useFilteredData(items)}
                            sites={sites}
                            categories={categories}
                        />
                    </Tab.Pane >
                    <Tab.Pane  className="mt-2" eventKey="Our Items" title="Our Items">
                        <OurItemEdit
                            refresh={refreshOurItems}
                            items={items}
                            ourItems={useFilteredData(ourItems)}
                            categories={categories}
                        />
                    </Tab.Pane >
                    <Tab.Pane  className="mt-2" eventKey="Sites" title="Sites">
                        <SiteEdit
                            refresh={refreshSites}
                            sites={sites}
                        />
                    </Tab.Pane >
                    <Tab.Pane  className="mt-2" eventKey="Errors" title="Errors">
                        <ErrorsTable
                            errors={errors}
                            refresh={refreshErrors}
                        />
                    </Tab.Pane >
                    <Tab.Pane  className="mt-2" eventKey="Categories" title="Categories">
                        <CategoriesTable
                            categories={categories}
                            refresh={refreshCategories}
                        />
                    </Tab.Pane >
                </Tab.Content>      
                </Col>
                <Col style={{"paddingLeft":"50px", "paddingRight":"0"}} xs={1}>
                    {["Items","Our Items","Sites", "Errors", "Categories"].map((el,index) =>
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