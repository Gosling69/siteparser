import UilEdit from '@iconscout/react-unicons/icons/uil-edit'
import UilTrash from '@iconscout/react-unicons/icons/uil-trash'

const EditDeleteIcons = (props) => {
    return(
        <>
          <UilEdit
                className="clickIcon"
                style={{marginRight:"10px"}}
                size="24" 
                color="#6F7888"
                onClick={() =>  props.editRow(props.data.rowIndex)}
            />
            {/* <UilTrash
                className="clickIcon"
                size="24" 
                color="#6F7888"
                onClick={() =>  props.deleteRow(props.data.rowIndex)}
            /> */}
        </>
    )
}
export default EditDeleteIcons
EditDeleteIcons.defaultProps = {
    data:{},
    editRow: () => console.log("no edit"),
    deleteRow: () => console.log("no delete")
}