import React, { useRef, useCallback } from "react";
import { useDismiss } from "../hooks/useDismissClickAndEsc";
import { Button } from "./ui/Button";

interface DropdownMenuProps {
	children: React.ReactNode;
	buttonContent: React.ReactNode;
	position?: "left" | "right";
	onClose?: () => void;
	title?: string;
	closeButton?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
	children,
	buttonContent,
	position = "right",
	onClose,
	title,
	closeButton = false,
}) => {
	const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const toggleMenu = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setOpen((prev) => !prev);
	}, []);

	const menuClasses = position === "right" ? "right-0" : "left-0";

	return (
		<div className="relative z-20 inline-block text-left">
			<button
				ref={buttonRef}
				type="button"
				className="text-text-placeholder hover:text-text-body hover:bg-background-hover-card focus:ring-accent rounded-full px-2 py-0.5 text-2xl leading-none transition-colors duration-200 focus:ring-2 focus:outline-none"
				onClick={toggleMenu}
				aria-expanded={open}
				aria-haspopup="true"
				title="Opciones"
			>
				{buttonContent}
			</button>

			{open && (
				<div
					ref={ref}
					className={`bg-background-dark-footer text-background-card absolute origin-top-right ${menuClasses} bg-background-card ring-border-medium ring-opacity-5 animate-fade-in-down mt-2 w-72 rounded-md shadow-lg ring-1 focus:outline-none`}
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
					tabIndex={-1}
				>
					{title && (
						<div className="border-border-medium flex items-center justify-between border-b p-3">
							<span className="text-background-card text-sm font-semibold">
								{title}
							</span>
							{closeButton && (
								<Button
									onClick={onClose}
									className="text-text-placeholder hover:text-danger-dark text-xl leading-none"
									title="Cerrar menú"
								>
									&times;
								</Button>
							)}
						</div>
					)}
					<div className="py-1" role="none">
						{children}
					</div>
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
