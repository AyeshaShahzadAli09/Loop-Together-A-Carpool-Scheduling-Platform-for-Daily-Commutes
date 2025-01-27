import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { useClerk } from '@clerk/clerk-react';
import { Suspense, lazy } from "react";
import Loader from "./ui/Loader";
import { AuthProvider } from './context/AuthContext';
import { useAuth } from '@clerk/clerk-react';
// Lazy-loaded components
const AppLayout = lazy(() => import("./ui/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound")); 
const HomePage = lazy(() => import("./pages/HomePage"));
const Faqs = lazy(() => import("./Footer Pages/Faqs"));
const TermsAndConditions = lazy(() => import("./Footer Pages/TermsAndConditions"));
const ContactUs = lazy(() => import("./Footer Pages/ContactUs"));
const AboutUs = lazy(() => import("./Footer Pages/AboutUs"));
const CarpoolDashboard = lazy(() => import("./features/Carpool Details/CarpoolDashboard"));
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));

function App() {
  const { isSignedIn } = useClerk();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/app/carpoolDashboard" />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="carpoolDashboard" element={<CarpoolDashboard />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isSignedIn } = useClerk();
  
  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated || !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default App;

// user feedback (for app) , (for driver)