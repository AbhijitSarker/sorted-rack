import React from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assests/images/sorted-rack-logo.svg";
const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: children ? label : <Link to={key}>{label}</Link>,
  };
}

const items = [
  getItem('Dashboard', '/', <PieChartOutlined />),
  getItem('Inventory Management', 'sub3', <DesktopOutlined />, [
    getItem('Stock', '/stock'),
    getItem('Add stock', '/stock/add'),
    getItem('Assigned Devices', '/assigned'),
  ]),
  getItem('User Management', 'sub1', <UserOutlined />, [
    getItem('All Users', '/user'),
    getItem('Add User', '/user/add'),
  ]),
  getItem('Tickets', 'sub2', <TeamOutlined />, [
    getItem('All Tickets', '/tickets'),
    getItem('My Tickets', '/myTickets'),
    getItem('Create Ticket', '/createTicket'),
  ]),
  getItem('Archive', '/archive', <FileOutlined />),
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <img src={logo} className="demo-logo-vertical" style={{
        height: '32px',
        margin: '16px',
        background: 'rgba(255, 255, 255, 0.2)',
      }} />
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;