import React, { createContext, useReducer } from 'react';

const initialState = {
    loggedIn: false,
  };
  const authContext = createContext(initialState);
  const { Provider } = authContext;
  
  const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer((state, action) => {
      switch (action.type) {
        case "LOG_IN":
          return { ...state, loggedIn: true };
        case "LOG_OUT":
          return { ...state, loggedIn: false };
        default:
          return state;
      }
    }, initialState);
  
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
  };
  
  export { authContext, AuthProvider };