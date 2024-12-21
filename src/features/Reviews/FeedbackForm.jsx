import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFeedback } from '../Reviews/FeedbackSlice';
import StarFeedback from './StarFeedback';
import PageNav from '../../pages/PageNav';
import Footer from '../../ui/Footer';

const FeedbackForm = () => {
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState({
    satisfied: null,
    rating: 0,
    notes: '',
  });

  const handleSubmit = () => {
    dispatch(addFeedback(feedback));
    alert('Feedback submitted!');
    setFeedback({ satisfied: null, rating: 0, notes: '' });
  };

  return (
   <main>
    <PageNav/>
    <div className="flex flex-col items-center bg-slate-50 text-teal-900 p-4 min-h-screen text-center dark:bg-dark-gray "> 
      <div className="w-full p-6 rounded-lg dark:bg-soft-black  dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Feedback - Loop Together</h1>
        <div className="mb-4">
          <h2 className="text-lg mb-2 font-semibold">Are you satisfied with Loop Together?</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setFeedback({ ...feedback, satisfied: true })}
              className={`px-4 py-2 rounded ${feedback.satisfied ? 'bg-teal-900 text-white' : 'bg-gray-200 dark:bg-soft-black dark:text-white dark:border-2 border-teal-900 '}`}
            >
              Yes
            </button>
            <button
              onClick={() => setFeedback({ ...feedback, satisfied: false })}
              className={`px-4 py-2 rounded ${feedback.satisfied === false ? 'bg-teal-900 text-white' : 'bg-gray-200 dark:bg-soft-black dark:text-white dark:border-2 border-teal-900'}`}
            >
              No
            </button>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg mb-2 font-semibold">Rate your ride experience</h2>
          <StarFeedback/>
          {/* <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setFeedback({ ...feedback, rating: star })}
                className={`cursor-pointer text-2xl ${
                  feedback.rating >= star ? 'text-yellow-400' : 'text-gray-400'
                }`}
              >
                ★
              </span>
            ))}
          </div> */}
        </div>
        <div className="mb-4">
          <h2 className="text-lg mb-2 text-left font-semibold">Additional Notes:</h2>
          <textarea
            value={feedback.notes}
            onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })}
            maxLength="500"
            className="w-full border p-2 rounded h-40 dark:text-black"
            placeholder="Share your experience or suggestions..."
          />
          <p className="text-right text-sm">{500 - feedback.notes.length}/500 characters left</p>
        </div>
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-gray-200 rounded dark:text-black" onClick={() => setFeedback({ satisfied: null, rating: 0, notes: '' })}>
            Skip Feedback
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-teal-900 text-white rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </main>
  );
};

export default FeedbackForm;
