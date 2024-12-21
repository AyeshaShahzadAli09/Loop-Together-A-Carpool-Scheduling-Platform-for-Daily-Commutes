import { useSelector } from 'react-redux';
import Button from "../../ui/Button"
import { useNavigate } from 'react-router-dom';
import PageNav from '../../pages/PageNav';
import Footer from '../../ui/Footer';
const FeedbackList = () => {
    const feedbacks = useSelector((state) => state.feedback.feedbacks);
    const navigate = useNavigate();

    function handleAddFeedback()
    {
        navigate("/feedbackForm");
    }
  return (
    <main className="bg-slate-50 text-teal-900 dark:bg-dark-gray">
        <PageNav/>
        <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4 uppercase dark:text-white">User Feedback</h1>
      <div className="space-y-4">
        {feedbacks.length > 0 ? (
          feedbacks.map((item, index) => (
            <div key={index} className="p-4 bg-white rounded shadow dark:bg-soft-black dark:text-white">
         {item.satisfied !== null && ( // Check if satisfied is not null
        <p><strong>Satisfied:</strong> {item.satisfied === true ? 'Yes' : 'No'}</p>
      )}
      {item.rating !== null && ( // Check if rating is greater than 0
        <p><strong>Rating:</strong> {item.rating} / 5</p>
      )}
      {item.notes && item.notes.trim() && ( // Check if notes exist and are not empty
        <p> <strong>Notes:</strong> {item.notes}</p>
      )} 
        </div>
    ))
        ) : (
            <>   
          <p className="dark:text-white ">No feedback available.</p>
          <Button type="linkBtn" onClick={handleAddFeedback}>Add Your Review</Button>
          </>
        )}
      </div>
    </div>
    <Footer/>
    </div>
    </main>
  );
};

export default FeedbackList;
