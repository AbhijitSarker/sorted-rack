import React from "react";
import { Routes, Route } from "react-router-dom";
import StockProvider from "./contexts/StockContext";
import {
  Layout,
  LoginForm,
  PageNotFound,
  Dashboard,
  Request,
  AddUser,
  ListUser,
  EditUser,
  ListStock,
  AddStock,
  EditSystemDetails,
} from "./Pages";

import AssignItem from "./Pages/AssignItems";
import CreateTicket from "./Pages/Ticket/CreateTicket";
import TicketDetails from "./Pages/Ticket/TicketDeatils";
import HomeRoute from "./Pages/HomeRoute";
import MyTickets from "./Pages/Ticket/MyTickets";
import AllTickets from "./Pages/Ticket/AllTickets";
import Archive from "./Pages/Ticket/Archive";

function App() {
  return (
    <StockProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeRoute />} />
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="stock" element={<ListStock />} />
          <Route path="stock/add" element={<AddStock />} />
          <Route path="stock/edit/:id" element={<EditSystemDetails />} />
          <Route path="request" element={<Request />} />
          <Route path="user/add" element={<AddUser />} />
          <Route path="user" element={<ListUser />} />
          <Route path="user/edit/:id" element={<EditUser />} />
          <Route path="assigned/" element={<AssignItem />} />
          <Route path="tickets" element={<AllTickets />} />
          <Route path="myTickets" element={<MyTickets />} />
          <Route path="ticket/:id" element={<TicketDetails />} />
          <Route path="createTicket" element={<CreateTicket />} />
          <Route path="archive" element={<Archive />} />

        </Route>

        <Route path="login" element={<LoginForm />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </StockProvider>
  );
}

export default App;
