import { Page } from "../../components/layout/page";
import { NavLink } from "react-router-dom";
import {
	useCallback,
	useEffect,
	useState,
	type ChangeEvent,
	type FocusEvent,
	type FormEvent,
} from "react";
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
import Turnstile from "react-turnstile";
import { validationForm } from "../../utils/validations";
import { LoginFormSchema } from "../../utils/auth.schema";
import { useValidationForm } from "../../hooks/useValidationForm";

export const LoginPage = () => {
	const { t } = useTranslation();
	const loginAction = useLoginAction();
	const profileLoadedAction = useLoadedProfile();
	const dispatch = useAppDispatch();
	const [showModal, setShowModal] = useState(false);

	const [formData, setFormData] = useState<Credentials>({
		email: "",
		password: "",
		turnstileResponse: "",
	});

	const { email, password } = formData;
	const disabled = !email || !password;

	const LoginValidator = useCallback((data:unknown,fieldName?:keyof Omit<typeof formData, "turnstileResponse">)=>{
		return validationForm(LoginFormSchema,data,fieldName)
	},[])

	const { error,validate,checkField } = useValidationForm<Omit<typeof formData,"turnstileResponse">>(LoginValidator)	

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

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {		
		const { name } = e.target
		validate({
			email,
			password
		},name as keyof Omit<typeof formData, "turnstileResponse">)	
		
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {			
			
			//Validaciones con zod
			const isValidForm = validate({email,password})
			if(isValidForm){
				await loginAction(formData);
				await profileLoadedAction();
			}

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
							onBlur={handleBlur}
							errors={error?.email}
							fieldApproved={checkField("email")}
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
							onBlur={handleBlur}
							errors={error?.password}
							fieldApproved={checkField("email")}
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
						<div className="relative flex w-full justify-center">
							<Turnstile
								sitekey={import.meta.env.VITE_TURNSTILE_API_KEY}
								theme="light"
								onVerify={(token) =>
									setFormData((prev) => ({
										...prev,
										turnstileResponse: token,
									}))
								}
							/>
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
