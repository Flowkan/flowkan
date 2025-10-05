import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/page";
import React from "react";
import { Button } from "../components/ui/Button";

export const HomePage: React.FC = () => {
	const { t } = useTranslation();
	return (
		<Page>
			<main className="bg-background-page text-text-heading flex-grow">
				<section className="from-accent to-primary-dark text-text-on-accent relative overflow-hidden bg-gradient-to-br px-6 py-20 md:px-12">
					<div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between lg:flex-row">
						<div className="mb-10 text-center lg:mb-0 lg:w-1/2 lg:text-left">
							<h1 className="mb-4 text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl lg:text-6xl">
								{t(
									"home.banner",
									"Simplifica tus tareas, maximiza tu productividad",
								)}
							</h1>

							<p className="mb-6 text-base font-light sm:text-lg md:text-xl lg:text-2xl">
								{t(
									"home.description",
									"Organiza tu trabajo y colabora en tiempo real",
								)}
								<br />
								{t(
									"home.funtionality",
									"Arrastra, comparte y recibe ayuda de IA",
								)}
							</p>

							<Button
								title={t("home.more", "Saber Más")}
								aria-label={t(
									"home.more_arialabel",
									"Saber más sobre la aplicación",
								)}
								className="bg-primary text-text-on-accent hover:bg-primary-dark transform rounded-lg px-6 py-3 text-base font-semibold shadow-lg transition duration-300 hover:scale-105 sm:px-8 sm:py-4 sm:text-lg"
							>
								{t("home.more", "Saber Más")}
							</Button>
						</div>

						<div className="flex justify-center lg:w-1/2 lg:justify-end">
							<img
								src="https://imgs.search.brave.com/7WNY_QRUFxwivusSxIeNog9dVL2TneO5PYrt_2Vr_Cc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuYXNhbmEuYml6/L3RyYW5zZm9ybS9h/YzI1Nzg5NS1jZGY1/LTRmZTItOGEzNC0y/YmVmNmFhNDE2OGUv/aW5saW5lLWFnaWxl/LXNwcmludC1wbGFu/bmluZy0xLTJ4P2lv/PXRyYW5zZm9ybTpm/aWxsLHdpZHRoOjI1/NjAmZm9ybWF0PXdl/YnA"
								alt={t("interface", "Kanban Board Interface")}
								className="w-full max-w-lg scale-105 rotate-3 transform rounded-lg shadow-2xl"
							/>
						</div>
					</div>

					<div className="absolute top-0 left-0 z-0 h-full w-full opacity-20">
						<div className="bg-accent-light animate-blob absolute -top-16 -left-16 h-64 w-64 rounded-full opacity-70 mix-blend-multiply blur-xl filter"></div>
						<div className="bg-primary-light animate-blob animation-delay-2000 absolute right-0 -bottom-20 h-64 w-64 rounded-full opacity-70 mix-blend-multiply blur-xl filter"></div>
						<div className="bg-primary-lightest animate-blob animation-delay-4000 absolute top-1/3 left-1/4 h-64 w-64 rounded-full opacity-70 mix-blend-multiply blur-xl filter"></div>
					</div>
				</section>

				<section className="bg-background-light-grey px-6 py-20 md:px-12">
					<div className="mx-auto max-w-7xl text-center">
						<h2 className="text-text-heading mb-12 text-3xl font-bold md:text-4xl">
							{t("home.features.title", "Características Destacadas")}
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
							<div className="bg-background-card flex transform flex-col items-center rounded-lg p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2">
								<div className="bg-accent-lightest mb-4 rounded-full p-4">
									<svg
										className="text-accent h-8 w-8"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
										<path
											fillRule="evenodd"
											d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.586-1.586A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L5.707 6.293A1 1 0 015 6.586V7a2 2 0 00-2 2zm0 2h12v8H4V7z"
											clipRule="evenodd"
										></path>
									</svg>
								</div>
								<h3 className="text-text-heading mb-2 text-xl font-semibold">
									{t("home.features.board", "Kanban Board")}
								</h3>
								<p className="text-text-body text-center">
									{t(
										"home.features.viewTask",
										"Visualiza y gestiona tus tareas con facilidad",
									)}
									.
								</p>
							</div>
							<div className="bg-background-card flex transform flex-col items-center rounded-lg p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2">
								<div className="bg-primary-lightest mb-4 rounded-full p-4">
									<svg
										className="text-primary h-8 w-8"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17.66 14.93A8.995 8.005 0 0112 18c-.015 0-.029-.001-.044-.001-.383 0-.761-.019-1.139-.06a.75.75 0 01-.767-.681.75.75 0 01.68-.767c.307-.03 1.054-.052 1.25-.052.128 0 .256.007.384.02a8.987 8.987 0 006.182-3.816.75.75 0 011.23.966zM12 12a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1zM6 10a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z"></path>
									</svg>
								</div>
								<h3 className="text-text-heading mb-2 text-xl font-semibold">
									{t("home.features.collaborations", "Colaboración")}
								</h3>
								<p className="text-text-body text-center">
									{t(
										"home.features.jobsTeam",
										"Trabaja en equipo en tiempo real sin esfuerzo",
									)}
									.
								</p>
							</div>
							<div className="bg-background-card flex transform flex-col items-center rounded-lg p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2">
								<div className="bg-success-lightest mb-4 rounded-full p-4">
									<svg
										className="text-success h-8 w-8"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										></path>
									</svg>
								</div>
								<h3 className="text-text-heading mb-2 text-xl font-semibold">
									{t("home.features.follow", "Seguimiento de Progreso")}
								</h3>
								<p className="text-text-body text-center">
									{t(
										"home.features.upToDay",
										"Mantente al tanto del avance de tus proyectos",
									)}
									.
								</p>
							</div>
							<div className="bg-background-card flex transform flex-col items-center rounded-lg p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2">
								<div className="bg-primary-lightest mb-4 rounded-full p-4">
									<svg
										className="h-8 w-8"
										fill="#0A0B0D"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h7a1 1 0 001-1V7.414l-2.586-2.586A1 1 0 0010 4.586V4a1 1 0 00-1-1H6z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<h3 className="text-text-heading mb-2 text-xl font-semibold">
									{t("home.features.files", "Adjuntar archivos")}
								</h3>
								<p className="text-text-body text-center">
									{t(
										"home.features.filesDescription",
										"Adjunta archivos y audios directamente a tus tareas",
									)}
									.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-background-page px-6 py-20 md:px-12">
					<div className="mx-auto max-w-7xl text-center">
						<h2 className="text-text-heading mb-12 text-3xl font-bold md:text-4xl">
							{t("home.ourUsers.title", "Lo que dicen nuestros usuarios")}
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							<div className="bg-background-light-grey flex flex-col items-center rounded-lg p-6 shadow-md">
								<img
									src="https://randomuser.me/api/portraits/women/68.jpg"
									alt={t("home.ourUsers.testimony", "Avatar Testimonio")}
									className="border-accent-light mb-4 h-20 w-20 rounded-full border-4 object-cover"
								/>
								<p className="text-text-body mb-4 italic">
									{t(
										"home.ourUsers.feedbacks.first.text",
										"Esta aplicación ha transformado la forma en que gestionamos nuestros proyectos. ¡Absolutamente indispensable!",
									)}
								</p>
								<p className="text-text-heading font-semibold">
									-{" "}
									{t(
										"home.ourUsers.feedbacks.first.user",
										"Ana García, CEO en Empresa X",
									)}
								</p>
							</div>
							<div className="bg-background-light-grey flex flex-col items-center rounded-lg p-6 shadow-md">
								<img
									src="https://randomuser.me/api/portraits/men/44.jpg"
									alt={t("home.ourUsers.testimony", "Avatar Testimonio")}
									className="border-primary-light mb-4 h-20 w-20 rounded-full border-4 object-cover"
								/>
								<p className="text-text-body mb-4 italic">
									{" "}
									{t(
										"home.ourUsers.feedbacks.second.text",
										"La interfaz es increíblemente intuitiva y las funciones de	colaboración son de otro nivel.",
									)}
								</p>
								<p className="text-text-heading font-semibold">
									-{" "}
									{t(
										"home.ourUsers.feedbacks.second.user",
										"Juan Pérez, Product Manager",
									)}
								</p>
							</div>
							<div className="bg-background-light-grey flex flex-col items-center rounded-lg p-6 shadow-md">
								<img
									src="https://randomuser.me/api/portraits/women/79.jpg"
									alt={t("home.ourUsers.testimony", "Avatar Testimonio")}
									className="border-primary-light mb-4 h-20 w-20 rounded-full border-4 object-cover"
								/>
								<p className="text-text-body mb-4 italic">
									{t(
										"home.ourUsers.feedbacks.third.text",
										"Nunca pensé que la gestión de tareas pudiera ser tan sencilla y visualmente agradable.",
									)}
								</p>
								<p className="text-text-heading font-semibold">
									-{" "}
									{t(
										"home.ourUsers.feedbacks.third.user",
										"Sofía Castro, Diseñadora UX",
									)}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* <section className="bg-background-light-grey px-6 py-20 md:px-12">
					<div className="mx-auto max-w-7xl text-center">
						<h2 className="text-text-heading mb-12 text-3xl font-bold md:text-4xl">
							{t("home.docs.title", "Cómo puedes usar nuestra plataforma")}
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							<div className="bg-background-card rounded-lg p-8 shadow-lg">
								<h3 className="text-accent mb-4 text-2xl font-semibold">
									{t("home.docs.management.title", "Gestión de Proyectos")}
								</h3>
								<p className="text-text-body mb-4">
									{t(
										"home.docs.management.message",
										"Desde pequeños equipos hasta grandes empresas, nuestra	herramienta se adapta a tus necesidades de gestión de	proyectos complejos.",
									)}
								</p>
								<a
									href="#"
									className="text-accent font-semibold hover:underline"
								>
									{t("home.moreInformation", "Más información")} &rarr;
								</a>
							</div>
							<div className="bg-background-card rounded-lg p-8 shadow-lg">
								<h3 className="text-primary mb-4 text-2xl font-semibold">
									{t("home.docs.planning.title", "Planificación de Eventos")}
								</h3>
								<p className="text-text-body mb-4">
									{t(
										"home.docs.planning.message",
										"Organiza cada detalle de tus eventos, desde la logística hasta	las invitaciones, de manera visual.",
									)}
								</p>
								<a
									href="#"
									className="text-primary font-semibold hover:underline"
								>
									{t("home.moreInformation", "Más información")} &rarr;
								</a>
							</div>
							<div className="bg-background-card rounded-lg p-8 shadow-lg">
								<h3 className="text-primary mb-4 text-2xl font-semibold">
									{t("home.docs.monitoring.title", "Seguimiento Personal")}
								</h3>
								<p className="text-text-body mb-4">
									{t(
										"home.docs.monitoring.message",
										"Gestiona tus tareas personales, objetivos y hábitos diarios con un sistema Kanban fácil de usar.",
									)}
								</p>
								<a
									href="#"
									className="text-primary font-semibold hover:underline"
								>
									{t("home.moreInformation", "Más información")} &rarr;
								</a>
							</div>
						</div>
					</div>
				</section> */}
			</main>
		</Page>
	);
};
