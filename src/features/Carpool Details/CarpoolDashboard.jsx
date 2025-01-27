import { useNavigate } from "react-router-dom";
import PageNav from "../../pages/PageNav";
import Footer from "../../ui/Footer";
import { useCallback } from "react";
import Button from "../../ui/Button";

const CarpoolDashboard = () => {
  return (
    <main className="bg-slate-50 dark:bg-dark-gray min-h-screen flex flex-col">
      <PageNav />
      <section className="flex-grow m-10">
        <h1 className="text-2xl font-bold dark:text-white">Hey!</h1>
      </section>
      <Footer />
    </main>
  );
};

export default CarpoolDashboard;
