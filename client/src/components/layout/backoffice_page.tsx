import type { ReactNode } from "react";
import { randomColor } from "../../lib/randomColor";

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
	let generatedBg;
	if (location.pathname !== "/boards") {
		let bg;
		if (backgroundImg) {
			bg = backgroundImg;
		} else if (title) {
			bg = randomColor(title, true);
		} else {
			bg = undefined;
		}
		generatedBg = bg;
	} else {
		generatedBg = undefined;
	}
	return (
		<div
			className={`w-full min-h-screen ${className ?? ""}`}
			style={{
				background: backgroundImg
					? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0)), url(${import.meta.env.VITE_BASE_URL}${backgroundImg}_o.webp)`
					: generatedBg,
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
