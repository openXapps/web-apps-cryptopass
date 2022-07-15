import { createContext, useReducer } from 'react';

import AppContextReducer from '../reducers/AppContextReducer';
import { initialUse } from '../helpers/initializer';
import { getSettings } from '../helpers/localstorage';

// https://reactjs.org/docs/context.html

/**
 * Initial state
 * Loads default password data on first use
 */
initialUse();

/**
 * Setting default application context
 */
const contextData = {
  theme: getSettings().data.theme,
};

/**
 * Create application context object
 */
export const AppContext = createContext(contextData);

/**
 * Wrap application context around main app
 * @param {any} props Children components
 * @returns Wrapped component
 */
function AppStore(props) {
  const [appState, appDispatch] = useReducer(AppContextReducer, contextData);
  return (
    <AppContext.Provider value={[appState, appDispatch]}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppStore;