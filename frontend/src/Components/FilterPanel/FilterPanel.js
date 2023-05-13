import { Offcanvas, Button, CloseButton, FormControl, Row, Col, FormSelect } from "react-bootstrap"
import { useEffect, useState } from "react"
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import { cloneDeep, uniqueId,  } from "lodash";
import { useFilterDispatch, useFilters } from "../../Providers/FilterProvider";
import { useCategoryOptions } from "../../Providers/CategoryOptionsProvider";

const FilterPanel = ({show, handleClose, categories}) => {

    function FilterInput({entry,prop}) {
        const dispatch = useFilterDispatch();    
        const categoryOptions = useCategoryOptions() 
        const options = Array.from(categoryOptions[entry.category.name]?.[prop] ?? [])
        return (
            <FormSelect 
                defaultValue={entry.category.values?.[prop] ?? ""}
                onChange={(e) => {
                    // if (!e.target.value) return
                    dispatch({
                        type: 'changed',
                        id: entry.id,
                        category: {
                        ...entry.category,
                        values: {...entry.category.values, [prop]:e.target.value} 
                        }
                    })
                }}
            >
            <option value="">{`${prop}...`}</option>
            {
                options.map(val =>
                    <option key={val} value={val}>{val}</option>

                )
            }
            </FormSelect>
        )
    }

    function Filter({ entry }) {
        const dispatch = useFilterDispatch();      
        return (
            <>
            <h4>
                {entry.category.name}
                <CloseButton
                    onClick={() =>
                        dispatch({
                            type: 'deleted',
                            id: entry.id
                        })
                    }
                />
            </h4>
            {entry.category.properties.map(prop =>
                <FilterInput key={prop} entry={entry} prop={prop}/>
            )}
            </>
        
    )}
    
    const FilterList = () => {
        const filters = useFilters();
        return (
            <>
            {filters.map(filter => 
                <Filter key={filter.id} entry={filter} />
            )}
            </>
        );
    }

    function AddFilter() {
        const [categoryId, setCategoryId] = useState('');
        const dispatch = useFilterDispatch();
        return (
            <Row>
                <Col xs={1}>
                    <Button 
                    disabled={!categoryId}
                    onClick={() => {
                    setCategoryId('');
                    dispatch({
                        type: 'added',
                        id: uniqueId(),
                        category: {...categories.find(el => el._id.$oid ===  categoryId), values:{}},
                    }); 
                }}>+</Button>
                </Col>
            <Col>
            <SelectBox
                className='mb-3'
                items={categories}
                displayExpr="name"
                valueExpr="_id.$oid"
                onValueChanged={(e) => setCategoryId(e.value)}
            />
            </Col>
            </Row>
        );
    }

    return (
        <>
        <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Фильтры</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <AddFilter/>
            <FilterList/>
        </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}

export default FilterPanel
FilterPanel.defaultProps = {
    categories:[],
}