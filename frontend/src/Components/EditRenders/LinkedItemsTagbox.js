import React, { useEffect, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';


const LinkedItemsTagbox = (props) => {

    const onValueChanged = (e) => {
      props.data.setValue(e.value);
    }
  
    const onSelectionChanged = () => {
      props.data.component.updateDimensions();
    }
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