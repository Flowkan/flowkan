import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";

interface Service {
	label: string;
	icon: string;
	className: string;
}
interface SocialRegisterButtonProps {
	services: Service;
}

export const WithOtherServices = () => {
	const { t } = useTranslation();
	const providerServices = [
		{
			label: "Google",
			icon: "https://img.icons8.com/?size=100&id=17949&format=png&color=000000",
			className: "mr-2 h-5 w-5",
		},
		{
			label: "Github",
			icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
			className: "mr-2 h-5 w-5",
		},
	];
	const getOAuthUrl = (label: string) => {
		switch (label.toLowerCase()) {
			case "google":
				return `${import.meta.env.VITE_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auth/google`;
			case "github":
				return `${import.meta.env.VITE_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auth/github`;
			default:
				return "#";
		}
	};

	const SocialRegisterButton: React.FC<SocialRegisterButtonProps> = ({
		services,
	}) => (
		<Button
			type="button"
			onClick={() => {
				window.location.href = getOAuthUrl(services.label);
			}}
			aria-label={t(
				"arialabels.component.WithOtherServices.service",
				`Continuar con {{${services.label}}}`,
			)}
			className="border-border-light bg-background-card text-text-body hover:bg-background-light-grey inline-flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
		>
			<img
				src={`${services.icon}`}
				alt="Google Logo"
				className="mr-2 h-5 w-5"
			/>
			{`${services.label}`}
		</Button>
	);

	return (
		<section aria-labelledby="other-services">
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<div className="border-border-light w-full border-t"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="bg-background-card text-text-placeholder px-2">
						{t("register.withOtherService.otherTypeRegister", "O continúa con")}
					</span>
				</div>
			</div>
			<div>
				<div className="mt-6 grid grid-cols-2 gap-3">
					{providerServices.map((service) => (
						<div key={service.label}>
							<SocialRegisterButton services={service} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
