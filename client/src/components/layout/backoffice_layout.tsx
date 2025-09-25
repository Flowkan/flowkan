import { Outlet, useParams, useLocation } from "react-router-dom";
import { BoardToolbar } from "./BoardToolbar";
import { BackofficeHeader } from "./backoffice_header";
import { useBoards } from "../../store/boards/hooks";
import { useEffect, useState } from "react";

export function BackofficeLayout() {
	const { slug } = useParams<{ slug: string }>();
	const location = useLocation();
	const [boardId,setBoardId] = useState('')
	const [isBoardPage,setIsBoardPage] = useState(false)
	const allBoards = useBoards();

	useEffect(()=>{
		// let boardId;
		if (allBoards.length > 0) {
			const foundBoard = allBoards.find((b) => b.slug === slug);

			if (foundBoard) {
				// boardId = foundBoard.id.toString();
				setBoardId(foundBoard.id.toString())
			}
		}
	},[allBoards,slug])

	useEffect(()=>{
		if(location.pathname.startsWith("/boards/")){
			setIsBoardPage(true)
		}
	},[location])
	

	

	return (
		<div className="flex min-h-screen flex-col">
			<BackofficeHeader />

			{isBoardPage && (
				<BoardToolbar
					boardId={boardId}
				/>
			)}

			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
