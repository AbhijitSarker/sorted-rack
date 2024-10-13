import React, { useState } from 'react';
import { Layout as AntLayout, theme } from 'antd';
import { Outlet } from "react-router-dom";

import {Header, Sidebar } from "../../component";

const { Content, Footer } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <AntLayout>
        <Header />
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              margin: '16px 0',
              overflowX: 'auto'
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Your Company Name ©{new Date().getFullYear()} Created by Your Team
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;