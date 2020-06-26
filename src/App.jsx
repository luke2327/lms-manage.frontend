import React, { useState, createContext } from 'react';
import AppLayout from './app/layout/containers/layout.jsx';

import coreService from './services/core';

import './styles/app.module.less';

/** set context member */
let errMessage, setErrMessage;
let currentTableKey, setCurrentTableKey;

/** create context */
export const ErrorContext = createContext();
export const TableContext = createContext();

export const receiveErrMessage = (msg) => {
  setErrMessage(msg);
};

const App = () => {
  /** get stored table key */
  const currentTaskTableKey = coreService.getLocalStorage('currentTaskTable');

  [errMessage, setErrMessage] = useState();
  [currentTableKey, setCurrentTableKey] = useState(currentTaskTableKey || '');

  return (
    <div className="App">
      <ErrorContext.Provider value={[errMessage, setErrMessage]}>
        <TableContext.Provider value={[currentTableKey, setCurrentTableKey]}>
          <AppLayout context={[currentTableKey]} />
        </TableContext.Provider>
      </ErrorContext.Provider>
    </div>
  );
};

export default App;
