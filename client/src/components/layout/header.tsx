import { Link, NavLink } from "react-router-dom";
import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="bg-background-card py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-8">
        <NavLink
          to="/">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-accent"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm4 0a1 1 010-2 0v4a1 1 0102 0V6z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-2xl font-bold text-text-heading">Flowkan</span>
          </div>
        </NavLink>

        <nav className="hidden md:flex space-x-6 text-text-body">
          <a href="#" className="hover:border-b-2 hover:border-accent">Características</a>
          <a href="#" className="hover:border-b-2 hover:border-accent">Soluciones</a>
          <a href="#" className="hover:border-b-2 hover:border-accent">Precios</a>
        </nav>
      </div>


      <div className="flex items-center space-x-4">

        <div className="flex items-center space-x-3">

          <button className="p-2 rounded-full hover:bg-background-light-grey text-text-body">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 8a1 1 0 000 2h4a1 1 0 100-2H7zm-3 4a1 1 0 011-1h6a1 1 0 010 2H5a1 1 0 01-1-1zm3 4a1 1 0 011-1h2a1 1 0 010 2H8a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex space-x-2">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-5 py-2 rounded-lg font-semibold transition duration-300 ${
                isActive
                  ? 'bg-background-light-grey text-text-heading'
                  : 'text-text-body hover:bg-background-light-grey'
              }`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `px-5 py-2 rounded-lg font-semibold transition duration-300 ${
                isActive
                  ? 'bg-primary-dark text-text-on-accent'
                  : 'bg-primary text-text-on-accent hover:bg-primary-dark'
              }`
            }
          >
            Registro
          </NavLink>
        </div>
      </div>
    </header>
  );
};