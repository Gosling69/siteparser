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
import LinkedItemsTagbox from "../EditRenders/LinkedItemsTagbox";
import ApiService from "../../Api/api";
import CommonToolbar from "../Toolbars/CommonToolbar";
import LinkCell from "../CellRenders/LinkCell";
import EditDeleteIcons from "../Icons/EditDeleteIcons";
import CategoriesSelect from "../EditRenders/CategoriesSelect";
import CategoryCell from "../CellRenders/CategoryCell";
import CategoryValuesCell from "../CellRenders/CategoryValuesCell";

const OurItemEdit = ({ourItems, items, categories, refresh}) => {

    const cellTemplate =(container, options) => {
        const noBreakSpace = '\u00A0';
        const text = (options.data.linked_items || [])
        .map(el => `${el?.name} (${el?.site?.name})`)
        .join(', ')
        container.textContent = text || noBreakSpace;
        container.title = text;
    }

    let gridRef = useRef(null);


    return(
        <>
        <CommonToolbar
            addRow={() => gridRef.instance.addRow()}
            importFromXlsx={ApiService.importOurItems}
            refresh={refresh}
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
            onRowUpdated={(e) =>  ApiService.updateOurItem(e.data).then(() => refresh())}
            onRowRemoved={(e) => ApiService.deleteOurItem(e.key.$oid).then((res) =>{window.alert(res);refresh()})}
            onRowInserted={(e) => ApiService.addOurItem(e.data).then(() => refresh())}
        >
        <Editing
            mode="popup"
            // allowUpdating={true}
            // useIcons={true}
        >
        <Popup title="Our Item Info"  showTitle={true} width={800} height={500} />
        <Form>
            <Item itemType="group" colCount={1} colSpan={2}>
                <Item dataField="name" />
                <Item dataField="last_price"/>
                <Item dataField="item_link" />
                <Item dataField="linked_items_ids" />
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
        <Column dataField="item_link" сellRender={data => <LinkCell data={data}/>}/>
        <Column dataField="last_price"/>
        {/* <Column dataField="disable_parsing"/> */}

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
              dataSource={items}
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