import { useState } from "react";
import StarRating from "./StarRating"
// import Button from "../../ui/Button"
import { toast } from "react-hot-toast";

const StarFeedback = () => {
    const[userRating,setUserRating] = useState("");

   // Handle feedback submission
   const handleFeedbackSubmit = (rating) => {
    setUserRating(rating);
    toast.dismiss(); // Close the toast after submission
    console.log(`User rating: ${rating} stars`);
};

  //to get know that how many times the user decide to rate but doesnt show this on ui 
//   const countRef = useRef(0);

//   useEffect(
//     function()
//     {
//       // if(userRating) countRef.current = countRef.current + 1;
//       if(userRating) countRef.current++;
//     },[userRating]
//   )
    return (
       // Star Feedback Component for Toast
      <div className="text-center">
          <StarRating
              maxRating={5}
              size={40}
              onSetRating={handleFeedbackSubmit}
              // onSetRating={setUserRating} 
              messages={["Bad", "Okay", "Good", "Smooth","Excellent"]}
          />
          </div>
    )
    
}

export default StarFeedback;