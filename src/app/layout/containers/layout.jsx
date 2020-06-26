import React, { useState, useContext } from 'react';
import { Layout } from 'antd';
import AppHeader from './header';
import LMSList from '../../lms/containers/list.jsx';
import ResolvedLMSList from '../../lms/containers/resolvedList.jsx';

const AppLayout = () => {
  const [selectedNav, setSelectedNav] = useState('task');

  return (
    <Layout>
      <AppHeader nav={selectedNav} setNav={setSelectedNav} />
      <div style={{ padding: 25 }}>
        {selectedNav === 'task' ? <LMSList /> : <ResolvedLMSList />}
      </div>
    </Layout>
  );
};

export default AppLayout;
