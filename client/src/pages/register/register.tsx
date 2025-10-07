import { Page } from "../../components/layout/page";
import { NavLink, useNavigate } from "react-router-dom";
import type { UserRegister } from "./types";
import toast from "react-hot-toast";
import {
	useCallback,
	useRef,
	useState,
	type ChangeEvent,
	type FocusEvent,
	type FormEvent,
} from "react";
import { CustomToast } from "../../components/CustomToast";
import { register } from "./service";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Form } from "../../components/ui/Form";
import { FormFields } from "../../components/ui/FormFields";
import { WithOtherServices } from "./withOtherServices/WithOtherServices";
import { SpinnerLoadingText } from "../../components/ui/Spinner";
import { __ } from "../../utils/i18nextHelper";
import Turnstile from "react-turnstile";
import { useValidationForm } from "../../hooks/useValidationForm";
import { validationForm } from "../../utils/validations";
import { RegisterFormSchema } from "../../utils/auth.schema";
import type z from "zod";

type RegisterForm = z.infer<typeof RegisterFormSchema>;

const RegisterPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [formData, setFormData] = useState<UserRegister>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		photo: null,
		turnstileResponse: "",
		reactivate: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { name, email, password, confirmPassword } = formData;
	const disabled =
		!name || !email || !password || !confirmPassword || isSubmitting;
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const registerValidator = useCallback(
		(data: unknown, fieldName?: keyof RegisterForm) => {
			return validationForm(RegisterFormSchema, data, fieldName);
		},
		[],
	);
	const { error, validate } =
		useValidationForm<RegisterForm>(registerValidator);

	const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
		validate(
			{
				name: formData.name,
				email: formData.email,
				password: formData.password,
				confirmPassword: formData.confirmPassword,
				photo: formData.photo,
			},
			e.target.name as keyof RegisterForm,
		);
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
		try {
			// Validaciones con zod
			const isValid = validate({
				name: formData.name,
				email: formData.email,
				password: formData.password,
				confirmPassword: formData.confirmPassword,
				photo: formData.photo,
			});
			if (!isValid) {
				setIsSubmitting(false);
				return;
			}

			const result = await register(formData);
			if (result.reactivate) {
				navigate("/login");
			} else {
				navigate("/verify-pending", {
					state: {
						email: formData.email,
					},
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.custom((t) => (
					<CustomToast
						message={__("register.registerForm.message.error")}
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
			<div
				className="bg-background-page flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 sm:px-6 lg:px-8"
				style={{
					backgroundImage: `url('/meta/fondo_formulario.png')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="bg-background-card w-full max-w-md transform space-y-8 rounded-xl p-10 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
					<div>
						<h1 className="text-text-heading mt-6 text-center text-4xl font-extrabold">
							{t("register.registerForm.title")}
						</h1>
						<p className="text-text-body mt-2 text-center text-sm">
							{t("register.registerForm.question")}
							<NavLink
								to="/login"
								className="text-text-link hover:text-accent-hover font-medium"
							>
								{" "}
								{t("register.registerForm.login")}
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
								label={t("register.registerForm.name.label")}
								labelClassName="sr-only"
								id="full-name"
								name="name"
								autoComplete="name"
								required
								className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
								placeholder={t("register.registerForm.name.placeholder")}
								onChange={handleChange}
								value={name}
								errors={error?.name}
								onBlur={handleBlur}
							/>

							<FormFields
								label={t("register.registerForm.email.label")}
								labelClassName="sr-only"
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
								placeholder={t("register.registerForm.email.placeholder")}
								onChange={handleChange}
								value={email}
								errors={error?.email}
								onBlur={handleBlur}
							/>

							<FormFields
								label={t("register.registerForm.password.label")}
								labelClassName="sr-only"
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
								placeholder={t("register.registerForm.password.placeholder")}
								onChange={handleChange}
								value={password}
								errors={error?.password}
								onBlur={handleBlur}
							/>

							<FormFields
								label={t("register.registerForm.confirmPassword.label")}
								labelClassName="sr-only"
								id="confirm-password"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								className="border-border-light placeholder-text-placeholder text-text-heading focus:ring-accent focus:border-accent relative block w-full appearance-none rounded-none border px-4 py-3 focus:z-10 focus:outline-none sm:text-sm"
								placeholder={t(
									"register.registerForm.confirmPassword.placeholder",
								)}
								onChange={handleChange}
								value={confirmPassword}
								errors={error?.confirmPassword}
								onBlur={handleBlur}
							/>
						</div>

						<div className="relative flex w-full justify-center">
							<Turnstile
								sitekey={import.meta.env.VITE_TURNSTILE_API_KEY}
								onVerify={(token) =>
									setFormData((prev) => ({
										...prev,
										turnstileResponse: token,
									}))
								}
								theme="light"
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
										)}
									/>
								) : (
									t("register.registerForm.registerButton.spinner.default")
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
