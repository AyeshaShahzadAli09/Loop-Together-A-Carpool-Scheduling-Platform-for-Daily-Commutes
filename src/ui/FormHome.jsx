import { useState } from "react";

const FormHome = () =>{
  const [activeForm, setActiveForm] = useState('findRide');

  const toggleForm = (form) => {
    setActiveForm(form);
  };

    return(
      <div className="p-4 bg-slate-50 border border-blue-200 rounded-lg mx-2">
      <div className="flex flex-wrap justify-center">
        <button
          onClick={() => toggleForm('findRide')}
          className={`capitalize hover:bg-gray-200 text-center tracking-widest p-3 md:p-6 font-semibold mx-1 w-full md:w-auto  border-b-2 ${
            activeForm === 'findRide' ? 'border-blue-400 text-blue-400' : 'border-transparent text-stone-400'
          }`}
        >
          Find a ride
        </button>
        <button
          onClick={() => toggleForm('pickDrop')}
          className={`capitalize hover:bg-gray-200 text-center tracking-widest p-3 md:p-6 font-semibold mx-1 w-full md:w-auto  border-b-2 ${
            activeForm === 'pickDrop' ? 'border-blue-400 text-blue-400' : 'border-transparent text-stone-400'
          }`}
        >
          Pick & drop
        </button>
      </div>

      <div className="relative overflow-hidden h-[400px] mt-5">
        {/* Find Ride Form */}
        <div
          className={`absolute w-full transition-all duration-500 transform ${
            activeForm === 'findRide' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <h4 className="capitalize tracking-widest text-3xl text-blue-400 my-5">
            Request a daily ride
          </h4>
          <form>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Enter Pickup Location"
                className="w-full p-3 border border-blue-300 rounded text-lg"
              />
            </div>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Drop-off Location"
                className="w-full p-3 border border-blue-300 rounded text-lg"
              />
            </div>
            <button className="w-full uppercase border border-blue-400 text-blue-400 p-3 rounded hover:bg-blue-400 hover:text-white">
              book
            </button>
          </form>
        </div>

        {/* Pick & Drop Form */}
        <div
          className={`absolute w-full transition-all duration-500 transform ${
            activeForm === 'pickDrop' ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <h4 className="capitalize tracking-widest text-3xl text-blue-400 my-5">
            Offer a daily ride
          </h4>
          <form>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Enter Pickup Location"
                className="w-full p-3 border border-blue-300 rounded text-lg"
              />
            </div>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Drop-off Location"
                className="w-full p-3 border border-blue-300 rounded text-lg "
              />
            </div>
            <button className="w-full uppercase border border-blue-400 text-blue-400 p-3 rounded hover:bg-blue-400 hover:text-white">
              offer
            </button>
          </form>
        </div>
      </div>
    </div>
    )
}

export default FormHome;


{/* <div className="p-4 bg-slate-50 border border-blue-200 rounded-lg mx-2 ">
{/* <form> */}
{/* <div className="flex flex-wrap justify-center ">
    <button className="capitalize hover:bg-gray-200 text-center tracking-widest p-3 md:p-6 font-semibold mx-1 w-full md:w-auto text-blue-400 border-b-2 border-transparent">Find a ride</button>
    <button className="capitalize hover:bg-gray-200 text-center tracking-widest p-3 md:p-6 font-semibold mx-1 w-full md:w-auto border-blue-400 border-b-2 border-transparent ">Pick & drop</button>
</div> */}
{/* find ride */}
{/* <h4 className="capitalize tracking-widest text-3xl text-blue-400 my-5">Request a daily ride</h4>
<form>
<div className="mb-5">
<input
  type="text"
  placeholder="Enter Pickup Location"
  className="w-full p-3 border border-blue-300 rounded text-lg"
/>
</div>
<div className="mb-5">
<input
  type="text"
  placeholder="Drop-off Location"
  className="w-full p-3 border border-blue-300 rounded text-lg "
/>
</div>
<button className="w-full uppercase border border-blue-400 text-blue-400 p-3 rounded hover:bg-blue-400 hover:text-white">
book
</button>
</form> */} 

{/* pickdrop */}
{/* <h4 className="capitalize tracking-widest text-3xl text-blue-400 my-5">Offer a daily ride</h4>
<form>
<div className="mb-5">
<input
  type="text"
  placeholder="Enter Pickup Location"
  className="w-full p-3 border border-blue-300 rounded text-lg"
/>
</div>
<div className="mb-5">
<input
  type="text"
  placeholder="Drop-off Location"
  className="w-full p-3 border border-blue-300 rounded text-lg "
/>
</div>
<button className="w-full uppercase border  border-blue-400 text-blue-400 p-3 rounded hover:bg-blue-400 hover:text-white">
offer
</button>
</form> */}

   
{/* </form> */}
{/* </div> */}