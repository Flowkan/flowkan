import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/page";
import React from "react";
import { Link } from "react-router-dom";

// Definición de la interfaz para la estructura de las características
interface FeatureItem {
	key: string; // Clave para la traducción
	icon: React.ReactNode; // Elemento SVG del icono
	iconClasses: {
		circle: string; // Clase de fondo para el círculo (ej: bg-accent-lightest)
		svg: string; // Clase de color para el SVG (ej: text-accent)
	};
}

export const FeaturesPage: React.FC = () => {
	const { t } = useTranslation();

	// 💡 He reutilizado algunos iconos que ya tenías en la HomePage
	const featuresData: FeatureItem[] = [
		{
			key: "kanban",
			icon: (
				<svg fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.586-1.586A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L5.707 6.293A1 1 0 015 6.586V7a2 2 0 00-2 2zm0 2h12v8H4V7z"
						clipRule="evenodd"
					></path>
					<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-accent-lightest",
				svg: "text-accent",
			},
		},
		{
			key: "realTime",
			icon: (
				<svg fill="currentColor" viewBox="0 0 20 20">
					<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17.66 14.93A8.995 8.005 0 0112 18c-.015 0-.029-.001-.044-.001-.383 0-.761-.019-1.139-.06a.75.75 0 01-.767-.681.75.75 0 01.68-.767c.307-.03 1.054-.052 1.25-.052.128 0 .256.007.384.02a8.987 8.987 0 006.182-3.816.75.75 0 011.23.966zM12 12a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1zM6 10a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z"></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-primary-lightest",
				svg: "text-primary",
			},
		},
		{
			key: "progress",
			icon: (
				<svg fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clipRule="evenodd"
					></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-success-lightest",
				svg: "text-success",
			},
		},
		{
			key: "automation",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M12.586 4.586a2 2 0 102.828 2.828l3.12-3.12-2.828-2.828-3.12 3.12zM2 10a8 8 0 1116 0H2zm-1 0a9 9 0 1118 0H1z"
						clipRule="evenodd"
					></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-info-lightest",
				svg: "text-info",
			},
		},
		{
			key: "templates",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM5 10a1 1 0 00-1 1v2a1 1 0 001 1h10a1 1 0 001-1v-2a1 1 0 00-1-1H5zM6 15a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z"></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-warning-lightest",
				svg: "text-warning",
			},
		},
		{
			key: "calendar",
			icon: (
				<svg fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
						clipRule="evenodd"
					></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-secondary-lightest", // Asumiendo una clase 'secondary' o usando 'primary'
				svg: "text-secondary",
			},
		},
		{
			key: "mobile",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
						clipRule="evenodd"
					></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-info-lightest",
				svg: "text-info",
			},
		},
		{
			key: "files",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h7a1 1 0 001-1V7.414l-2.586-2.586A1 1 0 0010 4.586V4a1 1 0 00-1-1H6z"
						clipRule="evenodd"
					></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-success-lightest",
				svg: "text-success",
			},
		},
	];

	return (
		<Page>
			<main className="bg-background-page text-text-heading flex-grow">
				<section className="from-accent to-primary-dark text-shadow-text-body relative overflow-hidden bg-gradient-to-br px-6 py-20 md:px-12">
					<div className="relative z-10 mx-auto max-w-7xl text-center">
						<h1 className="mb-4 text-4xl leading-tight font-extrabold md:text-5xl">
							{t(
								"features.banner.title",
								"Todo lo que Necesitas para Trabajar Mejor",
							)}
						</h1>
						<p className="mb-8 text-xl font-light md:text-2xl">
							{t(
								"features.banner.subtitle",
								"Desde la colaboración en tiempo real hasta la automatización, centralizamos tu flujo de trabajo.",
							)}
						</p>
						<Link
							to="/register"
							className="bg-primary text-text-on-accent hover:bg-primary-dark transform rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition duration-300 hover:scale-105"
						>
							{t("features.banner.cta", "Empezar a Organizar Ahora")} &rarr;
						</Link>
					</div>

					{/* Las burbujas de fondo animadas (Estilo Home) */}
					<div className="absolute top-0 left-0 z-0 h-full w-full opacity-20">
						<div className="bg-accent-light animate-blob absolute -top-16 -left-16 h-64 w-64 rounded-full opacity-70 mix-blend-multiply blur-xl filter"></div>
						<div className="bg-primary-light animate-blob animation-delay-2000 absolute right-0 -bottom-20 h-64 w-64 rounded-full opacity-70 mix-blend-multiply blur-xl filter"></div>
					</div>
				</section>

				{/* --- */}

				{/* Sección de Cards de Características Detalladas */}
				<section className="bg-background-light-grey px-6 py-20 md:px-12">
					<div className="mx-auto max-w-7xl">
						<h2 className="text-text-heading mb-16 text-center text-3xl font-bold md:text-4xl">
							{t("features.main.title", "Funcionalidades Clave de Flowkan")}
						</h2>

						{/* Grid de Características (2 columnas en tablet, 3 en desktop) */}
						<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
							{featuresData.map((feature) => (
								<div
									key={feature.key}
									className="bg-background-card flex transform flex-col items-center rounded-lg p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
								>
									<div
										className={`${feature.iconClasses.circle} mb-6 rounded-full p-4`}
									>
										<div className={`${feature.iconClasses.svg} h-10 w-10`}>
											{feature.icon}
										</div>
									</div>
									<h3 className="text-text-heading mb-3 text-center text-xl font-bold">
										{t(`features.list.${feature.key}.title`, feature.key)}
									</h3>
									<p className="text-text-body text-center">
										{t(
											`features.list.${feature.key}.description`,
											"Descripción detallada de la característica.",
										)}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* --- */}

				{/* Sección de CTA al final (Estilo Home Docs) */}
				<section className="bg-background-page px-6 py-20 md:px-12">
					<div className="mx-auto max-w-4xl max-w-7xl text-center">
						<h2 className="text-text-heading mb-4 text-3xl font-bold md:text-4xl">
							{t(
								"features.cta.title",
								"Listos para Transformar tu Productividad?",
							)}
						</h2>
						<p className="text-text-body mb-8 text-lg">
							{t(
								"features.cta.subtitle",
								"Crea tu primer tablero en solo unos minutos. Sin necesidad de tarjeta de crédito.",
							)}
						</p>
						<Link
							to="/register"
							className="bg-accent text-text-on-accent hover:bg-accent-dark transform rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition duration-300 hover:scale-105"
						>
							{t("features.cta.button", "Comenzar Gratis Hoy Mismo")} &rarr;
						</Link>
					</div>
				</section>
			</main>
		</Page>
	);
};
