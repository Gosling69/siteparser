import { useState, useRef, useEffect } from "react";
import ApiService from "../../Api/api";
import EditDeleteIcons from "../Icons/EditDeleteIcons";
import CommonToolbar from "../Toolbars/CommonToolbar";
import PropertiesTagbox from "../EditRenders/PropertiesTagbox";

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
const CategoriesTable = ({categories, refresh}) => {

    const cellTemplate =(container, options) => {
        const noBreakSpace = '\u00A0';
        const text = (options.data.properties || [])
        // .map(el => `${el?.name} (${el?.site?.name})`)
        .join(', ')
        container.textContent = text || noBreakSpace;
        container.title = text;
    }

    let gridRef = useRef(null);

   
    return (
        <>
        <CommonToolbar
            addRow={() => gridRef.instance.addRow()}
            importFromXlsx={ApiService.importItems}
            refresh={refresh}
            type="category"
        />
        <DataGrid
            dataSource={categories}
            keyExpr="_id"
            showColumnLines={false}
            allowColumnResizing={true}
            showRowLines={false}
            showBorders={false}
            rowAlternationEnabled={true}
            height={550}
            ref={(ref) => { gridRef = ref}}
            onRowUpdated={(e) => ApiService.updateCategory(e.data).then(() => refresh())}
            onRowRemoved={(e) => ApiService.deleteCategory(e.key.$oid).then((res) =>{window.alert(res);refresh()})}
            onRowInserted={(e) => ApiService.addCategory(e.data).then(() => refresh())}
        >
        <Editing
            mode="popup"
            // allowUpdating={true}
            // allowDeleting={true}
            // useIcons={true}
        >
        <Popup title="Item Info" showTitle={true} width={700} height={400} />
        <Form>
            <Item itemType="group" colCount={1} colSpan={2}>
                    <Item dataField="name" />
                    <Item dataField="properties" />
            </Item>
        </Form>
        </Editing>
        <Column dataField="name" />        

        <Column
            dataField="properties"
            caption="properties"
            width={600}
            allowSorting={false}
            editCellComponent={PropertiesTagbox}
            cellTemplate={cellTemplate}
        >
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
export default CategoriesTable
CategoriesTable.defaultProps = {
    categories:[],
}