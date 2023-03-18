import { useState, useEffect } from "react"
import DataGrid, {
    Column,
    FormItem,
    Editing,
    Scrolling,
    Lookup,
  } from 'devextreme-react/data-grid';
  import 'devextreme-react/text-area';
  

const SiteEdit = (props) => {

    const [sites, setSites] = useState(props.sites)
    useEffect(() =>{
        // console.log(props.sites)
        setSites(props.sites)
    },[props.sites])

    const notesEditorOptions = { height: 100 };

    return(
        <DataGrid
            dataSource={sites}
            keyExpr="_id"
            showBorders={true}
            height={625}
            onRowUpdated={(e) => console.log(e)}
        >
        <Editing
            mode="form"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
            
        />
        <Column dataField="name" />
        <Column dataField="url" />
        <Column dataField="path_to_price"  />
        <Column dataField="path_to_quantity" />
        <Column dataField="driver_type"/>
        <Column dataField="actions" />
        <Scrolling mode="virtual" />
            <FormItem colSpan={2} editorType="dxTextArea" editorOptions={notesEditorOptions} />
        </DataGrid>
    )

}

export default SiteEdit
SiteEdit.defaultProps={
    items:[],
    sites:[],
}