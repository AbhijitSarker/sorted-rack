import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { isLoggedIn } from "../../service";
import { Footer, Header, Sidebar } from "../../component";
import SidebarContextProvider from "../../contexts/SidebarContext";
import { axiosSecure } from "../../api/axios";

const Layout = () => {
  const navigate = useNavigate();
  useEffect(() => {
        (async () => {
      try {
        await axiosSecure.get("/user", {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
          },
        });
      } catch (err) {
        err?.response?.status === 401 && navigate("/login", { replace: true });
      }
    })();

  }, []);

  return (
    <SidebarContextProvider>
      <main className="d-flex flex-nowrap">
        <Sidebar />
        <div className="w-100 overflow-auto main-wrapper min-vh-100 d-flex flex-column">
          <Header />
          <section style={{ minHeight: "85vh" }}>
            <Outlet />
          </section>
          {/* <Footer /> */}
        </div>
      </main>
    </SidebarContextProvider>
  );
};

export default Layout;
