import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const FormHome = () =>{
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState('findRide');

  const toggleForm = (form) => {
    setActiveForm(form);
  };

  function handleInputRide(e)
  {
    e.preventDefault();
    navigate("/sign-in")
  }
    return(
      <div className="p-4 bg-slate-50 border border-teal-900 rounded-lg mx-2 dark:bg-stone-500 dark:bg-opacity-15  ">
      <div className="flex flex-wrap justify-center">
        <button
          onClick={() => toggleForm('findRide')}
         className={`capitalize hover:bg-gray-200 text-center tracking-widest p-3 md:p-6 font-semibold mx-1 w-full md:w-auto  border-b-2 ${ activeForm === 'findRide' ? 'border-teal-900 text-teal-900 dark:text-white' : 'border-transparent text-stone-400 dark:text-stone-600'
          }`} > Find a ride
        </button>
        <button
          onClick={() => toggleForm('pickDrop')}
          className={`capitalize hover:bg-gray-200 text-center tracking-widest p-3 md:p-6 font-semibold mx-1 w-full md:w-auto  border-b-2 ${
            activeForm === 'pickDrop' ? 'border-teal-900 text-teal-900 dark:text-white' : 'border-transparent text-stone-400 dark:text-stone-600'
          }`}
        >
          Pick & drop
        </button>
      </div>

      <div className="relative overflow-hidden h-[400px] mt-5 ">
        {/* Find Ride Form */}
        <div
          className={`absolute w-full transition-all duration-500 transform ${
            activeForm === 'findRide' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <h4 className="capitalize tracking-widest text-3xl text-teal-900 my-5 dark:text-white">
            Request a daily ride
          </h4>
          <form onSubmit={handleInputRide}>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Enter Pickup Location"
                className="formHomeInput"
              />
            </div>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Drop-off Location"
                className="formHomeInput"
              />
            </div>
            <Button type="secondary">book</Button>
          </form>
        </div>

        {/* Pick & Drop Form */}
        <div
          className={`absolute w-full transition-all duration-500 transform ${
            activeForm === 'pickDrop' ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <h4 className="capitalize tracking-widest text-3xl text-teal-900 my-5 dark:text-white">
            Offer a daily ride
          </h4>
          <form onSubmit={handleInputRide}>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Enter Pickup Location"
                className="formHomeInput"
              />
            </div>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Drop-off Location"
                className="formHomeInput"
              />
            </div>
            <Button type="secondary">offer</Button>
          </form>
        </div>
      </div>
    </div>
    )
}

export default FormHome;
