import { useLocation, Navigate, Outlet } from "react-router-dom";
import SidebarContextProvider from "../../contexts/SidebarContext";
import { isLoggedIn } from "../../service";
import { Footer, Header, Sidebar } from "../../component";

const Layout = () => {
  const location = useLocation();
  return isLoggedIn() ? (
      <SidebarContextProvider>
        <main className="d-flex flex-nowrap">
          <Sidebar />
          <div className="w-100 overflow-auto main-wrapper min-vh-100 d-flex flex-column">
            <Header />
            <section style={{ minHeight: "85vh" }}>
              <Outlet />
            </section>
            <Footer />
          </div>
        </main>
      </SidebarContextProvider>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default Layout;
