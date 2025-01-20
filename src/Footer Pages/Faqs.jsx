import { useState } from "react";
import { faqs } from "../hooks/faqs";
import Footer from "../ui/Footer";
import PageNav from "../pages/PageNav";

const Faqs = () =>{
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };
    return(
        <main className="bg-slate-50 text-teal-900 dark:bg-dark-gray">
            <PageNav/>
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">Frequently Asked Questions (FAQs)</h2>
            {faqs.map((item, index) => (
          <div
            key={index}
            className={`border-b border-teal-600 py-2 ${
              activeIndex === index ? "dark:text-white" : ""
            }`}
          >
            {/* Question */}
            <h5
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center cursor-pointer text-lg font-semibold dark:text-white"
            >
              {item.question}
              <span
                className={`transform transition-transform ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </h5>
            {/* Answer */}
            <p
              className={`mt-1 dark:text-white font-normal ${
                activeIndex === index ? "block" : "hidden"
              }`}
            >
              {item.answer}
            </p>
          </div>
        ))}
        </div>
        <Footer/>
        </main>
    )
}

export default Faqs;