 import {BrowserRouter, Routes , Route, Navigate} from "react-router-dom"
import { useAuth } from '@clerk/clerk-react';
import { Suspense , lazy } from "react";
import Loader from "./ui/Loader";
import Toast from "./features/Notifications/Toast"
// Lazy-loaded components
 const AppLayout = lazy(() => import("./ui/AppLayout"));
 const PageNotFound = lazy(() => import("./pages/PageNotFound")); 
const FindRide = lazy(() => import("./features/Ride/FindRide"));
const OfferRide = lazy(() => import("./features/Ride/OfferRide"));
const  HomePage = lazy(() => import("./pages/HomePage"));
const  Login = lazy(() => import("./pages/Login"));
const  Faqs = lazy(() => import("./Footer Pages/Faqs"));
const FindPassenger = lazy(() => import("./features/Commutes/FindPassenger")); 
const FindDriver = lazy(() => import("./features/Commutes/FindDriver"));
const FeedbackForm = lazy(() => import("./features/Reviews/FeedbackForm"));
const FeedbackList = lazy(() => import("./features/Reviews/FeedbackList"));
const TermsAndConditions = lazy(() =>  import ("./Footer Pages/TermsAndConditions"));
const ContactUs = lazy(() =>  import ("./Footer Pages/ContactUs"));
const AboutUs = lazy(() =>  import ("./Footer Pages/AboutUs"));
const CarpoolDashboard = lazy(() =>  import ("./features/Carpool Details/CarpoolDashboard"));
const CurrentCarpool = lazy(()=> import("./features/Carpool Details/CurrentCarpool"))
const Chat = lazy(() => import("./features/chat/Chat"));

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
     <Toast /> {/* for global availability */}
     <Suspense fallback={<Loader />}>
    <Routes>
      {/* Routes visible to all users */}
       {!isSignedIn && <Route path="/" element={<HomePage />} />}  {/*if user is not signed in */}
      <Route path="/aboutUs" element={<AboutUs />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Login />} />
      <Route path="/feedbackForm" element={<FeedbackForm />} />
      <Route path="/feedbackList" element={<FeedbackList />} />
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
        <Route path="findRide" element={<FindRide />} />
        <Route path="offerRide" element={<OfferRide />} />
        <Route path='findPassenger' element={<FindPassenger/>}/>
        <Route path="findDriver" element={<FindDriver />} /> 
         <Route path="chat" element={<Chat/>} /> {/* user id */}
        <Route path="currentCarpool" element={<CurrentCarpool/>} />
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