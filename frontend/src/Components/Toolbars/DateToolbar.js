import { Button,  Col,  Row, Form, InputGroup} from "react-bootstrap"

const BarStyle={
    boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.25)",
    border:"none",
    borderRadius: "10px"


}


const DateToolbar = (props) => {
    return (
            <InputGroup style={BarStyle}>
            <Button onClick={() =>props.setDay()} variant="secondary">Day</Button>
            <Button onClick={() =>props.setWeek()} variant="secondary">Week</Button>
            <Button onClick={() =>props.setMonth()} variant="secondary">Month</Button>
            <Form.Control
                value={props.initDate}
                onChange={(e) => props.setInitDate(e.target.value)}
                type='date'
            />
            <Form.Control
                value={props.endDate}
                onChange={(e) => props.setEndDate(e.target.value)}
                type='date'
            />
            </InputGroup>
    )
}
export default DateToolbar
DateToolbar.defaultProps={
    setDay: () => console.log("NO SET DAY"),
    setWeek: () => console.log("NO SET WEEK"),
    setMonth: () => console.log("NO SET MONTH"),
    setInitDate: () => console.log("NO SET INITDATE"),
    setEndDate: () => console.log("NO SET ENDDATE"),
    initDate: new Date().toISOString().slice(0,10),
    endDate: new Date().toISOString().slice(0,10),
}