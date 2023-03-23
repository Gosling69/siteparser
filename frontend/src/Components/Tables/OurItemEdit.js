import { useState, useEffect, useRef } from "react"
import DataGrid, {
    Column,
    Popup,
    Item,
    Form,
    Editing,
    Button,
    Lookup,
  } from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import LinkedItemsTagbox from "../LinkedItemsTagbox";
import ApiService from "../../Api/api";
import CommonToolbar from "../Toolbars/CommonToolbar";
import LinkCell from "../CellRenders/LinkCell";
import EditDeleteIcons from "../EditDeleteIcons";

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
    let gridRef = useRef(null);

    useEffect(() =>{
        setOurItems(props.ourItems)
    },[props.ourItems])


    return(
        <>
        <CommonToolbar
            addRow={() => gridRef.instance.addRow()}
            importFromXlsx={ApiService.importOurItems}
            refresh={props.refresh}
            type="ouritem"
        />
        <DataGrid
            dataSource={ourItems}
            keyExpr="_id"
            showColumnLines={false}
            showRowLines={false}
            showBorders={false}
            allowColumnResizing={true}
            rowAlternationEnabled={true}
            height={550}
            ref={(ref) => { gridRef = ref}}
            onRowUpdated={(e) =>  ApiService.updateOurItem(e.data).then(() => props.refresh())}
            onRowRemoved={(e) => ApiService.deleteOurItem(e.key.$oid).then((res) =>{window.alert(res);props.refresh()})}
            onRowInserted={(e) => ApiService.addOurItem(e.data).then(() => props.refresh())}
        >
         <Editing
            mode="popup"
            // allowUpdating={true}
            // useIcons={true}
        >
        <Popup title="Our Item Info"  showTitle={true} width={800} height={400} />
        <Form>
            <Item itemType="group" colCount={1} colSpan={2}>
                <Item dataField="name" />
                <Item dataField="item_link" />
                <Item dataField="linked_items_ids" />
            </Item>
         
        </Form>
        </Editing>
        <Column dataField="name" />
        <Column dataField="item_link" сellRender={data => <LinkCell data={data}/>}/>
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
        {/* <Scrolling mode="virtual"  rowRenderingMode="virtual"  /> */}
        </DataGrid>
        </>
    )

}

export default OurItemEdit
OurItemEdit.defaultProps={
    ourItems:[],
    items:[],
    sites:[],
}