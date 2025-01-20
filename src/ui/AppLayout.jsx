import { Outlet, useLocation } from "react-router-dom";
import Map from "./Map";

const AppLayout = () => {
  const location = useLocation();
  //  routes that should not show the map
  const fullScreenRoutes = ['/app/carpoolDashboard', '/app/chat/'];
  // Check if the current route matches any full-screen routes
  const isFullScreen = fullScreenRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className={`md:w-${isFullScreen ? 'full' : '1/2  p-4'}`}>
        <Outlet /> {/* Renders child routes */}
      </div>

      {!isFullScreen && (
        <div className="md:w-1/2">
          <Map />
        </div>
      )}
    </div>
  );
};

export default AppLayout;

