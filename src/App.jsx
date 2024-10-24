import {BrowserRouter, Routes , Route} from "react-router-dom"
import AppLayout from "./pages/AppLayout"
import PageNotFound from "./pages/PageNotFound"
import FindRide from "./features/Ride/FindRide"
import OfferRide from "./features/Ride/OfferRide"
import HomePage from "./pages/HomePage"
import Login from "./pages/Login"
import { Fa0 } from "react-icons/fa6"
import Faqs from "./pages/FAQS"
// import Logout from "./features/user Authentication/Logout"

function App() {
  return (
   <BrowserRouter>
   <Routes>
   <Route index element={<HomePage/>}></Route>
   <Route path="faqs" element={<Faqs />}></Route>
         {/* <Route path="login" element={<Logout />}></Route> */}
        {/* <Route path="findRide" element={<FindRide />}></Route>
        <Route path="offerRide" element={<OfferRide />}></Route>
        */}
        <Route path="app" element={ <AppLayout /> }>
        <Route path="findRide" element={<FindRide/>}/>
        <Route path="offerRide" element={<OfferRide/>}/>
         </Route> 
          {/* // <ProtectedRoutes> 
          <AppLayout /> 
          // </ProtectedRoutes>
          }> */}
        {/* <Route index element={<Navigate replace to="cities" />} />
            <Route path="cities" element={<CityList/>}/>
            <Route path='cities/:id' element={<City/>}/>
            <Route path="findRide" element={<FindRide/>}/>
            <Route path="offerRide" element={<OfferRide/>}/> </Route> */}
             <Route path="login" element={<Login/>}></Route> 
        <Route path="*" element={<PageNotFound/>}></Route> 
   </Routes>
   </BrowserRouter>
  )
}

export default App
