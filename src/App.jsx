import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react";
import Loader from "./ui/Loader";
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import RateRideForm from './components/rider/RateRideForm';

// Lazy-loaded components
const AppLayout = lazy(() => import("./ui/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound")); 
const HomePage = lazy(() => import("./pages/HomePage"));
const Faqs = lazy(() => import("./Footer Pages/Faqs"));
const TermsAndConditions = lazy(() => import("./Footer Pages/TermsAndConditions"));
const ContactUs = lazy(() => import("./Footer Pages/ContactUs"));
const AboutUs = lazy(() => import("./Footer Pages/AboutUs"));
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const NotificationsPage = lazy(() => import("./pages/Notifications/NotificationsPage"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App Component
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

// Separate component for routes to use auth context
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" replace />} />

          {/* Protected routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Notification routes */}
          <Route
            path="/:mode/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />

          {/* Add this route if needed: */}
          <Route 
            path="/:mode/dashboard/notifications" 
            element={
              <ProtectedRoute>
                <Dashboard initialTab="notifications" />
              </ProtectedRoute>
            } 
          />

          {/* New route for rating */}
          <Route path="/rider/rate/:rideId" element={<RateRideForm />} />

          {/* Fallback route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

// user feedback (for app) , (for driver)