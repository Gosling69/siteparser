import useFetch from "../../hooks/useFetch"
import NavBar from "../../Components/Toolbars/NavBar"
import PriceCompareTable from "../../Components/Tables/PriceCompareTable"
import useFilteredData from "../../hooks/useFilteredData"
import { unpackLinkedItems } from "../../helpers/processDataFuncs"

const PriceCompareTableView = () => {
    const {
        data:ourItems, 
        error:ourItemsError, 
        loading:ourItemsLoading, 
        refetch:refreshOurItems
    } = useFetch("/get_our_items", "GET", {}, true, unpackLinkedItems)

    const {
        data:categories, 
        error:categoriesError, 
        loading:categoriesLoading, 
        refetch:refreshCategories
    } = useFetch("/get_categories", "GET", {}, true)


    return(
        <>
        <NavBar categories={categories}/>
        <PriceCompareTable data={useFilteredData(ourItems)}/>
        </>
    )
}
export default PriceCompareTableView