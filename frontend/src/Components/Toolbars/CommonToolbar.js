
import { useRef, useState } from "react"
import {Row, Col, Button} from "react-bootstrap"
import ApiService from "../../Api/api"
import UilRefresh from '@iconscout/react-unicons/icons/uil-refresh'
import UilExport from '@iconscout/react-unicons/icons/uil-export'
import UilPlus from '@iconscout/react-unicons/icons/uil-plus'

import readXlsxFile from 'read-excel-file'
import UploadModal from "../Modals/UploadModal"

const CommonToolbar = (props) => {

    const [showModal, setShowModal] = useState(false)
    const [uploadData,setUploadData] = useState([])
    const fileInputRef = useRef()

    const ButtonStyle = {
        backgroundColor:"white",
        color:"black",
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.25)",
        border:"none",
        minWidth:"200px"
    }
    const IconStyle = {
        marginLeft:"20px"
    }


    const initDefaultSites = async () => {
        await ApiService.initStandartSites()
        props.refresh()
    }

    const importFromXlsx = async (event) => {
        let file = event.target.files[0]
        if (!file.name.endsWith(".xlsx")) {
            window.alert("Не экселька")
            return
        }
        let rows = await readXlsxFile(file)
        let data = rows.map(([itemName, link]) => {
            return {
                name:itemName,
                item_link:link
            }
        })
        setUploadData(data)
        setShowModal(true)
        event.target.value = ''
    }

    const clearData = () => {
        setShowModal(false)
        setUploadData([])
    }

    const importFunc = async() => {

        // let res = await props.importFromXlsx(uploadData)
        // await props.refresh()
        // setShowModal(false);
        props.importFromXlsx(uploadData)
        .then(async (res) => {
            await props.refresh()
            setShowModal(false);
        })

    }

    return(
        <>
        <UploadModal
            show={showModal}
            uploadData={uploadData}
            setShow={setShowModal}
            data={uploadData}
            clearData={clearData}
            type={props.type}
            importFromXlsx={importFunc}
        />
        <Row className="mt-3 mb-3">
            <Col  xs={2}>
                <Button
                    style={ButtonStyle}
                    onClick={ApiService.runUpdate}
                >
                    Run Update
                    <UilRefresh
                        style={IconStyle}
                        // className="mx-4"
                        size="25" 
                        color="#6F7888"
                    />
                </Button>
            </Col>
            <Col className="d-flex justify-content-end">
                {props.type === "site" ?
                    <Button
                        style={ButtonStyle}
                        onClick={() => window.confirm("Выгрузить стандартные сайты?") ? initDefaultSites(): null}
                    >
                        Init Default
                        <UilExport
                            // className="mx-4"
                            style={IconStyle}
                            size="25" 
                            color="#6F7888"
                        />
                    </Button>
                    :
                    <Button
                        style={ButtonStyle}
                        onClick={() =>fileInputRef.current.click()}
                    >
                    <input onChange={importFromXlsx} multiple={false} ref={fileInputRef} type='file' hidden/>
                        Import XLSX
                        <UilExport
                            // className="mx-4"
                            style={IconStyle}
                            size="25" 
                            color="#6F7888"
                        />
                    </Button>
                }
            </Col>
            <Col xs={2} className="d-flex justify-content-end" >
                <Button
                    style={ButtonStyle}
                    onClick={() =>props.addRow()}
                >
                    Add new Item
                    <UilPlus
                        // className="mx-4"
                        style={IconStyle}
                        size="25" 
                        color="#F3D223"
                    />
                </Button>
            </Col>
        </Row>
        </>
    )
    
} 
export default CommonToolbar
CommonToolbar.defaultProps = {
    addRow: () => console.log("NO FUNC TO ADD PASSED AS PROPS"),
    type:"item",
    refresh:() => console.log("NO REFRESH FUNC")
}
