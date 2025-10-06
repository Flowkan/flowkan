import { useEffect, useState } from "react";
import { t } from "i18next";

interface SpinnerProps {
	text?: string;
	className?: string;
}

export const SpinnerLoadingText = ({
	text = t("spinner.general"),
	className = "text-gray-700",
}: SpinnerProps) => {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length < 3 ? prev + "." : ""));
		}, 500);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className={`flex items-center justify-center ${className}`}>
			<svg
				className="mr-2 -ml-1 h-6 w-6 animate-spin text-blue-600"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<span className={`text-md font-medium${className}`}>
				{text}
				<span className={`text-md inline-block animate-pulse ${className}`}>
					{dots}
				</span>
			</span>
		</div>
	);
};
