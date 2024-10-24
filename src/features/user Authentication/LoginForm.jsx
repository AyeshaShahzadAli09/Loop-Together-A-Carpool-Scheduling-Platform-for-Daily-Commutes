import { useState } from "react";
// import { Form } from "react-router-dom";
import SpinnerMini from "../../ui/SpinnerMini";
import Button from "../../ui/Button";

const LoginForm = () =>{
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[isLoading, setIsLoading] = useState(false);
//   const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    // login(
    //   { email, password },
    //   {
    //     onSettled: () => {
    //       setEmail("");
    //       setPassword("");
    //     },
    //   }
    // );
  }
    return(
        <form onSubmit={handleSubmit} className=" relative z-10  w-full space-y-6 bg-white p-6 rounded-lg shadow-md max-w-md mx-4 md:mx-auto">
      <label label="Email address" className="block">
      <span className="text-gray-700">Email address</span>
        <input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
           className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
      </label>

      <label label="Password" className="block">
      <span className="text-gray-700">Password</span>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
      </label>
      <label className="block text-center"> 
        <Button type="primary" disabled={isLoading} >
          {!isLoading ? "Log in" : <SpinnerMini />}
        </Button>
        <Button type="secondary">
          Create new Account
        </Button>
        <Button type="secondary">
          Forget Password?
        </Button>
      </label>
    </form>
    )
}
export default LoginForm;