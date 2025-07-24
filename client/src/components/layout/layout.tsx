import { Outlet } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-300">
      <Header />

      <main className="container mx-auto flex-1 p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
