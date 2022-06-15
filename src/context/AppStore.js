import { createContext, useReducer } from 'react';

import AppContextReducer from '../reducers/AppContextReducer';
import { getDefaultData } from '../config/DefaultAppData';
import { initialUse } from '../helpers/initializer';

// https://reactjs.org/docs/context.html

/**
 * Initial state
 * Loads default password data on first use
 */
initialUse();

const contextData = {
  theme: getDefaultData().settings.theme,
};

export const AppContext = createContext(contextData);

function AppStore(props) {
  const [appState, appDispatch] = useReducer(AppContextReducer, contextData);
  return (
    <AppContext.Provider value={[appState, appDispatch]}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppStore;