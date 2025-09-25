import clsx from "clsx";
import type { ReactNode } from "react";

interface PageProps {
	title?: string;
	children: ReactNode;
	className?: string;
}
export const Page = ({ title, children, className }: PageProps) => {
	return (
		<div className="page-container mx-auto max-w-6xl">
			<h1
				className={clsx(
					"title pb-5 text-center text-2xl font-medium",
					className,
				)}
			>
				{clsx(title)}
			</h1>
			{children}
		</div>
	);
};

/* COMO ESTABA ANTES:
export const Page = ({ title = "", children, className = "" }: PageProps) => {
	return (
		<div className="page-container mx-auto max-w-6xl px-4 py-4">
			{title && (
				<h1
					className={`title pb-5 text-center text-2xl font-medium ${className}`}
				>
					{title}
				</h1>
			)}
			{children}
		</div>
	);
}; */
