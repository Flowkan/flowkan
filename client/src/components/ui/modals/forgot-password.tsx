import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type ComponentProps,
	type FormEvent,
} from "react";
import { FormFields } from "../FormFields";
import { IconCancel } from "../../icons/IconCancel";
import { resetPassword } from "../../../pages/login/service";
import { validationForm } from "../../../utils/validations";
import type { FormSendEmail } from "../../../pages/login/types";
import { ForgotPasswordSchema } from "../../../utils/auth.schema";
import toast from "react-hot-toast";
import { CustomToast } from "../../CustomToast";
import { __ } from "../../../helpers/i18nextHelper";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

interface ForgotPasswordProps
	extends Omit<ComponentProps<"dialog">, "ref" | "onSubmit"> {
	show?: boolean;
	onClose?: () => void;
}

const ForgotPassword = ({
	onClose,
	show = false,
	...props
}: ForgotPasswordProps) => {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [errorsForm, setErrorsForm] = useState<{
		[k in keyof FormSendEmail]?: string[];
	}>({});
	const modalForgotPassword = useRef<HTMLDialogElement | null>(null);
	const inputEmail = useRef<HTMLInputElement>(null);
	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const { error, data } = validationForm(ForgotPasswordSchema, { email });
		if (error) {
			setErrorsForm(error.errorsList);
			return;
		}
		try {
			const { message } = await resetPassword(data.email);
			handleClose();
			toast.custom((t) => (
				<CustomToast
					message={__("login.forgot_password.toast.message.success", message)}
					t={t}
					type="success"
				/>
			));
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = error.response?.data.error ?? "";
				toast.custom((t) => (
					<CustomToast
						message={__("login.forgot_password.toast.message.error", message)}
						t={t}
						type="error"
					/>
				));
				handleClose();
			}
		}
	}
	function handleClose() {
		if (onClose) {
			onClose();
			setEmail("");
			setErrorsForm({});
		}
	}
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setEmail(e.target.value);
	}
	useEffect(() => {
		if (show) {
			modalForgotPassword.current?.showModal();
			inputEmail.current?.focus();
		} else {
			modalForgotPassword.current?.close();
		}
	}, [show]);
	useEffect(() => {
		const modal = modalForgotPassword.current;
		function handleKeyUp(e: KeyboardEvent) {
			if (e.key === "Escape") {
				if (onClose) {
					onClose();
				}
			}
		}
		if (modal) {
			modal.addEventListener("keydown", handleKeyUp);
		}
		return () => {
			modal?.removeEventListener("keydown", handleKeyUp);
		};
	}, [onClose]);
	return (
		<dialog
			className={`backdrop:from-primary/10 shadow-accent/60 m-auto rounded-md bg-zinc-100/40 shadow-2xl backdrop-blur-3xl backdrop:pointer-events-none backdrop:bg-gradient-to-b backdrop:to-transparent backdrop:backdrop-blur-xl`}
			ref={modalForgotPassword}
			{...props}
		>
			<div className="w-[80vw] rounded-lg md:w-[40dvw]">
				<div className="bg-accent-hover/60 flex items-center justify-between px-3 py-4 backdrop-blur-3xl">
					<p className="text-lg font-thin tracking-wide text-white">
						{t("forgotPsw.recover")}
					</p>
					<button
						className="hover:bg-accent cursor-pointer rounded-md p-2 transition-colors duration-300"
						type="button"
						onClick={handleClose}
					>
						<IconCancel className="stroke-white text-white" />
					</button>
				</div>
				<form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
					<div className="flex-1">
						<label className="text-lg font-bold" htmlFor="forgot-password">
							{t("forgotPsw.email")}
						</label>
						<FormFields
							type="email"
							name="forgot-password"
							id="forgot-password"
							className={`border-accent text-md focus:outline-accent inline-block w-full flex-1 rounded-lg border p-2 tracking-wide focus:outline-2 ${errorsForm.email ? "border-red-500 placeholder:text-red-300 focus:outline-2 focus:outline-red-500" : ""} `}
							placeholder={t("forgotPsw.email")}
							value={email}
							onChange={handleChange}
							ref={inputEmail}
						/>
						<ul className="px-1 pt-1 text-xs text-red-600">
							{errorsForm.email?.map((err) => (
								<li key={err}>{err}</li>
							))}
						</ul>
					</div>
					<div className="flex gap-2">
						<input
							className="bg-primary hover:bg-primary-hover cursor-pointer rounded-lg px-4 py-2 text-white transition-colors duration-300"
							type="submit"
							value={t("forgotPsw.send")}
						/>
						<button
							className="bg-accent hover:bg-accent-hover cursor-pointer rounded-lg px-4 py-2 text-white transition-colors duration-300"
							type="button"
							onClick={handleClose}
						>
							{t("forgotPsw.cancel")}
						</button>
					</div>
				</form>
			</div>
		</dialog>
	);
};

export default ForgotPassword;
