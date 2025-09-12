import { Outlet } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";
import { useAcceptInvitation } from "../../utils/useAcceptInvitation";

export const Layout = () => {
	useAcceptInvitation();
	return (
		<div className="flex min-h-screen flex-col">
			<Header />

			<main className="container mx-auto flex-1 p-4">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
};
