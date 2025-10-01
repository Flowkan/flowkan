import type { ReactNode } from "react";
import { randomColor } from "../../lib/randomColor";
import { BoardToolbar } from "./BoardToolbar";
import { useParams, useLocation } from "react-router-dom";
import { useBoards } from "../../store/boards/hooks";
import { useState, useEffect } from "react";
import { getContrastColor } from "../../utils/contrastColor";

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
	const { slug } = useParams<{ slug: string }>();
	const allBoards = useBoards();
	const location = useLocation();
	const [boardId, setBoardId] = useState("");

	useEffect(() => {
		if (allBoards.length > 0 && slug) {
			const foundBoard = allBoards.find((b) => b.slug === slug);
			if (foundBoard) {
				setBoardId(foundBoard.id.toString());
			}
		}
	}, [allBoards, slug]);

	let generatedBg;
	if (location.pathname !== "/boards") {
		generatedBg =
			backgroundImg || (title ? randomColor(title, true) : undefined);
	} else {
		generatedBg = undefined;
	}

	const isBoardPage = boardId.length > 0;

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
			{isBoardPage && (
				<div className="flex w-full bg-white/45">
					<BoardToolbar boardId={boardId} image={backgroundImg} />
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
