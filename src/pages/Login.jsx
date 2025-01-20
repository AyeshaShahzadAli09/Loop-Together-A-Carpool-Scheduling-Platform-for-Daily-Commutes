import { SignIn } from "@clerk/clerk-react"; // Clerk SignIn component
import CarAnimation from "../ui/CarAnimation";;

const Login = () =>{
    return(
        <main className="relative flex flex-col justify-center items-center h-screen">
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