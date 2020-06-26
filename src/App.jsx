import React, { useState, createContext } from 'react';
import AppLayout from './app/layout/containers/layout.jsx';

import './styles/app.module.less';

let errMessage, setErrMessage;

export const ErrorObject = createContext();

export const receiveErrMessage = (msg) => {
  setErrMessage(msg);
};

const App = () => {
  [errMessage, setErrMessage] = useState();

  return (
    <div className="App">
      <ErrorObject.Provider value={[errMessage, setErrMessage]}>
        <AppLayout />
      </ErrorObject.Provider>
    </div>
  );
};

export default App;
