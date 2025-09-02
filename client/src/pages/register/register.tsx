import { Page } from "../../components/layout/page";
import { NavLink, useNavigate } from "react-router-dom";
import type { User } from "./types";
import toast from "react-hot-toast";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CustomToast } from "../../components/CustomToast";
import { register } from "./service";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";

export const RegisterPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [formData, setFormData] = useState<User>({
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
		setFormData((prevData) => ({
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
		}

		try {
			await register(formData);

			toast.custom((t) => (
				<CustomToast
					message="Registro exitoso! Redirigiendo a la página de inicio de sesión."
					t={t}
					type="success"
				/>
			));

			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Ha ocurrido un error inesperado durante el registro.";
			toast.custom((t) => (
				<CustomToast message={errorMessage} t={t} type="error" />
			));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Page>
			<div className="bg-background-page flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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

					<form
						className="mt-8 space-y-6"
						onSubmit={handleSubmit}
						method="POST"
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

								<input
									id="photo"
									name="photo"
									type="file"
									accept="image/*"
									className="hidden"
									ref={fileRef}
									onChange={handleChange}
								/>
							</div>

							<div>
								<label htmlFor="full-name" className="sr-only">
									{t("register.registerForm.name.label", "Nombre Completo")}
								</label>
								<input
									id="full-name"
									name="name"
									type="text"
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
							</div>
							<div className="mt-3">
								<label htmlFor="email-address" className="sr-only">
									{t("register.registerForm.email.label", "Dirección de Email")}
								</label>
								<input
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
							</div>

							<div className="mt-3">
								<label htmlFor="password" className="sr-only">
									{t("register.registerForm.password.label", "Contraseña")}
								</label>
								<input
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
							</div>
							<div className="mt-3">
								<label htmlFor="confirm-password" className="sr-only">
									{t(
										"register.registerForm.confirmPassword.label",
										"Confirmar Contraseña",
									)}
								</label>
								<input
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
						</div>

						<div>
							<Button
								type="submit"
								disabled={disabled}
								className="group text-text-on-accent bg-primary hover:bg-primary-dark focus:ring-primary focus:ring-offset-background-card relative flex w-full transform justify-center rounded-md border border-transparent px-4 py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.005] focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								{isSubmitting
									? t(
											"register.registerForm.registerButton.loading",
											"Registrando...",
										)
									: t(
											"register.registerForm.registerButton.pending",
											"Registrarse",
										)}
							</Button>
						</div>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="border-border-light w-full border-t"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-background-card text-text-placeholder px-2">
								{t("register.registerForm.otherTypeRegister", "O continúa con")}
							</span>
						</div>
					</div>

					<div>
						<div className="mt-6 grid grid-cols-2 gap-3">
							<div>
								<Button
									type="button"
									className="border-border-light bg-background-card text-text-body hover:bg-background-light-grey inline-flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
								>
									<img
										src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
										alt="Google Logo"
										className="mr-2 h-5 w-5"
									/>
									Google
								</Button>
							</div>
							<div>
								<Button
									type="button"
									className="border-border-light bg-background-card text-text-body hover:bg-background-light-grey inline-flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
								>
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
										alt="GitHub Logo"
										className="mr-2 h-5 w-5"
									/>
									GitHub
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Page>
	);
};
