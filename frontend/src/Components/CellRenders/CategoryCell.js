const CategoryCell = ({data}) => {
    return(
        <>{data.category?.name ?? ""}</>
    )
}
export default CategoryCell