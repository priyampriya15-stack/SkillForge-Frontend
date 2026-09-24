import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="min-h-[calc(100vh-80px)] bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
