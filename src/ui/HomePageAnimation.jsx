// npm install react-lottie-player
import { Player } from '@lottiefiles/react-lottie-player';
import carAnimation from '../animations/Animation - 1729874598789.json'; // Lottie JSON file

const HomePageAnimation = () => {
  return (
      <Player
        autoplay
        loop
        src={carAnimation}
        className="w-5/6 h-4/6"
        // style={{ height: '100%', width: '100%' }} // Fullscreen dimensions
        />
  );
};

export default HomePageAnimation;