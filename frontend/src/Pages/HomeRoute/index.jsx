import React from 'react';
import Dashboard from '../Dashboard';
import MyTickets from '../Ticket/MyTickets';

const HomeRoute = () => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const userRole = userDetails ? userDetails.role : null;

  if (userRole === 'admin' || userRole === 'superadmin') {
    return <Dashboard/>;
  } else {
    return <MyTickets />;
  }
};

export default HomeRoute;