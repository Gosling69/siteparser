import React, { useEffect, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';

import Select from 'react-select';

const LinkedItemsTagbox = (props) => {

    // const [value, setValue] = useState(props.data.value)
    // const [options, setOptions] = useState(props.data.column.lookup.dataSource)

    // useEffect(() => {
    //     setValue(props.data.value)
    // },[props.data.value])
    // useEffect(() => {
    //     setOptions(props.data.column.lookup.dataSource)
    // },[props.data.column.lookup.dataSource])

    const onValueChanged = (e) => {
        // console.log(e.value)
        // console.log(props.data.column.lookup.dataSource)
        // console.log(props.data.value)
        // console.log(props.data.column.lookup.dataSource)
        // console.log(e.value)
        // let newEl = props.data.column.lookup.dataSource
        // .find(el => el._id.$oid === e.value)
        // let index = props.data.data.linked_items.indexOf(el => el?._id?.$oid === newEl?._id?.$oid)
        // if (index === -1) {
            
        // } else {

        // }
        // console.log(newEl, index)
        props.data.setValue(e.value);
      }
    
    const onSelectionChanged = () => {
        props.data.component.updateDimensions();
      }
    // console.log(props.data.value)
    // console.log(props.data.column.lookup.dataSource)
    return (
    <TagBox
        dataSource={
            props.data.column.lookup.dataSource
            // .filter(el => !props.data.value.includes(el))
        }
        defaultValue={props.data.value}
        // value={value}
        valueExpr="_id.$oid"
        displayExpr={(item) => `${item.name} (${item.site.name})`}
        showSelectionControls={true}
        maxDisplayedTags={5}
        // showMultiTagOnly={false}
        applyValueMode="useButtons"
        searchEnabled={true}
        onValueChanged={onValueChanged}
        onSelectionChanged={onSelectionChanged} 
        
    />
    )

}
export default LinkedItemsTagbox