import React, { useState } from 'react';
import { Layout as AntLayout, theme } from 'antd';
import { Outlet } from "react-router-dom";

import {Footer, Header, Sidebar } from "../../component";

const { Content } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <AntLayout>
        <Content style={{ margin: '0 16px', overflow: 'auto' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              margin: '16px 0',
            }}
          >
            <Header />
            <Outlet />
          </div>
        </Content>
        {/* <Footer></Footer> */}
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;