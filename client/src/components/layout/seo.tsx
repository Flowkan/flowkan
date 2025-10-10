import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export const Seo: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Helmet>
			<meta
				name="description"
				content={t(
					"html.descriptionKey",
					"Colabora con tu equipo en un solo lugar. Con nuestros tableros Kanban, centraliza tareas, optimiza flujos de trabajo y aumenta la productividad.",
				)}
			/>
			<meta
				property="og:description"
				content={t(
					"html.descriptionKey",
					"Colabora con tu equipo en un solo lugar. Con nuestros tableros Kanban, centraliza tareas, optimiza flujos de trabajo y aumenta la productividad.",
				)}
			/>
			<meta
				property="og:image:alt"
				content={t(
					"html.imageAlt",
					"Flowkan - Tablero de gestión de proyectos.",
				)}
			/>
			<meta property="og:locale" content={t("html.lang", "es_ES")} />
		</Helmet>
	);
};
