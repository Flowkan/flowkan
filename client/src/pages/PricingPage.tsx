import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/page";
import React from "react";
import { Link } from "react-router-dom";

export const PricingPage: React.FC = () => {
	const { t } = useTranslation();

	const features = [
		t("pricing.feature1", "Tableros Ilimitados"),
		t("pricing.feature2", "Colaboradores Ilimitados"),
		t("pricing.feature3", "Arrastrar y Soltar"),
		t("pricing.feature4", "Adjuntos Ilimitados"),
		t("pricing.feature5", "Calendario y Fechas"),
		t("pricing.feature6", "Plantillas Personalizadas"),
		t("pricing.feature7", "Soporte Prioritario 24/7"),
		t("pricing.feature8", "Integraciones Avanzadas"),
	];

	const plans = [
		{
			name: t("pricing.plan.basic.title", "Básico"),
			price: t("pricing.plan.basic.price", "Gratis"),
			isFree: true,
			description: t(
				"pricing.plan.basic.description",
				"Para uso personal y equipos pequeños que están comenzando.",
			),
			features: features.slice(0, 4),
			theme: "text-accent border-accent",
			bg: "bg-accent-lightest",
			buttonClasses: "bg-accent hover:bg-accent-dark text-text-on-accent",
		},
		{
			name: t("pricing.plan.pro.title", "Pro"),
			price: t("pricing.plan.pro.price", "9.99€"),
			isFree: false,
			description: t(
				"pricing.plan.pro.description",
				"Gestión de proyectos avanzada para equipos en crecimiento.",
			),
			features: features.slice(0, 6),
			theme: "text-primary border-primary",
			bg: "bg-primary-lightest",
			isPopular: true,
			buttonClasses: "bg-primary hover:bg-primary-dark text-text-on-accent",
		},
		{
			name: t("pricing.plan.business.title", "Business"),
			price: t("pricing.plan.business.price", "19.99 €"),
			isFree: false,
			description: t(
				"pricing.plan.business.description",
				"Solución completa para empresas que requieren alta escalabilidad.",
			),
			features: features,
			theme: "text-primary-dark border-primary-dark",
			bg: "bg-background-light-grey",
			buttonClasses: "bg-primary hover:bg-primary-dark text-text-on-accent",
		},
	];

	return (
		<Page>
			<main className="bg-background-page text-text-heading flex-grow">
				<section className="from-accent to-primary-dark text-shadow-text-body relative overflow-hidden bg-gradient-to-br px-6 py-20 md:px-12">
					<div className="relative z-10 mx-auto max-w-7xl text-center">
						<h1 className="mb-4 text-4xl leading-tight font-extrabold md:text-5xl">
							{t("pricing.title", "Planes Simples y Transparentes")}
						</h1>
						<p className="mb-8 text-xl font-light md:text-2xl">
							{t(
								"pricing.subtitle",
								"Encuentra la solución perfecta para tu equipo o tus proyectos personales.",
							)}
						</p>
						<p className="text-sm italic opacity-80">
							{t(
								"pricing.billing",
								"Todos los precios son por usuario/mes, facturados anualmente.",
							)}
						</p>
					</div>
				</section>

				<section className="bg-background-light-grey px-6 py-20 md:px-12">
					<div className="mx-auto max-w-7xl">
						<div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
							{plans.map((plan) => (
								<div
									key={plan.name}
									className={`bg-background-card flex transform flex-col rounded-xl p-8 shadow-xl transition-all duration-300 ${plan.isPopular ? "ring-primary shadow-2xl ring-4 lg:scale-[1.03]" : "hover:-translate-y-1 hover:shadow-2xl"}`}
								>
									{plan.isPopular && (
										<div className="text-text-on-accent bg-primary absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
											{t("pricing.popular", "Más Popular")}
										</div>
									)}
									<h2 className={`${plan.theme} mb-2 text-2xl font-bold`}>
										{plan.name}
									</h2>
									<p className="text-text-body mb-6 text-sm">
										{plan.description}
									</p>

									<p className="mb-8 flex items-baseline">
										<span className="text-text-heading text-5xl font-extrabold">
											{plan.price.includes("Gratis")
												? plan.price
												: plan.price.split("/")[0]}
										</span>
										{!plan.isFree && (
											<span className="text-text-body ml-1 text-lg font-medium">
												{t("pricing.perMonth", "/mes")}
											</span>
										)}
									</p>

									<Link
										to="/register"
										className={`transform rounded-lg px-8 py-3 text-center text-lg font-semibold shadow-lg transition duration-300 hover:scale-[1.02] ${plan.buttonClasses}`}
									>
										{plan.isFree
											? t("pricing.getStarted", "Comenzar Gratis")
											: t("pricing.subscribe", "Suscribirse")}
									</Link>

									<div className="text-text-body border-border-medium mt-8 border-t pt-6">
										<p className="text-text-heading mb-4 text-sm font-semibold uppercase">
											{t("pricing.featuresList", "Incluye:")}
										</p>
										<ul className="space-y-3">
											{plan.features.map((feature, index) => (
												<li key={index} className="flex items-start">
													<svg
														className={`${plan.theme.split(" ")[0]} h-6 w-6 flex-shrink-0`}
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M5 13l4 4L19 7"
														></path>
													</svg>
													<span className="text-text-body ml-3">{feature}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="bg-background-page px-6 py-20 md:px-12">
					<div className="mx-auto max-w-7xl text-center">
						<h2 className="text-text-heading mb-4 text-3xl font-bold md:text-4xl">
							{t("pricing.faq.title", "¿Tienes Preguntas?")}
						</h2>
						<p className="text-text-body mb-8 text-lg">
							{t(
								"pricing.faq.subtitle",
								"Consulta nuestra sección de preguntas frecuentes o contáctanos directamente.",
							)}
						</p>
						<Link
							to="/contact"
							className="bg-accent text-text-on-accent hover:bg-accent-dark transform rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition duration-300 hover:scale-105"
						>
							{t("pricing.contact", "Contactar con Soporte")}
						</Link>
					</div>
				</section>
			</main>
		</Page>
	);
};
