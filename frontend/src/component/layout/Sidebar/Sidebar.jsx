import './Sidebar.scss'
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
import logoSmall from "../../../assests/images/site-logo.png";
const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: children ? label : <Link to={key}>{label}</Link>,
  };
}

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const userRole = userDetails ? userDetails.role : null;

  let items = [];

  if (userRole !== 'user') {
    items = [
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
  } else {
    items = [
      getItem('My Tickets', '/myTickets', <TeamOutlined />),
      getItem('Create Ticket', '/createTicket', <TeamOutlined />),
    ];
  }

  return (
    <Sider width={250} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
        <img
          src={collapsed ? logoSmall : logo}
          alt="Logo"
          className="logo"
        />
      </div>
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
