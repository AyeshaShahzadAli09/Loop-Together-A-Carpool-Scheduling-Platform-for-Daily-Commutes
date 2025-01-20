// npm install react-lottie-player
import { Player } from '@lottiefiles/react-lottie-player';
import carAnimation from '../animations/Animation - 1733921504933.json'; // Lottie JSON file

const CarAnimation = () => {
  return (
      <Player
        autoplay
        loop
        src={carAnimation}
        className="w-full h-full"/>
  );
};

export default CarAnimation;