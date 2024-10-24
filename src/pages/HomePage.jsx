import ExploreCards from "../ui/ExploreCards";
import PageNav from "./PageNav";
import MainDisplay from "../ui/MainDisplay";
import Community from "./Community";
import Footer from "../ui/Footer"

const HomePage = () =>{
    return(
        <main>
            <PageNav/>
            <MainDisplay/>
            <ExploreCards/>
            <Community/>
            <Footer/>
        </main>
       
    )
}

export default HomePage;