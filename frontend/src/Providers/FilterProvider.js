import { createContext, useContext, useReducer } from 'react';

const FilterContext = createContext(null);

const FilterDispatchContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, dispatch] = useReducer(
    filterReducer,
    initialFilter
  );

  return (
    <FilterContext.Provider value={filters}>
      <FilterDispatchContext.Provider value={dispatch}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}

export function useFilterDispatch() {
  return useContext(FilterDispatchContext);
}

function filterReducer(filters, action) {
    // console.log(filters)
    // console.log(action)
  switch (action.type) {
    case 'added': {
      return [...filters, {
        id: action.id,
        category: action.category,
      }];
    }
    case 'changed': {
      return filters.map(t => {
        if (t.id === action.id) {
          return {id : action.id, category: action.category};
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return filters.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialFilter = [];
