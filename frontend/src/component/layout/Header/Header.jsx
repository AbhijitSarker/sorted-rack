import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../service";
import { SidebarContext } from "../../../contexts/SidebarContext";
import BranchContext  from "../../../contexts/BranchContext";
import { IoMenu } from "react-icons/io5";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Accordion } from "react-bootstrap";
import locations from "../../../constants/Locations.json";


const Header = () => {

  const userDetails = localStorage.userDetails ? JSON.parse(localStorage.userDetails) : null;
  const isSuperAdmin = userDetails.role === "superadmin";
  const userLocation = userDetails ? userDetails.branch : null;
  const { activeMenu, setActiveMenu } = useContext(SidebarContext);
  const { branch, setBranch } = useContext(BranchContext);
  const selectedLocation = useRef(isSuperAdmin ? "All" : userLocation);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login", { replace: true });
    logout();
  };

  function handleLocationChange(branchName) {
    selectedLocation.current = branchName;
    setBranch(branchName);
  }


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
            {
              isSuperAdmin && (
                <Dropdown className="mx-3">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {branch}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                      locations.length > 0 && 
                      locations.map(({ id, branchName}) => {
                       return (
                          <Dropdown.Item 
                            key={id} 
                            onClick={() => handleLocationChange(branchName)}
                          >
                              {branchName}
                          </Dropdown.Item>
                        )
                      })
                    }
                </Dropdown.Menu>
            </Dropdown>

              )
            }

            {
              !isSuperAdmin && (<label className="mx-5 text-white">{userLocation}</label>)
            }

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
