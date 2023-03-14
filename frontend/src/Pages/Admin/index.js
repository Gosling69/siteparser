import { useEffect, useState } from "react"
import ApiService from "../../Api/api"
import {Row, Col, Form, Button, Container} from "react-bootstrap"

const AdminPage = (props) => {

    const[items, setItems] = useState([])
    const[ourItems, setOurItems] = useState([])
    const [ourItemId, setOurItemId] = useState("")
    const [enemyItemId, setEnemyItemId] = useState("")

    useEffect(() =>{
        ApiService.getItems()
        .then((res) =>{
            console.log(res)
            setItems(res)
        }) 
        ApiService.getOurItems()
        .then((res) =>{
            console.log(res)
            setOurItems(res)
        }) 
    },[])

    return(
        <Container>
            <Row>
                <Col>
                    Our Items
                    <Form.Select
                        onChange={(e) => setOurItemId(e.target.value)}
                    >
                        {ourItems.map(el =>
                            <option value={el?._id?.$oid}>{el.name}</option>

                        )}
                    </Form.Select>
                </Col>
                <Col>
                    Enemy Items
                    <Form.Select
                        onChange={(e) => setEnemyItemId(e.target.value)}
                    >
                        {items.map(el =>
                            <option value={el?._id?.$oid}>{el.name}</option>

                        )}
                    </Form.Select>
                </Col>
                <Col>
                    <Button 
                        onClick={
                            () => ApiService.linkItems({
                                our_item_id: ourItemId,
                                enemy_item_id: enemyItemId,
                            })
                        }
                    >
                        Link
                    </Button>
                    <Button 
                        onClick={
                            () => ApiService.runUpdate()
                        }
                    >
                        RUN UPDATE
                    </Button>
                </Col>
            </Row>
        </Container>
    )

}

export default AdminPage