import { NavLink } from "react-router-dom";
import React from "react";

export const Header: React.FC = () => {
	return (
		<header className="bg-background-card flex items-center justify-between px-6 py-4 shadow-sm md:px-12">
			<div className="flex items-center space-x-8">
				<NavLink to="/">
					<div className="flex items-center">
						<svg
							className="text-accent mr-2 h-6 w-6"
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
						<span className="text-text-heading text-2xl font-bold">
							Flowkan
						</span>
					</div>
				</NavLink>

				<nav className="text-text-body hidden space-x-6 md:flex">
					<a href="#" className="hover:border-accent hover:border-b-2">
						Características
					</a>
					<a href="#" className="hover:border-accent hover:border-b-2">
						Soluciones
					</a>
					<a href="#" className="hover:border-accent hover:border-b-2">
						Precios
					</a>
				</nav>
			</div>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-3">
					<button className="hover:bg-background-light-grey text-text-body rounded-full p-2">
						<svg
							className="h-5 w-5"
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
							`rounded-lg px-5 py-2 font-semibold transition duration-300 ${
								isActive
									? "bg-background-light-grey text-text-heading"
									: "text-text-body hover:bg-background-light-grey"
							}`
						}
					>
						Login
					</NavLink>
					<NavLink
						to="/register"
						className={({ isActive }) =>
							`rounded-lg px-5 py-2 font-semibold transition duration-300 ${
								isActive
									? "bg-primary-dark text-text-on-accent"
									: "bg-primary text-text-on-accent hover:bg-primary-dark"
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
