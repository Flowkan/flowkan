import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmEmail } from "./service";
import { useTranslation } from "react-i18next";

export const ConfirmPage = () => {
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);
	const [message, setMessage] = useState("");
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const token = searchParams.get("token");

	useEffect(() => {
		if (!token) {
			setStatus("error");
			setMessage(t("registerconfirm.error.token", "Token no proporcionado"));
			return;
		}

		confirmEmail(token)
			.then(() => {
				setStatus("success");
				setMessage(t("registerconfirm.ok", "Cuenta confirmada correctamente!"));
				setTimeout(() => navigate("/login"), 3000);
			})
			.catch((err) => {
				setStatus("error");
				setMessage(
					err.response?.data?.message ||
						t(
							"registerconfirm.error.confirm",
							"Ocurrió un error al confirmar la cuenta",
						),
				);
			});
	}, [navigate, token]);

	return (
		<div className="confirm-page">
			{status === "loading" && (
				<p>{t("registerconfirm.loading", "Confirmando cuenta...")}</p>
			)}
			{status === "success" && <p>{message}</p>}
			{status === "error" && <p style={{ color: "red" }}>{message}</p>}
		</div>
	);
};
