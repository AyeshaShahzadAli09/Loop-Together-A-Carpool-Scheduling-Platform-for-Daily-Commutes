// npm install react-lottie-player
import { Player } from '@lottiefiles/react-lottie-player';
import splashScreen from '../animations/Animation - 1729874598789.json'; // Lottie JSON file

const SplashScreen = () =>{
    return(
        <Player
        autoplay
        loop
        src={splashScreen}
        className="w-3/5 h-3/5"
        />
    )
}

export default SplashScreen;
