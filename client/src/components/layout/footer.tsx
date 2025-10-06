import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const clientLogos = [
	{
		src: "https://eodhistoricaldata.com/img/logos/US/MSFT.png?_gl=1*194tavy*_gcl_au*MTMxOTM5MTkwMC4xNzUzNDMzMDg4*FPAU*MTMxOTM5MTkwMC4xNzUzNDMzMDg4",
		alt: "Logo Cliente Microsoft",
	},
	{
		src: "https://imgs.search.brave.com/7Ev6F4Y44DFV2Ic7s--NpSt1UfOz8gnUJBACe6ubdIU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8wLzA2L0Ft/YXpvbl8yMDI0LnN2/Zy8yNTBweC1BbWF6/b25fMjAyNC5zdmcu/cG5n",
		alt: "Logo Cliente Amazon",
	},
	{
		src: "https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg",
		alt: "Logo Cliente KeepCoding",
	},
	{
		src: "https://imgs.search.brave.com/r2CbaG60D2VNes-mVPEVBC_iJl_Uh1Hc7iFRXRS-tEM/rs:fit:200:200:1:0/g:ce/aHR0cHM6Ly9wbGF5/LWxoLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS96YlFTSFRjOURH/bE5rVjhzcXlWUUNp/RTdINzAwZkppM2R3/ZmNLeXBiTGNCejgx/TjE1UmlMN1JhY0dt/Rk03MHVWaGFPNg",
		alt: "Logo Cliente Google Play",
	},
	{
		src: "https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg",
		alt: "Logo Cliente KeepCoding",
	},
	{
		src: "https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg",
		alt: "Logo Cliente KeepCoding",
	},
	{
		src: "https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg",
		alt: "Logo Cliente KeepCoding",
	},
	{
		src: "https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg",
		alt: "Logo Cliente KeepCoding",
	},
];

export const Footer: React.FC = () => {
	const { t } = useTranslation();
	return (
		<footer className="bg-background-dark-footer text-border-light px-6 py-10 md:px-12">
			<div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
				<div>
					<h4 className="text-text-on-accent mb-4 font-bold">FlowKan</h4>
					<p className="text-sm leading-relaxed">{t("footer.description")}</p>
					<ul className="mt-4 space-y-2 text-sm">
						<li>
							<a href="#" className="hover:text-accent-hover transition-colors">
								{t("footer.privacy")}
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-accent-hover transition-colors">
								{t("footer.terms")}
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="text-text-on-accent mb-4 font-bold">
						{t("footer.title")}
					</h4>
					<ul className="space-y-2 text-sm">
						<li>
							{t("footer.contact.email")}:{" "}
							<Link
								to="mailto:info@flowkan.com"
								className="hover:text-accent-hover transition-colors"
							>
								info@flowkan.com
							</Link>
						</li>
						<li>{t("footer.contact.phone")}: +34 123 45 67 89</li>
						<li>
							{t("footer.address.label")}:{" "}
							{t("footer.address.full", {
								street: "Ficticia, 123",
								city: "Madrid",
								cp: "28001",
								country: t("footer.address.country"),
							})}
						</li>
					</ul>
					<div className="mt-4 flex space-x-4">
						<Link
							to="#"
							className="text-text-placeholder hover:text-text-on-accent transition-colors"
						>
							<i className="fab fa-facebook-f text-lg"></i>
						</Link>
						<Link
							to="#"
							className="text-text-placeholder hover:text-text-on-accent transition-colors"
						>
							<i className="fab fa-twitter text-lg"></i>
						</Link>
						<Link
							to="#"
							className="text-text-placeholder hover:text-text-on-accent transition-colors"
						>
							<i className="fab fa-instagram text-lg"></i>
						</Link>
						<Link
							to="#"
							className="text-text-placeholder hover:text-text-on-accent transition-colors"
						>
							<i className="far fa-envelope text-lg"></i>
						</Link>
					</div>
				</div>

				<div className="md:col-span-2">
					<h4 className="text-text-on-accent mb-4 font-bold">
						{t("footer.clients")}
					</h4>

					<div className="grid grid-cols-4 gap-4">
						{clientLogos.map((logo, index) => (
							<div
								key={index}
								className="flex h-12 w-full flex-shrink-0 items-center justify-center"
							>
								<img
									src={logo.src}
									alt={logo.alt}
									className="h-10 w-auto max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="border-border-dark text-text-placeholder mt-8 border-t pt-6 text-center text-sm">
				&copy; Flowkan {new Date().getFullYear()} {t("footer.copy")}.
			</div>
		</footer>
	);
};
