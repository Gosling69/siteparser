const CategoryValuesCell = ({data}) => {
    const strVal = Object.entries(data.category?.values ?? {})
    .reduce((prev, [currProp, currVal]) => prev+= `${currProp} : ${currVal};\t` , "")
    return(
        <>
        {
            strVal.slice(0, strVal.length - 2)
        }
        </>
    )
}
export default CategoryValuesCell