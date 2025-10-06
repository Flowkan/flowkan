import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/page";
import React from "react";
import { Link } from "react-router-dom";

interface SolutionItem {
	key: string;
	icon: React.ReactNode;
	iconClasses: {
		circle: string;
		svg: string;
	};
}

export const SolutionsPage: React.FC = () => {
	const { t } = useTranslation();

	const solutionsData: SolutionItem[] = [
		{
			key: "realTimeCollaboration",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zm-6 9a3 3 0 100-6 3 3 0 000 6zm6 3a3 3 0 100-6 3 3 0 000 6z"></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-accent-lightest",
				svg: "text-accent",
			},
		},
		{
			key: "visualProjectManagement",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 1H5v8h10V6z"
						clipRule="evenodd"
					></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-primary-lightest",
				svg: "text-primary",
			},
		},
		{
			key: "aiTaskDescriptions",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.414-2.828a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L8 12.586l1.293-1.293a1 1 0 011.414 1.414l-2 2zM12 9a1 1 0 00-1-1H7a1 1 0 100 2h4a1 1 0 001-1z"></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-success-lightest",
				svg: "text-success",
			},
		},
		{
			key: "fileAndVoiceSharing",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M4 3h12v4H4V3zm0 6h12v7H4V9z"></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-primary-lightest",
				svg: "text-primary",
			},
		},
		{
			key: "taskAssignmentTracking",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
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
			key: "integratedChat",
			icon: (
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5l-3 3V5z"></path>
				</svg>
			),
			iconClasses: {
				circle: "bg-accent-lightest",
				svg: "text-accent",
			},
		},
	];

	return (
		<Page>
			<main className="bg-background-page text-text-heading flex-grow">
				<section className="from-accent to-primary-dark text-shadow-text-body relative overflow-hidden bg-gradient-to-br px-6 py-20 md:px-12">
					<div className="relative z-10 mx-auto max-w-7xl text-center">
						<h1 className="mb-4 text-4xl leading-tight font-extrabold md:text-5xl">
							{t("solutions.banner.title")}
						</h1>
						<p className="mb-8 text-xl font-light md:text-2xl">
							{t("solutions.banner.subtitle")}
						</p>
					</div>

					<div className="absolute top-0 left-0 z-0 h-full w-full opacity-20">
						<div className="bg-accent-light animate-blob absolute -top-16 -left-16 h-64 w-64 rounded-full opacity-70 mix-blend-multiply blur-xl filter"></div>
						<div className="bg-primary-light animate-blob animation-delay-2000 absolute right-0 -bottom-20 h-64 w-64 rounded-full opacity-70 mix-blend-multiply blur-xl filter"></div>
					</div>
				</section>

				<section className="bg-background-light-grey px-6 py-20 md:px-12">
					<div className="mx-auto max-w-7xl">
						<h2 className="text-text-heading mb-16 text-center text-3xl font-bold md:text-4xl">
							{t("solutions.main.title")}
						</h2>

						<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
							{solutionsData.map((solution) => (
								<div
									key={solution.key}
									className="bg-background-card flex transform flex-col items-center rounded-lg p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
								>
									<div
										className={`${solution.iconClasses.circle} mb-6 rounded-full p-4`}
									>
										<div className={`${solution.iconClasses.svg} h-10 w-10`}>
											{solution.icon}
										</div>
									</div>
									<h3 className="text-text-heading mb-3 text-center text-xl font-bold">
										{t(`solutions.list.${solution.key}.title`, solution.key)}
									</h3>
									<p className="text-text-body mb-4 text-center">
										{t(`solutions.list.${solution.key}.description`)}
									</p>
									{/* LINKS TODAVIA NO VAN A NINGUNA PARTE
									<Link
										to={`/solutions/${solution.key}`}
										className={`${solution.iconClasses.svg} mt-auto text-sm font-semibold hover:underline`}
									>
										{t("solutions.learnMore", "Ver caso de uso")} &rarr;
									</Link> */}
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="bg-background-page px-6 py-20 md:px-12">
					<div className="mx-auto max-w-7xl text-center">
						<h2 className="text-text-heading mb-4 text-3xl font-bold md:text-4xl">
							{t("solutions.cta.title")}
						</h2>
						<p className="text-text-body mb-8 text-lg">
							{t("solutions.cta.subtitle")}
						</p>
						<Link
							to="/register"
							className="bg-primary text-text-on-accent hover:bg-primary-dark transform rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition duration-300 hover:scale-105"
						>
							{t("solutions.cta.button")} &rarr;
						</Link>
					</div>
				</section>
			</main>
		</Page>
	);
};
