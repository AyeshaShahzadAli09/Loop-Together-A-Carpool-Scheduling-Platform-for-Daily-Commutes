import { SignIn } from "@clerk/clerk-react"; // Clerk SignIn component
import CarAnimation from "../ui/CarAnimation";;

const Login = () =>{
    return(
        <main className="relative flex flex-col justify-center items-center h-screen  bg-gray-400">
      {/* Background Car Animation  */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-90">
            <CarAnimation />
        </div>
        <div className="relative z-10 text-center">
        <SignIn/>
        </div>
        </main>
    )
}

export default Login;

// relative z-10: Ensures the login form is positioned above the animation.
// CarAnimation: The background animation component is absolutely positioned to cover the entire page.
// bg-white p-6 rounded-lg shadow-md: Adds styling to the login form, giving it a white background and rounded corners to make it stand out over the animation.
// max-w-md mx-4: Limits the form’s width and centers it on smaller screens.