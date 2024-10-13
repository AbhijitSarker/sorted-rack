import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { SidebarContext } from "../../../contexts/SidebarContext";
import logo from "../../../assests/images/sorted-rack-logo.svg";
import { FaHome, FaRegFileArchive, FaUserFriends } from "react-icons/fa";
import { FaChalkboardUser } from "react-icons/fa6";
import { MdImportantDevices, MdOutlineAddTask } from "react-icons/md";
import { GoTasklist } from "react-icons/go";

import "./Sidebar.scss";
import { getUserDetails } from "../../../service";
import { BiTask } from "react-icons/bi";

const Sidebar = () => {
  const { activeMenu, setActiveMenu } = useContext(SidebarContext);
  const user = getUserDetails()

  const allNavLinks = [
    {
      to: "/",
      icon: <FaHome />,
      label: "Dashboard"
    },
    {
      to: "/user",
      icon: <FaUserFriends />,
      label: "User"
    },
    {
      to: "/stock",
      icon: <MdImportantDevices />,
      label: "Stock"
    },
    {
      to: "/assigned",
      icon: <FaChalkboardUser />,
      label: "Assigned Devices"
    },
    {
      to: "/tickets",
      icon: <GoTasklist />,
      label: "All Tickets"
    },
    {
      to: "/myTickets",
      icon: <BiTask />,
      label: "My tickets"
    },
    {
      to: "/createTicket",
      icon: <MdOutlineAddTask />,
      label: "Create Ticket"
    },
    {
      to: "/archive",
      icon: <FaRegFileArchive />,
      label: "Ticket Archive"
    }

  ];

  // Filter nav links based on user role
 const navLinks =
 user.role === 'user'
   ? allNavLinks.filter(link =>
       link.label === 'My tickets' || link.label === 'Create Ticket')
   : allNavLinks;


  return (
    <div className={activeMenu ? "sidebar d-flex bg-dark hide" : "sidebar d-flex bg-dark"}>
      <div className="d-flex flex-column flex-shrink-0 px-3 text-white w-100">
        <a href="/" className="d-flex align-items-center pt-3 mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <img alt="Sorted Rack" src={logo} width="140px" />
        </a>

        <hr />

        <nav className="h-100vh">
          <ul className="nav nav-pills flex-column mb-auto">
            {navLinks.map((link, index) => (
              <li key={index} className='nav-item'>
                <NavLink
                  end={link.to === '/'}
                  to={link.to}
                  className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : undefined}`}
                >
                  {link.icon}
                  <span className="ms-2">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </div>
  );
};

export default Sidebar;
