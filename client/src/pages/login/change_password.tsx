import { t } from "i18next";
import IconLogo from "../../components/icons/IconLogo";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { validationForm } from "../../utils/validations";
import { NewPasswordSchema } from "../../utils/auth.schema";
import { changePassword } from "./service";
import { FormFields } from "../../components/ui/FormFields";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CustomToast } from "../../components/CustomToast";
import { __ } from "../../utils/i18nextHelper";
import { AxiosError } from "axios";

const ChangePassword = () => {
	const [passwords, setPasswords] = useState({
		password: "",
		confirmPassword: "",
	});
	const [errorsForm, setErrorsForm] = useState<{
		[k in keyof typeof passwords]?: string[];
	}>({});

	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();

	const { password, confirmPassword } = passwords;
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const prevPass = { ...passwords };
		setPasswords({ ...prevPass, [e.target.name]: e.target.value });
	}
	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const { error, data } = validationForm(NewPasswordSchema, passwords);
		if (error) {
			setErrorsForm(error.errorsList);
			return;
		}
		if (!token) {
			return navigate("/login", { replace: true });
		}
		try {
			const { message } = await changePassword(data.password, token);
			navigate("/login", { replace: true });
			toast.custom((t) => (
				<CustomToast
					message={__("login.change_password.toast.message.success", message)}
					t={t}
					type="success"
				/>
			));
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = error.response?.data.error ?? "";
				toast.custom((t) => (
					<CustomToast
						message={__("login.change_password.toast.message.error", message)}
						t={t}
						type="error"
					/>
				));
			}
		}
	}
	return (
		<div className="flex min-h-[calc(100vh-638px)] w-full md:min-h-[calc(100vh-351px)]">
			<div className="h-h-full flex w-full items-center justify-center p-6">
				<form
					onSubmit={handleSubmit}
					className="flex w-[80%] flex-col gap-4 rounded-lg border-white bg-black/25 p-5 shadow-2xl drop-shadow-lg backdrop-blur-md md:w-[40%]"
				>
					<div className="flex flex-col items-center justify-center py-5">
						<div className="flex">
							<IconLogo width={120} height={40} className="h-auto w-24" />
						</div>
						<h2 className="text-lg font-semibold text-zinc-300 md:text-xl">
							{t("recoveryPassword.form.title")}
						</h2>
					</div>
					<div className="flex flex-col gap-2">
						<FormFields
							value={password}
							label={t("recoveryPassword.form.field.newPassword")}
							labelClassName="text-xs font-thin tracking-tight text-gray-100"
							name="password"
							onChange={handleChange}
							className={`text-md w-full rounded-lg border bg-black/5 p-2 text-gray-300 backdrop-blur-2xl transition-all duration-300 hover:bg-black/20 ${errorsForm.password ? "border-red-500 placeholder:text-red-300 focus:outline-2 focus:outline-red-500" : ""} `}
							type="password"
							id="password-1"
						/>
						<ul className="px-1 text-xs text-red-600">
							{errorsForm.password &&
								errorsForm.password.map((err) => <li key={err}>{err}</li>)}
						</ul>
					</div>
					<div className="flex flex-col gap-2">
						<FormFields
							label={t("recoveryPassword.form.field.confirmPassword")}
							labelClassName="text-xs font-thin tracking-tight text-gray-100"
							value={confirmPassword}
							name="confirmPassword"
							onChange={handleChange}
							className={`text-md w-full rounded-lg border bg-black/5 p-2 text-gray-300 backdrop-blur-2xl transition-all duration-300 hover:bg-black/20 ${errorsForm.confirmPassword ? "border-red-500 placeholder:text-red-300 focus:outline-2 focus:outline-red-500" : ""} `}
							type="password"
							id="password-2"
						/>
						<ul className="px-1 text-xs text-red-600">
							{errorsForm.confirmPassword &&
								errorsForm.confirmPassword.map((err) => (
									<li key={err}>{err}</li>
								))}
						</ul>
					</div>
					<div className="flex flex-col">
						<input
							className="bg-primary hover:bg-primary-hover cursor-pointer rounded-2xl px-4 py-3 text-xs font-thin tracking-wide text-gray-100 transition-colors duration-300"
							type="submit"
							value={t("recoveryPassword.save")}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChangePassword;
