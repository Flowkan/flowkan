import { Link, NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link to={"/"}>
          <div className="text-xl font-bold">
            <img src="" alt="Logo Flowkan" />
          </div>
        </Link>
        <nav className="space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "underline" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "underline" : "")}
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
