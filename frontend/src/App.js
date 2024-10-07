import React from "react";
import { Routes, Route } from "react-router-dom";
import StockProvider from "./contexts/StockContext";
import {
  Layout,
  LoginForm,
  PageNotFound,
  Dashboard,
  AllTickets,
  Request,
  AddUser,
  ListUser,
  EditUser,
  ListStock,
  AddStock,
  EditSystemDetails,
} from "./Pages";

import AssignItem from "./Pages/AssignItems";
import MyTickets from "./Pages/MyTickets";
import CreateTicket from "./Pages/CreateTicket";
import TicketDetails from "./Pages/Ticket/TicketDeatils";

function App() {
  return (
    <StockProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="stock" element={<ListStock />} />
          <Route path="stock/add" element={<AddStock />} />
          <Route path="stock/edit/:id" element={<EditSystemDetails />} />
          <Route path="request" element={<Request />} />
          <Route path="user/add" element={<AddUser />} />
          <Route path="user" element={<ListUser />} />
          <Route path="user/edit/:id" element={<EditUser />} />
          <Route path="assigned/" element={<AssignItem />} />
          <Route path="tickets" element={<AllTickets />} />
          <Route path="myTickets/" element={<MyTickets />} />
          <Route path="ticket/:id" element={<TicketDetails />} />
          <Route path="createTicket/" element={<CreateTicket />} />
        </Route>

        <Route path="login" element={<LoginForm />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </StockProvider>
  );
}

export default App;
