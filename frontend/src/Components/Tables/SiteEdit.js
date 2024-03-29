import { useState, useEffect, useRef } from "react"
import DataGrid, {
    Column,
    FormItem,
    Editing,
    Scrolling,
    Lookup,
  } from 'devextreme-react/data-grid';
  import 'devextreme-react/text-area';
  import CommonToolbar from "../Toolbars/CommonToolbar";
  

const SiteEdit = ({sites, refresh}) => {


    let gridRef = useRef(null);

    const notesEditorOptions = { height: 100 };

    return(
        <>
        <CommonToolbar
            addRow={() => gridRef.instance.addRow()}
            type="site"
            refresh={refresh}
            importFromXlsx={() => window.alert("Рано")}
        />
        <DataGrid
            dataSource={sites}
            keyExpr="_id"
            showColumnLines={false}
            showRowLines={false}
            allowColumnResizing={true}
            showBorders={false}
            rowAlternationEnabled={true}
            ref={(ref) => { gridRef = ref}}
            height={550}
            onRowUpdated={(e) => console.log(e)}
        >
        <Editing
            mode="form"
            allowUpdating={true}
            // allowAdding={true}
            // allowDeleting={true}
            
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
        </>
    )

}

export default SiteEdit
SiteEdit.defaultProps={
    items:[],
    sites:[],
}