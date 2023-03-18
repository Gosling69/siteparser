
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {Row, Col, Container} from "react-bootstrap"
import {Chart, Series, ArgumentAxis,Label,Crosshair,Font,Legend} from "devextreme-react/chart"
  
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const DetailComponent = (props) => {
    // console.log(props.data.data.data)
    return(
        <>
           <Tabs
                defaultActiveKey="quantity"
                transition={false}
                id="uncontrolled-tab-example"
                className="mb-3"
                fill
            >
                <Tab eventKey="quantity" title="Quantity">
                {/* <Row>
                    <Col>
                    Динамика Остатков
                    <LineChart 
                        width={600} 
                        height={300} 
                        data={props.data.data.data.map(el => {
                            return {
                                quantity:el.quantity,
                                date_time:new Date(el.date_time.$date).toISOString()
                            }
                        })} 
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                        <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="date_time" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                    </Col>
                    <Col>
                    Динамика Цен
                    <LineChart 
                    width={600} 
                    height={300} 
                    data={props.data.data.data.map(el => {
                        return {
                            price:el.price,
                            date_time:new Date(el.date_time.$date).toISOString()
                        }
                    })} 
                    margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                >
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date_time" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
                    </Col>
                </Row> */}
                    {/* <LineChart 
                        width={500} 
                        height={300} 
                        data={props.data.data.data.map(el => {
                            return {
                                quantity:el.quantity,
                                date_time:new Date(el.date_time.$date).toISOString()
                            }
                        })} 
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                        <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="date_time" />
                        <YAxis />
                        <Tooltip />
                    </LineChart> */}

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
                </Tab>
                <Tab eventKey="pice" title="Price">
                {/* <LineChart 
                    width={500} 
                    height={300} 
                    data={props.data.data.data.map(el => {
                        return {
                            price:el.price,
                            date_time:new Date(el.date_time.$date).toISOString()
                        }
                    })} 
                    margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                >
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date_time" />
                    <YAxis />
                    <Tooltip />
                </LineChart> */}
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
                </Tab>
            </Tabs>
        </>
    )
}

export default DetailComponent