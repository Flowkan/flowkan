import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deactivateUser } from "../../pages/login/service";
import { useLogoutAction } from "../../store/auth/hooks";

export const useDeleteAccount = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const logout = useLogoutAction();

	const handleDelete = async () => {
		const confirmed = window.confirm("¿Estás seguro de eliminar tu cuenta?");
		if (!confirmed) return;

		try {
			setLoading(true);
			await deactivateUser();
			localStorage.removeItem("auth");
			localStorage.clear();
			logout();
			navigate("/", { replace: true });
		} catch (err: unknown) {
			console.log(err)
			alert(err);
		} finally {
			setLoading(false);
		}
	};

	return { loading, handleDelete };
};
