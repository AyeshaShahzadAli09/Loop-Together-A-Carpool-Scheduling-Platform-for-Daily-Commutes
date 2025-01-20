// npm install react-lottie-player
import { Player } from '@lottiefiles/react-lottie-player';
import carAnimation from '../animations/Animation - 1729874139836.json'; // Lottie JSON file

const CarAnimation = () => {
  return (
      <Player
        autoplay
        loop
        src={carAnimation}
        className="w-full h-full"
        />
  );
};

export default CarAnimation;















// The Player component renders the Lottie animation.
// The autoplay and loop props make the animation play automatically and loop continuously.
// The src prop points to the JSON animation file.


// absolute: Ensures the animation is positioned over the entire page.
// top-0 left-0 w-full h-full: Positions the animation to cover the full width and height of the page.
// z-0: Sends the background animation behind the other content.
// overflow-hidden: Ensures any overflow is clipped, preventing the animation from spilling