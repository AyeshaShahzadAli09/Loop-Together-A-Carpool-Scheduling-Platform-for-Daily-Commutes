import { faqs } from "../hooks/faqs";
const Faqs = () =>{
    return(
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-300 rounded-md p-4 shadow-sm transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold">{faq.question}</h3>
                        <p className="mt-2 text-gray-600">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Faqs;