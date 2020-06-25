import React, { Component } from "react";
import { Layout, Typography, Menu } from "antd";

const { Header } = Layout;

const AppHeader = ({ nav, setNav }) => {
  // console.log(nav);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#001529",
      }}
    >
      <Typography.Text
        style={{ color: "#fff", paddingLeft: 20, paddingRight: 20 }}
      >
        LMS
      </Typography.Text>
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={[nav]}
        onClick={(e) => {
          setNav(e.key);
        }}
        inlineIndent={10}
      >
        <Menu.Item key="task" style={{ backgroundColor: "transparent" }}>
          미해결 과제 목록
        </Menu.Item>
        <Menu.Item
          key="resolvedTask"
          style={{ backgroundColor: "transparent" }}
        >
          제출한 과제 목록
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AppHeader;
