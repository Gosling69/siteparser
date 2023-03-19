import { useState, useEffect, useRef } from "react"
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
  import 'devextreme-react/text-area';
import ApiService from "../Api/api";
import {Row, Col, } from "react-bootstrap"
import CommonToolbar from "./CommonToolbar";
import LinkCell from "./LinkCell";
import EditDeleteIcons from "./EditDeleteIcons";


const ItemEdit = (props) => {

    const [items,setItems] = useState(props.items)
    const [sites, setSites] = useState(props.sites)

    let gridRef = useRef(null);

    useEffect(() =>{
        setItems(props.items)
    },[props.items])
    useEffect(() =>{
        // console.log(props.sites)
        setSites(props.sites)
    },[props.sites])

 

    return(
        <>
        <CommonToolbar
            addRow={() => gridRef.instance.addRow()}
        />
        <DataGrid
            dataSource={items}
            keyExpr="_id"
            showColumnLines={false}
            allowColumnResizing={true}
            showRowLines={false}
            showBorders={false}
            rowAlternationEnabled={true}
            height={650}
            ref={(ref) => { gridRef = ref}}
            onRowUpdated={(e) => ApiService.updateItem(e.data).then(() => props.refresh())}
            onRowRemoved={(e) => console.log(e)}
            onRowInserted={(e) => ApiService.addItem(e.data).then(() => props.refresh())}
        >
        <Editing
            mode="popup"
            // allowUpdating={true}
            // allowDeleting={true}
            // useIcons={true}
        >
        <Popup title="Item Info" showTitle={true} width={700} height={300} />
        <Form>
            <Item itemType="group" colCount={1} colSpan={2}>
                    <Item dataField="name" />
                    <Item dataField="item_link" />
            </Item>
        </Form>
        </Editing>
        <Column dataField="name" />
        <Column dataField="item_link" width={550} >
            {/* <PatternRule
                message={'Invalid Link Format'}
                pattern={/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g}
            /> */}
        </Column>
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
          
            {/* <Button name="edit"/>
            <Button name="delete"/> */}

           

        </Column>
        {/* <Scrolling mode="virtual" /> */}
        {/* <FormItem colSpan={2} editorType="dxTextArea" editorOptions={notesEditorOptions} /> */}
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