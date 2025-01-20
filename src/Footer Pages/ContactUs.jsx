import PageNav from "../pages/PageNav";
import Footer from "../ui/Footer";

const ContactUs = () => {
  return (
    <main>
      <PageNav/>
      <div className="bg-slate-50 text-teal-900 p-6 md:p-12 dark:bg-dark-gray dark:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-lg">
         {` We're here to help! If you have any questions, concerns, or feedback about our carpooling platform, please don't hesitate to reach out.`}
        </p>

        {/* Get in Touch Section */}
        <section>
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@carpoolapp.com"
                className="text-emerald-500 hover:underline"
              >
                support@carpoolapp.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a href="tel:+923211234567" className="text-emerald-500 hover:underline">
                +92 321 1234567
              </a>
            </li>
          </ul>
        </section>

        {/* Support Hours Section */}
        <section>
          <h2 className="text-2xl font-semibold">Support Hours</h2>
          <ul className="mt-4 space-y-1">
            <li>Monday to Friday: 9am - 5pm PST</li>
            <li>Saturday to Sunday: 10am - 4pm PST</li>
          </ul>
        </section>

        {/* Report an Issue Section */}
        <section>
          <h2 className="text-2xl font-semibold">Report an Issue</h2>
          <p className="mt-4">
            {`If you've encountered an issue with our app, please provide us with the following details:`}
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Your username or email address</li>
            <li>A description of the issue</li>
            <li>Any relevant screenshots or error messages</li>
          </ul>
          <p className="mt-4">
            {`We'll do our best to resolve the issue as soon as possible.`}
          </p>
        </section>
      </div>
    </div>
      <Footer/>
    </main>
  );
};

export default ContactUs;
