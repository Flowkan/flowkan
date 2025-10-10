import { type ReactNode } from "react";
import { randomColor } from "../../lib/randomColor";
import { BoardToolbar } from "./BoardToolbar";
import { getContrastColor } from "../../utils/contrastColor";

interface ColumnMin {
	id: number | string;
	title: string;
}
interface BackofficePageProps {
	title?: string;
	children: ReactNode;
	className?: string;
	backgroundImg?: string;
	boardId?: string | null;
	onAddTask?: (columnId: number, title: string, description: string) => void;
	columns?: ColumnMin[];
}

export const BackofficePage = ({
	title,
	children,
	className,
	backgroundImg,
	boardId,
	onAddTask,
	columns,
}: BackofficePageProps) => {
	let generatedBg;
	if (boardId) {
		generatedBg =
			backgroundImg || (title ? randomColor(title, true) : undefined);
	} else {
		generatedBg = undefined;
	}

	let colorToContrast: string;

	if (backgroundImg) {
		colorToContrast = "000000";
	} else if (generatedBg?.startsWith("#")) {
		colorToContrast = generatedBg.slice(1);
	} else {
		colorToContrast = "ffffff";
	}

	const colorText = getContrastColor(colorToContrast);

	return (
		<div
			className={`min-h-screen w-full ${className ?? ""}`}
			style={{
				backgroundImage: backgroundImg
					? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0)), url(${import.meta.env.VITE_BASE_URL}${backgroundImg}_o.webp)`
					: generatedBg,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			{boardId && (
				<div className="flex w-full bg-white/45">
					<BoardToolbar
						boardId={boardId}
						image={backgroundImg}
						onAddTask={onAddTask}
						columns={columns}
					/>
				</div>
			)}
			{title && (
				<h1
					className={`mb-2 pt-2 text-center text-2xl font-bold text-${colorText}`}
				>
					{title}
				</h1>
			)}
			{children}
		</div>
	);
};
