import { Page } from "../../components/layout/page";
import { NavLink } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { CustomToast } from "../../components/CustomToast";
import type { Credentials } from "./types";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store";
import { SpinnerLoadingText } from "../../components/ui/Spinner";
import { Form } from "../../components/ui/Form";
import { FormFields } from "../../components/ui/FormFields";
import { Button } from "../../components/ui/Button";
import { __ } from "../../utils/i18nextHelper";
import { WithOtherServices } from "../register/withOtherServices/WithOtherServices";
import { useLoginAction } from "../../store/auth/hooks";
import { useLoadedProfile } from "../../store/profile/hooks";
import { loginWithOAuth } from "../../store/auth/actions";
import ForgotPassword from "../../components/ui/modals/forgot-password";

export const LoginPage = () => {
	const { t } = useTranslation();
	const loginAction = useLoginAction();
	const profileLoadedAction = useLoadedProfile();
	const dispatch = useAppDispatch();
	// const modalForgotPassword = useRef<HTMLDialogElement|null>(null)
	const [showModal, setShowModal] = useState(false);

	const [formData, setFormData] = useState<Credentials>({
		email: "",
		password: "",
	});

	const { email, password } = formData;
	const disabled = !email || !password;

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get("token");
		const userEncoded = params.get("user");
		if (token) {
			let user = null;
			if (userEncoded) {
				try {
					const userDecoded = decodeURIComponent(userEncoded);
					user = JSON.parse(userDecoded);
				} catch (e) {
					console.error("Error al parsear el objeto de usuario OAuth:", e);
					toast.error("Error al procesar la información del usuario.");
				}
			}
			dispatch(loginWithOAuth({ token, user }));
		}
	}, [dispatch]);

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
		try {
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
						message={__(
							"login.toast.message.errorEmptyPassword",
							"La contraseña no puede estar vacía.",
						)}
						t={t}
						type="error"
					/>
				));
				return;
			}

			await loginAction(formData);
			await profileLoadedAction();
		} catch (error: unknown) {
			if (error instanceof Error) {
				setFormData((prevData) => ({
					...prevData,
					email: "",
					password: "",
				}));
				toast.custom((t) => (
					<CustomToast
						message={__(
							"login.toast.message.error",
							"Credenciales incorrectas",
						)}
						t={t}
						type="error"
					/>
				));
				return;
			}
		}
	};

	function handleShowModal() {
		setShowModal(true);
	}
	function handleCloseModal() {
		setShowModal(false);
	}
	return (
		<Page>
			<div
				className="bg-background-page flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 sm:px-6 lg:px-8"
				style={{
					backgroundImage: `url('/meta/fondo_formulario.png')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="bg-background-card/95 w-full max-w-md transform space-y-8 rounded-xl p-10 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]">
					<div>
						<h1 className="text-text-heading mt-6 text-center text-4xl font-extrabold">
							{t("login.loginForm.title", "Iniciar Sesión")}
						</h1>
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
					<Form
						className="mt-8 space-y-6"
						onSubmit={handleSubmit}
						method="POST"
						initialValue={{
							email: formData.email,
							password: formData.password,
						}}
					>
						<FormFields
							label={t(
								"login.loginForm.email.emailLabel",
								"Dirección de Email",
							)}
							labelClassName="sr-only"
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

						<FormFields
							label={t("login.loginForm.password.passwordLabel", "Contraseña")}
							labelClassName="sr-only"
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

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<button
									onClick={handleShowModal}
									type="button"
									className="text-text-link hover:text-accent-hover font-medium hover:cursor-pointer"
								>
									{t(
										"login.loginForm.forgetPassword",
										"¿Olvidaste tu contraseña?",
									)}
								</button>
							</div>
						</div>
						<div>
							<Button
								type="submit"
								disabled={disabled}
								className="group text-text-on-accent bg-primary hover:bg-primary-dark focus:ring-primary focus:ring-offset-background-card relative flex w-full transform justify-center rounded-md border border-transparent px-4 py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.005] focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								{status === "loading" ? (
									<SpinnerLoadingText
										text={t(
											"login.loginForm.loginButton.spinner.loading",
											"Cargando",
										)}
									/>
								) : (
									t(
										"login.loginForm.loginButton.spinner.default",
										"Iniciar Sesión",
									)
								)}{" "}
							</Button>
						</div>
					</Form>
					<ForgotPassword show={showModal} onClose={handleCloseModal} />
					<WithOtherServices />
				</div>
			</div>
		</Page>
	);
};
