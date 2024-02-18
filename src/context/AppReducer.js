/**
 * Reducer function to mutate App Context state
 * @param {any} state Current state
 * @param {any} action Reducer action type and payload
 * @returns New context state
 */
const AppContextReducer = (state, action) => {
  // console.log('AppContextReducer: action type......', action.type);
  // console.log('AppContextReducer: action payload...', action.payload);
  switch (action.type) {
    case 'THEME':
      return {
        ...state,
        themeIsDark: action.payload
      };
    case 'ROUTE':
      return {
        ...state,
        routePath: action.payload
      };
    case 'SEARCH':
      return {
        ...state,
        searchString: action.payload
      };
    default:
      throw new Error(`Reducer action type not defined: ${action.type}`);
  }
};

export default AppContextReducer;