import { BiLoaderAlt } from "react-icons/bi";

const SpinnerMini = () => {
  return (
    <BiLoaderAlt className="w-10 h-10 animate-spin" />
    // animate-spin: A built-in Tailwind utility for rotating the icon with infinite animation.
  );
};

export default SpinnerMini;