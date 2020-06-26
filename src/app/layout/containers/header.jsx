import React from 'react';
import { Typography, Menu, Tooltip } from 'antd';

const AppHeader = ({ nav, setNav, context }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#001529',
      }}
    >
      <Typography.Text
        style={{ color: '#fff', paddingLeft: 20, paddingRight: 20 }}
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
        <Menu.Item key="task" style={{ backgroundColor: 'transparent' }}>
          미해결 과제 목록
        </Menu.Item>
        {
          context
            ? (
              <Menu.Item
                key="resolvedTask"
                style={{ backgroundColor: 'transparent' }}
              >
                제출한 과제 목록
              </Menu.Item>
            ) : (
              <Menu.Item
                key="resolvedTask"
                style={{ backgroundColor: 'transparent' }}
                disabled={true}
              >
                <Tooltip placement="bottom" title="데이터가 없습니다. 새로운 데이터를 생성한 후 저장해 주세요.">
                  제출한 과제 목록
                </Tooltip>
              </Menu.Item>
            )
        }
      </Menu>
    </div>
  );
};

export default AppHeader;
