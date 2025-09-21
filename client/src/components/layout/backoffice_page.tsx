import type { ReactNode } from "react";

interface BackofficePageProps {
	title?: string;
	children: ReactNode;
	className?: string;
	backgroundImg?: string;
}

export const BackofficePage = ({
	title,
	children,
	className,
	backgroundImg,
}: BackofficePageProps) => {
	return (
		<div
			className={`w-full ${className ?? ""}`}
			style={{
				backgroundImage: backgroundImg
					? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0)), url(${backgroundImg}_o.webp)`
					: undefined,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			{title && <h1 className="mb-4 text-2xl font-bold">{title}</h1>}
			{children}
		</div>
	);
};
