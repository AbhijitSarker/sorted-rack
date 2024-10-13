import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, theme } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from "../../../service";
import { SidebarContext } from "../../../contexts/SidebarContext";

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    navigate("/login", { replace: true });
    logout();
  };

  return (
    <AntHeader style={{ padding: 0, background: colorBgContainer }}>
      <Button
        onClick={handleLogout}
        icon={<LogoutOutlined />}
        style={{ float: 'right', margin: '16px 24px' }}
      >
        Logout
      </Button>
    </AntHeader>
  );
};

export default Header;