import { createContext } from 'react';

import { defaultAppContext } from '../config/DefaultContext';

// https://reactjs.org/docs/context.html

export const AppContext = createContext(defaultAppContext);

function AppStore() {

  return (
    <AppContext.Provider value={""}>

    </AppContext.Provider>
  );
}

export default AppStore;