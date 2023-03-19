
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {Row, Col, Container} from "react-bootstrap"
import {Chart, Series, ArgumentAxis,Label,Crosshair,Font,Legend, Tooltip} from "devextreme-react/chart"
  


const DetailComponent = (props) => {
    // console.log(props.data.data.data)
    return(
        <Row>
            <Col>
                <Chart
                    // id="quantityChart"
                    dataSource={props.data.data.data.map(el => {
                        return {
                            quantity:el.quantity,
                            date_time:new Date(el.date_time.$date).toISOString()
                        }
                    })}
                    title="Динамика остатков"
                >
                    <Series valueField={"quantity"} argumentField="date_time" />
                    <ArgumentAxis>
                        <Label
                            wordWrap="none"
                            overlappingBehavior={"stagger"}
                        />
                    </ArgumentAxis>
                    <Crosshair
                        enabled={true}
                        color="#949494"
                        width={3}
                        dashStyle="dot"
                    >
                    <Label
                        visible={true}
                        backgroundColor="#949494"
                    >
                    <Font
                        color="#fff"
                        size={12}
                        />
                    </Label>
                    </Crosshair>
                    <Legend visible={false} />
                    <Tooltip enabled={true} />
                </Chart>
            </Col>
            <Col>
                <Chart
                    // id="priceChart"
                    dataSource={props.data.data.data.map(el => {
                        return {
                            price:el.price,
                            date_time:new Date(el.date_time.$date).toISOString()
                        }
                    })}
                    title="Динамика цен"
                >
                    <Series valueField={"price"} argumentField="date_time" />
                    <ArgumentAxis>
                        <Label
                        
                            wordWrap="none"
                            overlappingBehavior={"stagger"}
                        />
                    </ArgumentAxis>
                    <Crosshair
                        enabled={true}
                        color="#949494"
                        width={3}
                        dashStyle="dot"
                    >
                    <Label
                        visible={true}
                        backgroundColor="#949494"
                    >
                    <Font
                        color="#fff"
                        size={12}
                        />
                    </Label>
                    </Crosshair>
                    <Legend visible={false} />
                    <Tooltip enabled={true} />
                </Chart>
            </Col>
        </Row>
    )
}

export default DetailComponent