import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../service";
import { SidebarContext } from "../../../contexts/SidebarContext";
import { IoMenu } from "react-icons/io5";
// import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const { activeMenu, setActiveMenu } = useContext(SidebarContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login", { replace: true });
    logout();
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark sticky-top" aria-label="Second navbar example">
        <div className="container-fluid">
          <IoMenu
            className="burger-menu"
            onClick={() => setActiveMenu(!activeMenu)}
          />
          <div className="collapse navbar-collapse" id="navbarsExample02">
            <form role="search" className="ms-auto pe-2">
              {/* <input className="form-control" type="search" placeholder="Search" aria-label="Search" /> */}
            </form>
            <button onClick={handleLogout} type="button" className="btn btn-outline-light">
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
