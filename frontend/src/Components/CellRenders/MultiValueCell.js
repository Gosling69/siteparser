import DropDownButton from 'devextreme-react/drop-down-button';


const MultiValueCell = (props) => {
    // console.log(props.data)
    const data = props.data.displayValue.map(el => new Date(el.$date).toLocaleString())
    return (
        <DropDownButton
            text={data[data.length-1]}    
            dropDownOptions={{width:400}}
            items={data}
        />
    );
}
export default MultiValueCell