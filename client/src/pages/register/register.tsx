import { Page } from "../../components/layout/page";
import { NavLink } from "react-router-dom";
import type { User } from "./types";
import toast from "react-hot-toast";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { CustomToast } from "../../components/CustomToast";
import { register } from "./service";

export const RegisterPage = () => {
	const [formData, setFormData] = useState<User>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const validateEmail = (email: string): boolean => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validateEmail(formData.email)) {
			toast.custom((t) => (
				<CustomToast
					message="Por favor, introduce una dirección de correo válida."
					t={t}
					type="error"
				/>
			));
			return;
		}

		if (
			formData.password.trim() === "" ||
			formData.confirmPassword.trim() === ""
		) {
			toast.custom((t) => (
				<CustomToast
					message="La contraseña no puede estar vacía."
					t={t}
					type="error"
				/>
			));
			return;
		}

		if (formData.password.trim() !== formData.confirmPassword.trim()) {
			toast.custom((t) => (
				<CustomToast
					message="La contraseñas son diferentes."
					t={t}
					type="error"
				/>
			));
			return;
		}

		await register(formData);

		// Si ambas validaciones pasan, mostrar el mensaje de éxito
		toast.custom((t) => (
			<CustomToast
				message="Formulario enviado con éxito!"
				t={t}
				type="success"
			/>
		));
	};

	return (
		<Page>
			<div className="bg-background-page flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="bg-background-card w-full max-w-md transform space-y-8 rounded-xl p-10 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
					<div>
						<h1 className="text-text-heading mt-6 text-center text-4xl font-extrabold">
							Crea tu Cuenta
						</h1>
						<p className="text-text-body mt-2 text-center text-sm">
							¿Ya tienes una cuenta?{" "}
							<NavLink
								to="/login"
								className="text-text-link hover:text-accent-hover font-medium"
							>
								Inicia sesión aquí
							</NavLink>
						</p>
					</div>

					<form
						className="mt-8 space-y-6"
						onSubmit={handleSubmit}
						method="POST"
					>
						<div className="-space-y-px rounded-md shadow-sm">
							<div>
								<label htmlFor="full-name" className="sr-only">
									Nombre Completo
								</label>
								<input
									id="full-name"
									name="name"
									type="text"
									autoComplete="name"
									required
									className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
									placeholder="Nombre completo"
									onChange={handleChange}
								/>
							</div>
							<div className="mt-3">
								<label htmlFor="email-address" className="sr-only">
									Dirección de Email
								</label>
								<input
									id="email-address"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
									placeholder="Correo electrónico"
									onChange={handleChange}
								/>
							</div>

							<div className="mt-3">
								<label htmlFor="password" className="sr-only">
									Contraseña
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									required
									className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
									placeholder="Contraseña"
									onChange={handleChange}
								/>
							</div>
							<div className="mt-3">
								<label htmlFor="confirm-password" className="sr-only">
									Confirmar Contraseña
								</label>
								<input
									id="confirm-password"
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									required
									className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
									placeholder="Confirmar contraseña"
									onChange={handleChange}
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="group text-text-on-accent bg-primary hover:bg-primary-dark focus:ring-primary focus:ring-offset-background-card relative flex w-full transform justify-center rounded-md border border-transparent px-4 py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.005] focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								Registrarse
							</button>
						</div>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="border-border-light w-full border-t"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-background-card text-text-placeholder px-2">
								O continúa con
							</span>
						</div>
					</div>

					<div>
						<div className="mt-6 grid grid-cols-2 gap-3">
							<div>
								<button
									type="button"
									className="border-border-light bg-background-card text-text-body hover:bg-background-light-grey inline-flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
								>
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
										alt="Google Logo"
										className="mr-2 h-5 w-5"
									/>
									Google
								</button>
							</div>
							<div>
								<button
									type="button"
									className="border-border-light bg-background-card text-text-body hover:bg-background-light-grey inline-flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
								>
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
										alt="GitHub Logo"
										className="mr-2 h-5 w-5"
									/>
									GitHub
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Page>
	);
};
