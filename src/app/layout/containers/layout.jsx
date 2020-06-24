import React, { Component } from "react";
import { Layout } from "antd";
import AppHeader from "./header";
import LMSList from "app/lms/containers/list.jsx";

const AppLayout = () => {
  return (
    <Layout>
      <AppHeader />
      <div style={{ padding: 25 }}>
        <LMSList />
      </div>
    </Layout>
  );
};

export default AppLayout;
