import { Outlet } from "react-router-dom";
import { BackofficeHeader } from "./backoffice_header";

export function BackofficeLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<BackofficeHeader />

			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
