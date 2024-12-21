 import {BrowserRouter, Routes , Route, Navigate} from "react-router-dom"
import { useAuth } from '@clerk/clerk-react';
import { Suspense,lazy } from "react";
import Loader from "./ui/Loader";
// Lazy-loaded components
 const AppLayout = lazy(() => import("./ui/AppLayout"));
 const PageNotFound = lazy(() => import("./pages/PageNotFound")); 
const FindRide = lazy(() => import("./features/Ride/FindRide"));
const OfferRide = lazy(() => import("./features/Ride/OfferRide"));
const  HomePage = lazy(() => import("./pages/HomePage"));
const  Login = lazy(() => import("./pages/Login"));
const  Faqs = lazy(() => import("./Footer Pages/Faqs"));
const FindPassenger= lazy(() => import("./features/Commutes/FindPassenger")); 
const FindDriver = lazy(() => import("./features/Commutes/FindDriver"));
const FeedbackForm = lazy(() => import("./features/Reviews/FeedbackForm"));
const FeedbackList = lazy(() => import("./features/Reviews/FeedbackList"));
const TermsAndConditions = lazy(() =>  import ("./Footer Pages/TermsAndConditions"));
const ContactUs = lazy(() =>  import ("./Footer Pages/ContactUs"));
const AboutUs = lazy(() =>  import ("./Footer Pages/AboutUs"));
const Dashboard = lazy(() =>  import ("./features/Dashboard/Dashboard"));
// import { Toaster } from "react-hot-toast";
// import StarFeedback from "./features/Reviews/StarFeedback";

const RequireAuth = ({ children }) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
     <Suspense fallback={<Loader />}>
    <Routes>
      {/* Routes visible to all users */}
      <Route path="/" element={<HomePage />} />
      <Route path="/aboutUs" element={<AboutUs />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Login />} />
      <Route path="/feedbackForm" element={<FeedbackForm />} />
      <Route path="/feedbackList" element={<FeedbackList />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/contact" element={<ContactUs/>} />
      <Route path="/faqs" element={<Faqs />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Protected Routes */}
      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        <Route path="findRide" element={<FindRide />} />
        <Route path="offerRide" element={<OfferRide />} />
        <Route path='findPassenger' element={<FindPassenger/>}/>
        <Route path="findDriver" element={<FindDriver />} /> 
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  </BrowserRouter>
  )
}

export default App;
//chat with other user
// dashboard (all rides data entered alreday)
// star rating
// user feedback (for app) , (for driver)

{/* <Toaster position="top-center" gutter={12}  containerStyle={{margin:"8px"}} 
    //  toastOptions={{
  //     success : 
  //       {
  //         duration : 3000,
  //       },
  //     error : {
  //         duration : 3000,
  // },
  // style : {
  //   fontSize : "16px",
  //   maxWidth : "500px",
  //   padding: "16px 24px",
  //   backgroundColor : "bg-teal-700",
  //   color: "slate-500"
  // }}}  
  />
  <StarFeedback /> */}




















// <BrowserRouter>
//    <Routes>
//   <header>
//   <SignedOut>
//   <SignInButton />
//     <Route index element={<HomePage/>}/>
//     <Route path="faqs" element={<Faqs />}/>
//   </SignedOut>
//   </header>

//   <SignedIn>
//         <UserButton />
//          <Route path="/app" element={ <AppLayout /> }>
//          <Route path="findRide" element={<FindRide/>}/>
//          <Route path='findPassenger' element={<FindPassenger/>}/>
//          <Route path="offerRide" element={<OfferRide/>}/>
//          <Route path="findDriver" element={<FindDriver />} />   
//           </Route> 
//   </SignedIn>
//      <Route path="login" element={<Login/>}></Route> 
//      <Route path="*" element={<PageNotFound/>}></Route> 
//          {/* <Route index element={<Navigate replace to="cities" />} />
//              <Route path="cities" element={<CityList/>}/>
//              <Route path='cities/:id' element={<City/>}/> */}        
//     </Routes>

//     </BrowserRouter>
