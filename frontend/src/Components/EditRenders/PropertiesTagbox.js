import React, { useEffect, useState } from 'react';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { Row, Col, Badge, CloseButton } from 'react-bootstrap';

const PropertiesTagbox = (props) => {


    const [properties, setProperties] = useState(props.data.data.properties ?? [])
    const [newPropName, setNewPropName] = useState("")

    const addProp = () => {
        if (properties.includes(newPropName)) return
        if(!newPropName) return
        props.data.setValue([...properties, newPropName]);
        setProperties(prevProps => [...prevProps, newPropName])
        setNewPropName(prevProps => "")
    
    }

    const PropBadge = ({propName}) => {
        const deleteProp = () => {
            setProperties(prevProps => {
                let targetIndex = properties.findIndex(el => el === propName)
                let newProps = [...prevProps.slice(0, targetIndex), ...prevProps.slice(targetIndex + 1, prevProps.length)] 
                props.data.setValue(newProps);
                return newProps
            })
        }
        return (
            <h4>
            <Badge  bg="secondary">
                <Row>
                    <Col>
                    {propName}

                    </Col>
                    <Col>
                    <CloseButton  onClick={deleteProp}/>

                    </Col>
                </Row>
                
            </Badge>
            </h4>
        )
    }
  
    return (
        <>
        <Row>
            <Col>
            <TextBox  
                value={newPropName}
                onValueChanged={(data) => setNewPropName(data.value)}
                valueChangeEvent="keyup"
                showClearButton={true}
                placeholder="Enter prop name..."  
            />
            </Col>
            <Col>
            <Button
                width={120}
                text="Add Prop"
                type="normal"
                stylingMode="contained"
                onClick={addProp}
            />       
            </Col>
        </Row>
        <Row className="mt-2" lg={3}>
        {properties.map(prop =>
            // <Col key={prop}>
                <PropBadge
                    key={prop}
                    propName={prop}
                />
            // </Col>
        )}
        </Row>
        
        </>

        // {properties.map(prop =>
        //     <Col>
        //         <TextBox  placeholder="Enter full name here..." />
        //     </Col>
        // )}
    //   <TagBox
    //       dataSource={
    //           props.data.column.lookup.dataSource
    //           // .filter(el => !props.data.value.includes(el))
    //       }
    //       defaultValue={props.data.value}
    //       // value={value}
    //       valueExpr="_id.$oid"
    //       displayExpr={(item) => `${item.name} (${item.site.name})`}
    //       showSelectionControls={true}
    //       maxDisplayedTags={5}
    //       // showMultiTagOnly={false}
    //       applyValueMode="useButtons"
    //       searchEnabled={true}
    //       onValueChanged={onValueChanged}
    //       onSelectionChanged={onSelectionChanged} 
    //   />
    )
}
export default PropertiesTagbox
