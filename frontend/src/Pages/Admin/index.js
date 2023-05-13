import { useEffect, useState, useContext } from "react"
import {Row, Col, Form, Button, Nav, InputGroup, Dropdown, DropdownButton, Offcanvas, Tab, Tabs } from "react-bootstrap"
import ItemEdit from "../../Components/Tables/ItemEdit"
import OurItemEdit from "../../Components/Tables/OurItemEdit"
import SiteEdit from "../../Components/Tables/SiteEdit"
import NavBar from "../../Components/Toolbars/NavBar"
import ErrorsTable from "../../Components/Tables/ErrorsTable"
import CategoriesTable from "../../Components/Tables/CategoriesEdit"
import useFilteredData from "../../hooks/useFilteredData"
import useFetch from "../../hooks/useFetch"
import { isArray } from "lodash"
import { addlinkedItemsIds } from "../../helpers/processDataFuncs"

const AdminPage = (props) => {

    const [activeTab, setActiveTab] = useState("Items")


    const {
        data:items, 
        error:itemsError, 
        loading:itemsLoading, 
        refetch:refreshItems
    } = useFetch("/get_items", "GET", {}, true)
    const {
        data:ourItems, 
        error:ourItemsError, 
        loading:ourItemsLoading, 
        refetch:refreshOurItems
    } = useFetch("/get_our_items", "GET", {}, true, addlinkedItemsIds)
    const {
        data:sites, 
        error:sitesError, 
        loading:sitesLoading, 
        refetch:refreshSites
    } = useFetch("/get_sites", "GET", {}, true)
    const {
        data:errors, 
        error:errorsError, 
        loading:errorsLoading, 
        refetch:refreshErrors
    } = useFetch("/get_errors", "GET", {}, true)
    const {
        data:categories, 
        error:categoriesError, 
        loading:categoriesLoading, 
        refetch:refreshCategories
    } = useFetch("/get_categories", "GET", {}, true)


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
                        <Row key={index} className={index === 0 ? "mb-3 mt-5":" mb-3"}>
                        <Button
                            style={ButtonStyle(el)}
                            onClick={() => setActiveTab(el)}
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