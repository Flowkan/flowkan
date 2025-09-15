import { useState } from "react";
import ShareBoard from "../ui/modals/share-board";
import type { Board } from "../../pages/boards/types";

interface BoardToolbarProps {
	readonly board: Board;
}

export function BoardToolbar({ board }: BoardToolbarProps) {
	const [showShareForm, setShowShareForm] = useState(false);

	const handleShowShareForm = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowShareForm(true);
	};

	const handleCloseShareForm = () => setShowShareForm(false);

	return (
		<>
			{/* Barra de opciones */}
			<div className="flex items-center border-b border-gray-300 bg-gray-100 px-4 py-2">
				<div className="ml-auto flex items-center gap-2">
					<button
						onClick={handleShowShareForm}
						className="bg-primary hover:bg-primary-hover rounded px-3 py-1 text-white"
					>
						Compartir
					</button>
				</div>
			</div>

			{/* Modal de compartir */}
			{showShareForm && (
				<ShareBoard board={board} handleHideMessage={handleCloseShareForm} />
			)}
		</>
	);
}
