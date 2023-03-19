import { useEffect, useState } from "react"
import ApiService from "../Api/api"
import {Row, Col, Form, Button, Container, InputGroup, Dropdown, DropdownButton, Offcanvas } from "react-bootstrap"

const LinkItemsComponent = (props) => {
    
    const[items, setItems] = useState(props.items)
    const[ourItems, setOurItems] = useState(props.ourItems)
    const [ourItem, setOurItem] = useState({})
    const [enemyItem, setEnemyItem] = useState("")
    const [siteFilter, setSiteFilter] = useState("")

    let siteNames = Array.from(new Set(items.map(el => el.site.name)))

    useEffect(() =>{
        setItems(props.items)
    },[props.items])
    useEffect(() =>{
        setOurItems(props.ourItems)
    },[props.ourItems])
    
    return(
        <Row>
                <Col>
                    <p>Our Items</p>
                    <Form.Select
                        onChange={(e) => setOurItem(ourItems.find(el => el._id.$oid === e.target.value) ?? {})}
                        value={ourItem?._id?.$oid}
                        defaultValue={""}
                    >
                        <option value=""></option>
                        {ourItems.map(el =>
                            <option value={el?._id?.$oid}>{el.name}</option>

                        )}
                    </Form.Select>
                </Col>
                <Col>
                    <p>Enemy Items</p>
                    <InputGroup >
                        <DropdownButton
                            variant="outline-secondary"
                            title={siteFilter}
                            id="input-group-dropdown-1"
                            onSelect={(eventKey, _) => setSiteFilter(eventKey)}
                        
                        >
                        <Dropdown.Item eventKey="" >None</Dropdown.Item>
                        {siteNames.map(el =>
                            <Dropdown.Item eventKey={el} >{el}</Dropdown.Item> 
                        )}
                        </DropdownButton>
                        <Form.Select
                            onChange={(e) => setEnemyItem(items.find(el => el._id.$oid === e.target.value) ?? {})}
                        >
                            <option value=""></option>
                            {items
                            .filter(el => el.site.name.includes(siteFilter))
                            .filter(el => {
                                    if (!ourItem.linked_items) return true
                                    let linkedIds = ourItem?.linked_items?.map(linked => linked._id.$oid)
                                    let selfId = el?._id?.$oid
                                    return !linkedIds.includes(selfId)
                                }
                            )
                            .map(el =>
                                <option value={el?._id?.$oid}>{el.name + ` (${el.site.name})`}</option>

                            )}
                        </Form.Select>
                    </InputGroup>
                </Col>
                <Col>
                </Col>
            </Row>
    )
}

export default LinkItemsComponent
LinkItemsComponent.defaultProps={
    items:[],
    ourItems:[]
}