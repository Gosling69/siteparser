import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import { useEffect, useState } from 'react';
import {cloneDeep} from 'lodash';


const CategoriesSelect = (props) => {

    const [properties, setProperties] = useState([])
    const [categories, setCategories] = useState(props.categories)
    // console.log(props.data)
    //lookup for new vals not working
    const onValueChanged = (e) => {
        setProperties(
            categories
            .find(el => el._id.$oid === e.value)
            .properties
        )
        // props.gridRef.instance.cellValue(props.data.rowIndex, "category._id.$oid", e.value);
        // console.log(properties)
        // console.log(categories)
        // props.data.setValue(e.value);
        console.log(categories.find(el => el._id.$oid === e.value))
        props.data.setValue(cloneDeep(categories.find(el => el._id.$oid === e.value)));

        console.log(props.data)
        // props.updateEditableProps({})

    }
    const onInputChanged = (e, prop) => {
        console.log(e.value)
        console.log(categories)
        let targetCategory = cloneDeep(categories.find(
            el => el._id.$oid === props.data.row?.data?.category?._id?.$oid
        ))
        // console.log(targetCategory)
        targetCategory.values = targetCategory.values ?? {}
        for (let propVal in targetCategory.values ) {
            if (!properties.includes(propVal)) {
                console.log(propVal)
                delete targetCategory.values[propVal]
            } 
        }
        targetCategory.values[prop] = e.value
        props.data.setValue(targetCategory)
        console.log(props.data)
        // console.log(props.data)
        // let rowIndex = props.data.rowIndex
        // console.log(rowIndex)
        // console.log(e.value)
        // console.log(props.gridRef)
        // let copyVal = props.editableProps
        // copyVal[prop] = e.value
        // props.updateEditableProps(copyVal)

        // props.gridRef.instance.cellValue(rowIndex, "category_props", copyVal);
        // props.gridRef.instance.saveEditData();
    }

    //Change to props.data.row.....
    useEffect(() => {
        console.log(props.data)
        let targetCategory = categories
        .find(el => el.name === props.data?.row?.data?.category?.name)
        setProperties(targetCategory?.properties ?? [])

    },[])

    // useEffect(() => {
    //     setCategories(categories)
    //     console.log(props.data)
    //     let targetCategory = props.categories
    //     .find(el => el.name === props.data?.row?.data?.category?.name)
    //     setProperties(targetCategory?.properties ?? [])
    // },[props.categories])

 

    return (
        <>
        <SelectBox
            className='mb-3'
            defaultValue={categories.find(el => el._id.$oid === props.data?.value?._id?.$oid)?._id?.$oid ?? ""}
            {...props.data.column.lookup}
            onValueChanged={onValueChanged}
        />
        {
            properties.map(prop =>
            <TextBox  
                defaultValue={props.data.data?.category?.values?.[prop] ?? ""}
                key={prop}
                onValueChanged={(e) => onInputChanged(e, prop)}
                valueChangeEvent="keyup"
                showClearButton={true}
                placeholder={`${prop}...`}  
            />
            )
        }
        </>
    )
    
}
export default CategoriesSelect