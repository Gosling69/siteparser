
import { DataGrid, Column } from 'devextreme-react/data-grid';

const DetailComponent = (props) => {

    console.log(props.data.data.data)
    return(
        <>
            <div className="master-detail-caption">
                {`Данные`}
            </div>
            <DataGrid
                dataSource={props.data.data.data}
                showBorders={true}
                columnAutoWidth={true}
            >
            <Column dataField="price" />
            <Column dataField="quantity"  />
            <Column dataField="date_time.$date" dataType="datetime" />
            </DataGrid>
        </>
    )
}

export default DetailComponent