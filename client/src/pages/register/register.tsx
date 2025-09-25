import { Page } from "../../components/layout/page";
import { NavLink, useNavigate } from "react-router-dom";
import type { UserRegister } from "./types";
import toast from "react-hot-toast";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CustomToast } from "../../components/CustomToast";
import { register } from "./service";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Form } from "../../components/ui/Form";
import { FormFields } from "../../components/ui/FormFields";
import { WithOtherServices } from "./withOtherServices/WithOtherServices";
import { SpinnerLoadingText } from "../../components/ui/Spinner";
import { __ } from "../../utils/i18nextHelper";

const RegisterPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [formData, setFormData] = useState<UserRegister>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		photo: null,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { name, email, password, confirmPassword } = formData;
	const disabled =
		!name || !email || !password || !confirmPassword || isSubmitting;
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const validateEmail = (email: string): boolean => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, type, value, files } = e.target;
		setFormData((prevData: UserRegister) => ({
			...prevData,
			[name]: type === "file" ? (files?.[0] ?? null) : value,
		}));
		if (type === "file" && files?.[0]) {
			setPreviewUrl(URL.createObjectURL(files[0]));
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		if (!validateEmail(email)) {
			toast.custom((t) => (
				<CustomToast
					message="Por favor, introduce una dirección de correo válida."
					t={t}
					type="error"
				/>
			));
			setIsSubmitting(false);
			return;
		}

		if (password.trim() === "" || confirmPassword.trim() === "") {
			toast.custom((t) => (
				<CustomToast
					message="La contraseña no puede estar vacía."
					t={t}
					type="error"
				/>
			));
			setIsSubmitting(false);
			return;
		}

		if (password.trim() !== confirmPassword.trim()) {
			toast.custom((t) => (
				<CustomToast
					message="Las contraseñas no coinciden."
					t={t}
					type="error"
				/>
			));
			setIsSubmitting(false);
			return;
		}

		if (password.trim().length < 8) {
			toast.custom((t) => (
				<CustomToast
					message="La contraseña debe ser de al menos 8 caracteres."
					t={t}
					type="error"
				/>
			));
			setIsSubmitting(false);
			return;
		}

		try {
			await register(formData);
			navigate("/verify-pending", {
				state: {
					email: formData.email,
				},
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.custom((t) => (
					<CustomToast
						message={__(
							"register.registerForm.message.error",
							"Ha ocurrido un error inesperado durante el registro.",
						)}
						t={t}
						type="error"
					/>
				));
				return;
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Page>
			<div className="bg-background-page flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="bg-background-card w-full max-w-md transform space-y-8 rounded-xl p-10 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
					<div>
						<h1 className="text-text-heading mt-6 text-center text-4xl font-extrabold">
							{t("register.registerForm.title", "Crea tu Cuenta")}
						</h1>
						<p className="text-text-body mt-2 text-center text-sm">
							{t("register.registerForm.question", "¿Ya tienes una cuenta?")}
							<NavLink
								to="/login"
								className="text-text-link hover:text-accent-hover font-medium"
							>
								{" "}
								{t("register.registerForm.login", "Inicia sesión aquí")}
							</NavLink>
						</p>
					</div>

					<Form
						className="mt-8 space-y-6"
						onSubmit={handleSubmit}
						method="POST"
						initialValue={{
							name: formData.name,
							email: formData.email,
							password: formData.password,
							confirmPassword: formData.confirmPassword,
							photo: previewUrl,
						}}
					>
						<div className="-space-y-px rounded-md shadow-sm">
							<div className="mb-6 flex flex-col items-center">
								<div className="relative">
									{previewUrl ? (
										<img
											src={previewUrl}
											alt="preview"
											className="h-24 w-24 rounded-full border border-gray-300 object-cover shadow-md"
										/>
									) : (
										<div
											onClick={() => fileRef.current?.click()}
											className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-200 transition hover:bg-gray-300"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-8 w-8 text-gray-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
												/>
												<circle
													cx="12"
													cy="13"
													r="3"
													strokeWidth="2"
													stroke="currentColor"
												/>
											</svg>
										</div>
									)}

									{previewUrl && (
										<Button
											type="button"
											onClick={() => fileRef.current?.click()}
											className="bg-primary hover:bg-primary-dark absolute right-0 bottom-0 rounded-full p-1.5 text-white shadow transition"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 4v16m8-8H4"
												/>
											</svg>
										</Button>
									)}
								</div>

								<FormFields
									id="photo"
									name="photo"
									type="file"
									accept="image/*"
									className="hidden"
									ref={fileRef}
									onChange={handleChange}
								/>
							</div>

							<FormFields
								label={t("register.registerForm.name.label", "Nombre Completo")}
								labelClassName="sr-only"
								id="full-name"
								name="name"
								autoComplete="name"
								required
								className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
								placeholder={t(
									"register.registerForm.name.placeholder",
									"Nombre completo",
								)}
								onChange={handleChange}
								value={name}
							/>

							<FormFields
								label={t(
									"register.registerForm.email.label",
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
									"register.registerForm.email.placeholder",
									"Correo electrónico",
								)}
								onChange={handleChange}
								value={email}
							/>

							<FormFields
								label={t("register.registerForm.password.label", "Contraseña")}
								labelClassName="sr-only"
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
								placeholder={t(
									"register.registerForm.password.placeholder",
									"Contraseña",
								)}
								onChange={handleChange}
								value={password}
							/>

							<FormFields
								label={t(
									"register.registerForm.confirmPassword.label",
									"Confirmar Contraseña",
								)}
								labelClassName="sr-only"
								id="confirm-password"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
								placeholder={t(
									"register.registerForm.confirmPassword.placeholder",
									"Confirmar contraseña",
								)}
								onChange={handleChange}
								value={confirmPassword}
							/>
						</div>

						<div>
							<Button
								type="submit"
								disabled={disabled}
								className="group text-text-on-accent bg-primary hover:bg-primary-dark focus:ring-primary focus:ring-offset-background-card relative flex w-full transform justify-center rounded-md border border-transparent px-4 py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.005] focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								{isSubmitting ? (
									<SpinnerLoadingText
										text={t(
											"register.registerForm.registerButton.spinner.loading",
											"Registrando",
										)}
									/>
								) : (
									t(
										"register.registerForm.registerButton.spinner.default",
										"Registrarse",
									)
								)}
							</Button>
						</div>
					</Form>
					<WithOtherServices />
				</div>
			</div>
		</Page>
	);
};

export default RegisterPage;
