import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deactivateUser } from "../../pages/login/service";
import { useLogoutAction } from "../../store/auth/hooks";

export const useDeleteAccount = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const logout = useLogoutAction();

	const handleDelete = async () => {
		try {
			setLoading(true);
			await deactivateUser();
			localStorage.removeItem("auth");
			localStorage.clear();
			logout();
			navigate("/", { replace: true });
			return true;
		} catch (err: unknown) {
			if (err instanceof Error)
				console.error("Hubo un error al eliminar la cuenta.");
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { loading, handleDelete };
};
