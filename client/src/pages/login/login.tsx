// src/pages/login/LoginPage.tsx
import { Page } from "../../components/layout/page";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { CustomToast } from "../../components/CustomToast";
import type { Credentials } from "./types";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../store/authSlice";

export const LoginPage = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { status, error, isAuthenticated } = useAppSelector(
		(state) => state.auth,
	);
	const [formData, setFormData] = useState<Credentials>({
		email: "",
		password: "",
	});

	const { email, password } = formData;
	const disabled = !email || !password;

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/boards");
		}
	}, [isAuthenticated, navigate]);

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

		// Validar el email primero
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

		// Si el email es válido, validar la contraseña
		if (formData.password.trim() === "") {
			toast.custom((t) => (
				<CustomToast
					message="La contraseña no puede estar vacía."
					t={t}
					type="error"
				/>
			));
			return;
		}

		try {
			await dispatch(login(formData));
			toast.custom((t) => (
				<CustomToast
					message="Formulario enviado con éxito!"
					t={t}
					type="success"
				/>
			));
		} catch (err) {
			console.error("Login failed:", err);
		}
	};

	return (
		<Page>
			<div className="bg-background-page flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="bg-background-card w-full max-w-md transform space-y-8 rounded-xl p-10 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
					<div>
						<h1 className="text-text-heading mt-6 text-center text-4xl font-extrabold">
							{t("login.loginForm.title", "Iniciar Sesión")}
						</h1>
						{error && (
							<div
								className="rounded border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-600"
								role="alert"
							>
								{error}
							</div>
						)}
						<p className="text-text-body mt-2 text-center text-sm">
							{t("login.loginForm.question", "¿No tienes una cuenta?")}
							<NavLink
								to="/register"
								className="text-text-link hover:text-accent-hover font-medium"
							>
								{" "}
								{t("login.loginForm.signup", "Regístrate aquí")}
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
								<label htmlFor="email-address" className="sr-only">
									{t("login.loginForm.email.emailLabel", "Dirección de Email")}
								</label>
								<input
									id="email-address"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
									placeholder={t(
										"login.loginForm.email.placeholder",
										"Correo electrónico",
									)}
									onChange={handleChange}
									value={formData.email}
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									{t("login.loginForm.password.passwordLabel", "Contraseña")}
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative mt-3 block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
									placeholder={t(
										"login.loginForm.password.passwordPlaceholder",
										"Contraseña",
									)}
									onChange={handleChange}
									value={formData.password}
								/>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="text-sm">
								<a
									href="#"
									className="text-text-link hover:text-accent-hover font-medium"
								>
									{t(
										"login.loginForm.forgetPassword",
										"¿Olvidaste tu contraseña?",
									)}
								</a>
							</div>
						</div>
						<div>
							<button
								type="submit"
								disabled={disabled}
								className="group text-text-on-accent bg-primary hover:bg-primary-dark focus:ring-primary focus:ring-offset-background-card relative flex w-full transform justify-center rounded-md border border-transparent px-4 py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.005] focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								{status === "loading"
									? t("login.loginForm.loading", "Cargando...")
									: t("login.loginForm.loginButton", "Iniciar Sesión")}
							</button>
						</div>
					</form>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="border-border-light w-full border-t"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-background-card text-text-placeholder px-2">
								{t("login.loginForm.otherTypeLogin", "O continúa con")}
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
