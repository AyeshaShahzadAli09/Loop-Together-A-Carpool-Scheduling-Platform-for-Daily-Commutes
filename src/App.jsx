import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react";
import Loader from "./ui/Loader";
import { AuthProvider, useAuth } from './context/AuthContext';

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
      <AppContent />
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

          {/* Fallback route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

// user feedback (for app) , (for driver)