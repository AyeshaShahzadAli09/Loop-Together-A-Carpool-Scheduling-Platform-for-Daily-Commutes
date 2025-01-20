import PageNav from "../pages/PageNav";
import Footer from "../ui/Footer";

const TermsAndCondition = () => {
  // Set the last updated date 
  const lastUpdatedDate = new Date("2025-01-01").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <main>
      <PageNav/>
      <div className="bg-slate-50 text-teal-900 p-8 dark:bg-dark-gray dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

        <p className="mb-4">
          Welcome to <span className="font-bold text-emerald-500">Loop Together</span>, a carpooling
          platform designed to connect drivers and riders for shared commutes.
          By using our platform, you agree to be bound by these Terms and
          Conditions.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Definitions</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>
            <strong>App:</strong> Refers to the <span className="font-bold text-emerald-500">Loop Together</span> carpooling platform, including all associated websites and services.
          </li>
          <li>
            <strong>User:</strong> Refers to any individual who creates an
            account or uses the App.
          </li>
          <li>
            <strong>Driver:</strong> Refers to a User who offers to drive other
            Users to a shared destination.
          </li>
          <li>
            <strong>Rider:</strong> Refers to a User who requests to ride with a
            Driver to a shared destination.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">User Agreement</h2>
        <ul className="list-decimal pl-6 mb-6">
          <li>
            <strong>Eligibility:</strong> You must be at least 18 years old to
            use the App. By using the App, you represent and warrant that you
            meet this eligibility requirement.
          </li>
          <li>
            <strong>Account Creation:</strong> To use the App, you must create
            an account by providing accurate and complete information. You are
            responsible for maintaining the confidentiality of your account
            credentials.
          </li>
          <li>
            <strong>User Conduct:</strong> You agree to use the App only for
            lawful purposes and in compliance with these Terms and Conditions.
            You must not:
            <ul className="list-disc pl-6">
              <li>Use the App to harass, threaten, or intimidate other Users.</li>
              <li>Use the App to engage in any form of discrimination or hate speech.</li>
              <li>Use the App to promote or facilitate illegal activities.</li>
              <li>Interfere with or disrupt the operation of the App.</li>
            </ul>
          </li>
          <li>
            <strong>Driver and Rider Responsibilities:</strong> Drivers and
            Riders must:
            <ul className="list-disc pl-6">
              <li>Comply with all applicable laws and regulations.</li>
              <li>
                Provide accurate and complete information about their vehicle,
                route, and schedule (Drivers).
              </li>
              <li>Pay the agreed-upon fare to the Driver (Riders).</li>
              <li>Treat other Users with respect and courtesy.</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
        <ul className="list-decimal pl-6 mb-6">
          <li>
            <strong>Fare Payment:</strong> Riders must pay the agreed-upon fare
            to the Driver at the end of the ride.
          </li>
          <li>
            <strong>Payment Method:</strong> Riders and Drivers are responsible for arranging payment directly with each other. Our App facilitates connections between Riders and Drivers, but we do not handle payment processing.
          </li>
          <li>
            <strong>Payment Options:</strong> Riders and Drivers may choose any payment method they prefer, including cash, JazzCash, EasyPaisa, or bank transfer  or any other option but not limited to these.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
        <ul className="list-decimal pl-6 mb-6">
          <li>
            <strong>Copyright:</strong> All content on the App, including text,
            images, and logos, is the property of Loop Together or its licensors.
          </li>
          <li>
            <strong>Trademarks:</strong> The Loop Together logo and brand name are
            trademarks of <span className="font-bold text-emerald-500">Loop Together</span>.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          Disclaimers and Limitations of Liability
        </h2>
        <ul className="list-decimal pl-6 mb-6">
          <li>
            <strong>Disclaimer of Warranties:</strong> {`The App is provided on an
            "as is" and "as available" basis. Loop Together disclaims all
            warranties, express or implied.`}
          </li>
          <li>
            <strong>Limitation of Liability:</strong> <span className="font-bold text-emerald-500">Loop Together</span> shall not be liable for any damages, including but not limited to incidental,consequential, or punitive damages, arising out of or related to the use of the App.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          Governing Law and Jurisdiction
        </h2>
        <ul className="list-decimal pl-6 mb-6">
          <li>
            <strong>Governing Law:</strong> These Terms and Conditions shall be
            governed by and construed in accordance with the laws of Pakistan.
          </li>
          <li>
            <strong>Jurisdiction:</strong> Any disputes arising out of or related to these Terms and Conditions shall be resolved through binding arbitration in accordance with the rules of the Lahore High Court or other competent courts in Pakistan.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          Changes to Terms and Conditions
        </h2>
        <p className="mb-6">
        <span className="font-bold text-emerald-500">Loop Together</span> reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on the App.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions or concerns about these Terms and
          Conditions, please contact us at {" "}
          <a href="mailto:support@carpoolapp.com" className="text-emerald-500 underline">support@carpoolapp.com</a>.</p>
        <p className="text-sm mt-8"><strong>Last Updated:</strong> {lastUpdatedDate}</p>
      </div>
    </div>
      <Footer/>
      </main>
  );
};

export default TermsAndCondition;
