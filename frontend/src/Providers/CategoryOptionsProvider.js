import { createContext, useContext, useReducer } from 'react';

const CateforOptionsContext = createContext(null);

const CateforOptionsDispatchContext = createContext(null);

export function CategoryOptionsProvider({ children }) {
  const [categoryOptions, dispatch] = useReducer(
    categoryOptionsReducer,
    initialOptions
  );

  return (
    <CateforOptionsContext.Provider value={categoryOptions}>
      <CateforOptionsDispatchContext.Provider value={dispatch}>
        {children}
      </CateforOptionsDispatchContext.Provider>
    </CateforOptionsContext.Provider>
  );
}

export function useCategoryOptions() {
  return useContext(CateforOptionsContext);
}

export function useCategoryOptionsDispatch() {
  return useContext(CateforOptionsDispatchContext);
}

function categoryOptionsReducer(categories, action) {
    switch (action.type) {
    case 'added': {
        const categoryData = Object.fromEntries(action.properties.map(el => [el,""]))
        for (let prop in action.values) {
            if(categoryData[prop] !== undefined) {
                categoryData[prop] = new Set([action.values[prop]])
            }
        }
        categories[action.name] = categoryData
        return categories
    }
    case 'updated': {
        categories[action.name][action.field].add(action.value)
        return categories
    }
    default: {
        throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialOptions = {};
