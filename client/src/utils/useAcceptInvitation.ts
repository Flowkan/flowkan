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
		const boardSlug = localStorage.getItem("invitationBoardSlug");

		if (isAuthenticated && token && boardId && boardSlug) {
			acceptInvitation(boardId, token)
				.then(() => {
					navigate(`/boards/${boardSlug}`, { replace: true });
				})
				.catch(() => {
					navigate("/boards", { replace: true });
				})
				.finally(() => {
					localStorage.removeItem("invitationToken");
					localStorage.removeItem("invitationBoardId");
					localStorage.removeItem("invitationBoardSlug");
				});
		}
	}, [isAuthenticated, navigate]);
};
