import React, { useState, useContext } from 'react';
import { Layout } from 'antd';
import AppHeader from './header';
import LMSList from '../../lms/containers/list.jsx';
import ResolvedLMSList from '../../lms/containers/resolvedList.jsx';

const AppLayout = ({ context }) => {
  const [selectedNav, setSelectedNav] = useState('task');
  const [currentTableKey] = context;


  return (
    <Layout>
      <AppHeader nav={selectedNav} setNav={setSelectedNav} context={currentTableKey} />
      <div style={{ padding: 25 }}>
        {selectedNav === 'task' ? <LMSList /> : <ResolvedLMSList />}
      </div>
    </Layout>
  );
};

export default AppLayout;
