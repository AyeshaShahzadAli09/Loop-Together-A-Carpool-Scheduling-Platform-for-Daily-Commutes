import PageNav from "./PageNav";
import MainDisplay from "../ui/MainDisplay";
import ExploreCards from "../ui/ExploreCards";
import Community from "../ui/Community";
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