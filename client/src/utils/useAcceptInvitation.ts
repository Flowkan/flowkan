import { useEffect } from "react";
import { useAppSelector } from "../store";
import { useNavigate } from "react-router-dom";
import { acceptInvitation } from "../pages/boards/service";

export const useAcceptInvitation = () => {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("invitationToken");
		const boardId = localStorage.getItem("invitationBoardId");
		const invitationProcessed = localStorage.getItem("invitationProcessed");

		if (isAuthenticated && token && boardId && !invitationProcessed) {
			localStorage.setItem("invitationProcessed", "true");

			acceptInvitation(boardId, token)
				.then(() => {
					localStorage.removeItem("invitationToken");
					localStorage.removeItem("invitationBoardId");
					navigate(`/boards/${boardId}`, { replace: true });
				})
				.catch(() => {
					localStorage.removeItem("invitationToken");
					localStorage.removeItem("invitationBoardId");
					navigate("/boards", { replace: true });
				});
		}
	}, [isAuthenticated, navigate]);
};
