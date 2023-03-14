
import { useState } from "react"
import {Card, Button} from "react-bootstrap"

const StoreCard = (props) => {

    const [item, setItem] = useState(props.item)
    const [variant, setVariant] = useState(props.ourPrice < item.last_price ? "success" : "danger")

    return(
            <Card
                // border={variant.toLowerCase()}
                bg={variant}
                key={item.item_link}
                text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                style={{ width: '18rem' }}
            >

            <Card.Header>Header</Card.Header>
            <Card.Body>
                <Card.Title>{`${item.name} - ${item.last_price}`}</Card.Title>
                <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
                </Card.Text>
                {/* <a target="_blank" href={item.item_link}>Google</a> */}
                <Button 
                    onClick={() => window.open(item.item_link, "_blank")} variant="primary"
                >
                        Ссылка на товар
                </Button>
            </Card.Body>
            </Card>
    )

}

export default StoreCard