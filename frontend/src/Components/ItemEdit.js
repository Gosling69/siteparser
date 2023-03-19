import { useState, useEffect } from "react"
import DataGrid, {
    Column,
    FormItem,
    Editing,
    Scrolling,
    Lookup,
    PatternRule,
    Toolbar,
    Item,
    Button
  } from 'devextreme-react/data-grid';
  import 'devextreme-react/text-area';
import ApiService from "../Api/api";
  

const ItemEdit = (props) => {

    const [items,setItems] = useState(props.items)
    const [sites, setSites] = useState(props.sites)

    useEffect(() =>{
        setItems(props.items)
    },[props.items])
    useEffect(() =>{
        // console.log(props.sites)
        setSites(props.sites)
    },[props.sites])

    const notesEditorOptions = { height: 100 };

    return(
        <DataGrid
            dataSource={items}
            keyExpr="_id"
            showBorders={true}
            height={700}
            onRowUpdated={(e) => ApiService.updateItem(e.data).then(() => props.refresh())}
            onRowRemoved={(e) => console.log(e)}
            onRowInserted={(e) => ApiService.addItem(e.data).then(() => props.refresh())}
        >
        <Editing
            mode="form"
            allowUpdating={true}
            allowAdding={true}
            // allowDeleting={true}
        />
        <Column dataField="name" />
        <Column dataField="item_link" width={550} >
            {/* <PatternRule
                message={'Invalid Link Format'}
                pattern={/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g}
            /> */}
        </Column>
        <Column 
            dataField="site._id.$oid" 
            caption="Site"
            allowEditing={false}
        >
            <Lookup
                dataSource={sites}
                displayExpr="name"
                valueExpr="_id.$oid"
            />
        </Column>
        {/* <Scrolling mode="virtual" /> */}
        <FormItem colSpan={2} editorType="dxTextArea" editorOptions={notesEditorOptions} />
        </DataGrid>
    )

}

export default ItemEdit
ItemEdit.defaultProps={
    items:[],
    sites:[],
    refresh:() => console.log("REFRESH")
}