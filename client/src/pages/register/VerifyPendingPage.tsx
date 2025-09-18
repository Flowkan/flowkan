import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

const LOGIN_ROUTE = "/login";

export const VerifyPendingPage: React.FC = () => {
	const { t } = useTranslation();
	const location = useLocation();

	const userEmail =
		location.state?.email ||
		t("verifyPending.noEmailFound", "info@example.com");

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6">
			<div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl">
				<div className="text-center">
					<Icon
						icon="lucide:mail"
						className="mx-auto h-12 w-12 text-blue-600"
					/>

					<h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900">
						{t("verifyPending.title", "Verifica tu Correo Electrónico")}
					</h1>
				</div>

				<div className="text-center">
					<p className="text-lg text-gray-600">
						{t("verifyPending.success", "¡Registro exitoso!")}
					</p>
					<p className="mt-2 text-xl font-medium text-blue-700">
						{t(
							"verifyPending.emailSent",
							"Te hemos enviado un email para validar tu cuenta.",
						)}
					</p>
				</div>

				<div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
					<div className="flex items-start">
						<Icon
							icon="lucide:shield-check"
							className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600"
						/>
						<div className="ml-3 text-left">
							<p className="font-semibold">
								{t("verifyPending.actionRequired", "Acción Requerida:")}
							</p>
							<p className="mt-1">
								{t(
									"verifyPending.instruction1",
									"Haz clic en el enlace de confirmación dentro del correo electrónico que enviamos a:",
								)}
								<br />
								<strong className="break-all text-blue-800">{userEmail}</strong>
							</p>
							<p className="mt-2">
								{t(
									"verifyPending.instruction2",
									"¿No lo encuentras? Revisa tu carpeta de spam o correo no deseado.",
								)}
							</p>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<NavLink
						to={LOGIN_ROUTE}
						className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-gray-800 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:outline-none"
					>
						<Icon
							icon="lucide:corner-down-right"
							className="h-5 w-5 text-gray-300 transition-transform duration-150 ease-in-out group-hover:translate-x-1"
						/>
						<span className="ml-2">
							{t("verifyPending.goToLogin", "Entendido, ir a Iniciar Sesión")}
						</span>
					</NavLink>
				</div>
			</div>
		</div>
	);
};
