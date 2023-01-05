import { useLocation, Navigate, Outlet } from "react-router-dom";
import SidebarContextProvider from "../../contexts/SidebarContext";
import { isLoggedIn, getUserDetails } from "../../service";
import { Footer, Header, Sidebar } from "../../component";

const Layout = () => {
  const location = useLocation();
  const { role } = getUserDetails();
  return isLoggedIn() ? (
    role === "superadmin" ? (
      <SidebarContextProvider>
        <main className="d-flex flex-nowrap">
          <Sidebar />
          <div className="w-100 overflow-auto main-wrapper min-vh-100 d-flex flex-column">
            <Header />
            <section>
              <Outlet />
            </section>
            <Footer />
          </div>
        </main>
      </SidebarContextProvider>
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default Layout;
