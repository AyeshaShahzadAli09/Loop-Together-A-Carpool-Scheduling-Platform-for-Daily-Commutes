import {BrowserRouter, Routes , Route, Navigate} from "react-router-dom"
import { useAuth } from '@clerk/clerk-react';
import { Suspense , lazy } from "react";
import Loader from "./ui/Loader";
// Lazy-loaded components
 const AppLayout = lazy(() => import("./ui/AppLayout"));
 const PageNotFound = lazy(() => import("./pages/PageNotFound")); 
const  HomePage = lazy(() => import("./pages/HomePage"));
const  Faqs = lazy(() => import("./Footer Pages/Faqs"));
const TermsAndConditions = lazy(() =>  import ("./Footer Pages/TermsAndConditions"));
const ContactUs = lazy(() =>  import ("./Footer Pages/ContactUs"));
const AboutUs = lazy(() =>  import ("./Footer Pages/AboutUs"));
const CarpoolDashboard = lazy(() =>  import ("./features/Carpool Details/CarpoolDashboard"));

const RequireAuth = ({ children }) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

function App() {
  const { isSignedIn } = useAuth(); // get login status
  return (
    <BrowserRouter>
      {/* Remove or comment out the Toast line */}
      {/* <Toast /> */}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Routes visible to all users */}
           {!isSignedIn && <Route path="/" element={<HomePage />} />}  {/*if user is not signed in */}
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<ContactUs/>} />
          <Route path="/faqs" element={<Faqs />} />

           {/* Redirect to carpoolDashboard after login */}
           {isSignedIn && <Route path="/" element={<Navigate to="/app/carpoolDashboard" replace />} />}

          {/* Protected Routes */}
          {isSignedIn && (
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppLayout />  {/* Common parent layout */}
              </RequireAuth>
            }
          >
            <Route path="carpoolDashboard" element={<CarpoolDashboard/>} />
          </Route>
          )}
          {/* Fallback route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;

// user feedback (for app) , (for driver)