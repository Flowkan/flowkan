import { Link } from "react-router-dom";
import { Page } from "../components/layout/page";
import { useTranslation } from "react-i18next";

export const NotFound = () => {
	const { t } = useTranslation();

	return (
		<Page>
			<div className="bg-background-page flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="bg-background-card w-full max-w-md space-y-8 rounded-xl p-10 text-center shadow-2xl">
					<h1 className="text-primary text-8xl font-extrabold tracking-tight">
						404
					</h1>
					<p className="text-text-heading mt-4 text-3xl font-bold">
						{t("notFound.title", "Página no encontrada")}
					</p>
					<p className="text-text-body mt-2 text-lg">
						{t("notFound.description", "Lo sentimos, no pudimos encontrar la página que buscas")}.
					</p>

					<div className="mt-8">
						<Link
							to="/"
							className="text-text-on-accent bg-accent hover:bg-accent-hover focus:ring-accent focus:ring-offset-background-card inline-flex transform items-center justify-center rounded-md border border-transparent px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.005] focus:ring-2 focus:ring-offset-2 focus:outline-none"
						>
							{t("notFound.backButton", "Volver a inicio")}
						</Link>
					</div>
				</div>
			</div>
		</Page>
	);
};