import { useState, useEffect, useRef, useCallback } from "react"
import DataGrid, {
    Column,
    FormItem,
    Editing,
    Form,
    Lookup,
    Popup,
    Item,
    Button,

  } from 'devextreme-react/data-grid';
// import 'devextreme-react/text-area';
import ApiService from "../../Api/api";
import {Row, Col, } from "react-bootstrap"
import CommonToolbar from "../Toolbars/CommonToolbar";
import LinkCell from "../CellRenders/LinkCell";
import EditDeleteIcons from "../Icons/EditDeleteIcons";
import CategoriesSelect from "../EditRenders/CategoriesSelect";
import CategoryCell from "../CellRenders/CategoryCell";
import CategoryValuesCell from "../CellRenders/CategoryValuesCell";


const ItemEdit = (props) => {

    const [items,setItems] = useState(props.items)
    const [sites, setSites] = useState(props.sites)
    const [categories, setCategories] = useState(props.categories)

    let gridRef = useRef(null);

    useEffect(() =>{
        setItems(props.items)
    },[props.items])

    useEffect(() =>{
        setSites(props.sites)
    },[props.sites])
    
    useEffect(() =>{
        setCategories(props.categories)
    },[props.categories])

    return(
        <>
        <CommonToolbar
            addRow={() => gridRef.instance.addRow()}
            importFromXlsx={ApiService.importItems}
            refresh={props.refresh}
            type="item"
        />
        <DataGrid
            dataSource={items}
            repaintChangesOnly={true}
            keyExpr="_id"
            showColumnLines={false}
            allowColumnResizing={true}
            showRowLines={false}
            showBorders={false}
            rowAlternationEnabled={true}
            height={550}
            ref={(ref) => { gridRef = ref}}
            onRowUpdated={(e) => {
                ApiService.updateItem(e.data)
                .then(() => {
                    props.refresh()
                })
            }}
            onRowRemoved={(e) => {
                ApiService.deleteItem(e.key.$oid)
                .then((res) =>{ 
                    window.alert(res);
                    props.refresh() 
                })
            }}
            onRowInserted={(e) => {
                ApiService.addItem(e.data)
                .then(() => {
                    props.refresh()
                })
            }}
        >
        <Editing
            mode="popup"
        >
        <Popup title="Item Info" showTitle={true} width={700} height={500} />
        <Form>
            <Item itemType="group" colCount={1} colSpan={2}>
                    <Item dataField="name" />
                    <Item dataField="item_link" />
                    <Item dataField="category" />
            </Item>
        </Form>
        </Editing>
        <Column dataField="name" />
        <Column 
            width={100}
            dataField="category" 
            caption="Category"
            allowEditing={true}
            cellRender={data => <CategoryCell {...data}/>}
            editCellComponent={data => 
                <CategoriesSelect 
                    categories={categories} 
                    gridRef={gridRef} 
                    {...data}
                />
            }            
        >
            <Lookup
                dataSource={categories}
                displayExpr="name"
                valueExpr="_id.$oid"
            />
        </Column>
        <Column 
            dataField="category.values" 
            caption="Category Props"
            cellRender={data => <CategoryValuesCell {...data}/>}
            allowEditing={true}
            // editCellComponent={CategoryPropsEdit}
        >
        </Column>
        <Column dataField="item_link" width={350} >
            
            {/* <PatternRule
                message={'Invalid Link Format'}
                pattern={/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g}
            /> */}
        </Column>
        <Column dataField="last_price"/>
        <Column dataField="last_quantity"/>

        <Column 
            width={300}
            dataField="site._id.$oid" 
            caption="Site"
            allowEditing={false}
            cellRender={data => <LinkCell data={data}/>}
        >
            <Lookup
                dataSource={sites}
                displayExpr="name"
                valueExpr="_id.$oid"
            />
        </Column>
        <Column 
            width={100} 
            cellRender={
                    data => 
                    <EditDeleteIcons 
                        editRow={gridRef.instance.editRow} 
                        deleteRow={gridRef.instance.deleteRow} 
                        data={data}
                    />
                }
            >
        </Column>
        </DataGrid>
        </>
    )
}

export default ItemEdit
ItemEdit.defaultProps={
    items:[],
    sites:[],
    refresh:() => console.log("REFRESH")
}