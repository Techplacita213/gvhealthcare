import React, { createContext, useReducer } from 'react';

const initialState = {};
  const bookContext = createContext(initialState);
  const { Provider } = bookContext;
  
  const BookProvider = ({ children }) => {

    const [book, dispatch] = useReducer((book, action) => {
        
      switch (action.type) {
        case "SET":
          return { ...book, ...action.payload };
        default:
          return book;
      }
    }, initialState);
    return <Provider value={{ book, dispatch }}>{children}</Provider>;
  };
  
  export { bookContext, BookProvider };