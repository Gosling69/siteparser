import { useState, useEffect } from "react"
import DataGrid, {
    Column,
    FormItem,
    Editing,
    Scrolling,
    Lookup,
  } from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import LinkedItemsTagbox from "./LinkedItemsTagbox";
import ApiService from "../Api/api";
  

const OurItemEdit = (props) => {

    const cellTemplate =(container, options) => {
        const noBreakSpace = '\u00A0';
        const text = (options.data.linked_items || [])
        .map(el => `${el?.name} (${el?.site?.name})`)
        .join(', ')
        container.textContent = text || noBreakSpace;
        container.title = text;
      }


    const [ourItems,setOurItems] = useState(props.ourItems)
    // const [sites, setSites] = useState(props.sites)

    useEffect(() =>{
        setOurItems(props.ourItems)
    },[props.ourItems])

    const notesEditorOptions = { height: 100 };

    return(
        <DataGrid
            dataSource={ourItems}
            keyExpr="_id"
            showBorders={true}
            height={600}
            onRowUpdated={(e) =>  ApiService.updateOurItem(e.data).then(() => props.refresh())}
            onRowRemoved={(e) => console.log(e)}
            onRowInserted={(e) => ApiService.addOurItem(e.data).then(() => props.refresh())}
        >
        <Editing
            mode="form"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
        />
        <Column dataField="name" />
        <Column dataField="item_link"/>
        <Column
            dataField="linked_items_ids"
            caption="Linked Items"
            width={600}
            allowSorting={false}
            editCellComponent={LinkedItemsTagbox}
            cellTemplate={cellTemplate}

            // cellTemplate={this.cellTemplate}
            // calculateFilterExpression={this.calculateFilterExpression}
        >
            <Lookup
              dataSource={props.items}
            //   valueExpr="_id.$oid"
            //   displayExpr="name"
            />
            {/* <RequiredRule /> */}
          </Column>
        <Scrolling mode="virtual" />
            <FormItem colSpan={2} editorType="dxTextArea" editorOptions={notesEditorOptions} />
        </DataGrid>
    )

}

export default OurItemEdit
OurItemEdit.defaultProps={
    ourItems:[],
    items:[],
    sites:[],
}