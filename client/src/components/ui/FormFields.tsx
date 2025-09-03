import React, { useState } from "react";
import { EyeShow, EyeHide } from "./ShowOrHidePass";
import clsx from "clsx";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	name: string;
	label?: string;
	required?: boolean;
	labelClassName?: string;
	ref?: React.RefObject<HTMLInputElement | null>
}

export const FormFields = ({
	id,
	name,
	type = "text",
	label,
	required,
	labelClassName,
	value,
	onChange,
	ref,
	...props
}: InputProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";
	const inputType = isPassword ? (showPassword ? "text" : "password") : type;
	const { t } = useTranslation();

	return (
		<div className="mt-3">
			{label && (
				<label
					htmlFor={id}
					className={clsx("text-sm font-medium text-gray-800", labelClassName)}
				>
					{label}
					{required && <span className="text-red-600"> *</span>}
				</label>
			)}
			<div className="relative mt-3">
				<input
					id={id}
					name={name}
					type={inputType}
					value={value}
					ref={ref}
					onChange={onChange}
					required={required}
					className={clsx(
						"w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none",
						isPassword && "pr-10",
					)}
					{...props}
				/>
				{isPassword && (
					<Button
						type="button"
						className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
						onClick={() => setShowPassword(!showPassword)}
						aria-label={
							showPassword
								? t(
										"arialabels.component.FormFields.hidePass",
										"Ocultar contraseña",
									)
								: t(
										"arialabels.component.FormFields.showPass",
										"Mostrar contraseña",
									)
						}
						title={
							showPassword
								? t(
										"arialabels.component.FormFields.hidePass",
										"Ocultar contraseña",
									)
								: t(
										"arialabels.component.FormFields.showPass",
										"Mostrar contraseña",
									)
						}
					>
						{showPassword ? <EyeHide /> : <EyeShow />}
					</Button>
				)}
			</div>
		</div>
	);
};
