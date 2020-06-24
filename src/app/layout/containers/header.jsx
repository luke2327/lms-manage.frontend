import React, { Component } from "react";
import { Layout, Typography } from "antd";

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header>
      <Typography style={{ color: '#fff' }}>LMS</Typography>
    </Header>
  );
};

export default AppHeader;
