import { Link } from "react-router-dom";
import { Page } from "../components/layout/page";

export const NotFound = () => {
	return (
		<div>
			<Page title="Oooops! Por aquí no está lo que buscas...">
				<h2 className="text-center text-4xl font-bold text-red-600">404</h2>

				<div className="mt-10 text-center">
					<Link to={"/"}>
						<span className="text-lg">Volver a inicio</span>
					</Link>
				</div>
			</Page>
		</div>
	);
};
