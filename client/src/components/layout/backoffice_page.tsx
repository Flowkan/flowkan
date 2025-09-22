import type { ReactNode } from "react";

interface BackofficePageProps {
	title?: string;
	children: ReactNode;
	className?: string;
}

export const BackofficePage = ({
	title,
	children,
	className,
}: BackofficePageProps) => {
	return (
		<div className={`w-full ${className ?? ""}`}>
			{title && <h1 className="mb-4 text-2xl font-bold">{title}</h1>}
			{children}		
		</div>
	);
};
