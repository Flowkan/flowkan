import type { ReactNode } from "react";

interface PageProps {
	title?: string;
	children: ReactNode;
	className?: string;
}
export const Page = ({ title = "", children, className = "" }: PageProps) => {
	return (
		<div className="mx-auto max-w-6xl px-4 py-4">
			<h1
				className={`title pb-5 text-center text-2xl font-medium ${className}`}
			>
				{title}
			</h1>
			{children}
		</div>
	);
};
