import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
	children,
	className,
	variant,
	disabled,
	onClick,
	...props
}) => {
	return (
		<button
			className={clsx(`btn-${variant}`, className, {
				"cursor-not-allowed opacity-50": disabled,
				"cursor-pointer": !disabled,
			})}
			disabled={disabled}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	);
};
