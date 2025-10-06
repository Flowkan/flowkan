import React, { useState } from "react";
import { EyeShow, EyeHide } from "./ShowOrHidePass";
import clsx from "clsx";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";
import { IconCheck } from "../icons/IconCheck";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	name: string;
	label?: string;
	required?: boolean;
	labelClassName?: string;
	inputClassName?: string;
	ref?: React.RefObject<HTMLInputElement | null>;
	className?: string;
	errors?: string[];
	fieldApproved?: boolean;
}

export const FormFields = ({
	id,
	name,
	type = "text",
	label,
	required,
	labelClassName,
	inputClassName,
	value,
	onChange,
	ref,
	errors = [],
	fieldApproved = false,
	className = "",
	...props
}: InputProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";
	const inputType = isPassword ? (showPassword ? "text" : "password") : type;
	const { t } = useTranslation();
	const cleanErrors = !Array.isArray(errors) ? [] : errors;
	const hasError = cleanErrors.length > 0;
	const defaultStyleInput =
		"w-full rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none";
	return (
		<div>
			{label && (
				<label
					htmlFor={id}
					className={clsx("text-sm font-medium text-gray-800", labelClassName)}
				>
					{label}
					{required && <span className="text-red-600"> *</span>}
				</label>
			)}
			<div className={clsx("relative mt-3", inputClassName)}>
				<input
					id={id}
					name={name}
					type={inputType}
					value={value}
					ref={ref}
					onChange={onChange}
					required={required}
					className={clsx(
						"transition-all duration-300",
						isPassword && "pr-10",
						className ? className : defaultStyleInput,
						hasError &&
							"border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400",
						fieldApproved ? "border-emerald-500" : "",
					)}
					{...props}
				/>
				{isPassword && (
					<Button
						type="button"
						className={clsx(
							"absolute top-1/2 right-3 z-10 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600",
							hasError ? "text-red-400 hover:text-red-600" : "",
						)}
						onClick={() => setShowPassword(!showPassword)}
						aria-label={
							showPassword
								? t("arialabels.component.FormFields.hidePass")
								: t("arialabels.component.FormFields.showPass")
						}
						title={
							showPassword
								? t("arialabels.component.FormFields.hidePass")
								: t("arialabels.component.FormFields.showPass")
						}
					>
						{showPassword ? <EyeHide /> : <EyeShow />}
					</Button>
				)}
				{fieldApproved && !hasError && (
					<div
						className={clsx(
							"absolute top-[50%] z-10 translate-y-[-50%]",
							isPassword ? "right-9" : "right-2",
						)}
					>
						<IconCheck className="text-emerald-500" />
					</div>
				)}
			</div>
			<ul
				className={clsx(
					"px-1 text-xs text-red-600 transition-opacity duration-400",
					hasError ? "opacity-100" : "opacity-0",
				)}
			>
				{cleanErrors.length > 0 &&
					cleanErrors.map((err) => <li key={err}>{err}</li>)}
			</ul>
		</div>
	);
};
