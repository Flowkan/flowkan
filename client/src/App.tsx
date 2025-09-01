import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { HomePage } from "./pages/home";
import { NotFound } from "./pages/not-found";
import { RegisterPage } from "./pages/register/register";
import { Suspense, lazy, type ReactNode } from "react";
import Board from "./pages/boards/board.tsx";
import { useAppSelector } from "./store";
import LoginSkeleton from "./components/ui/LoginSkeleton.tsx";
import BoardsListPage from "./pages/boards/boards-list-page.tsx";
const LoginPage = lazy(() =>
	import("./pages/login/login").then((module) => ({
		default: module.LoginPage,
	})),
);

interface AuthRouteProps {
	children: ReactNode;
	requireAuth: boolean;
	redirectTo?: string;
}

const AuthRoute = ({ children, requireAuth, redirectTo }: AuthRouteProps) => {
	const isLogged = useAppSelector((state) => state.auth);
	const location = useLocation();

	const shouldAllow = requireAuth ? isLogged : true;
	const fallbackRoute = redirectTo ?? (requireAuth ? "/login" : "/boards");

	return shouldAllow ? (
		children
	) : (
		<Navigate to={fallbackRoute} replace state={{ from: location.pathname }} />
	);
};

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route
					path="login"
					element={
						<AuthRoute requireAuth={false}>
							<Suspense fallback={<LoginSkeleton />}>
								<LoginPage />
							</Suspense>
						</AuthRoute>
					}
				/>
				<Route
					path="register"
					element={
						<AuthRoute requireAuth={false}>
							<RegisterPage />
						</AuthRoute>
					}
				/>
				<Route
					path="boards"
					element={
						<AuthRoute requireAuth={true}>
							<Outlet />
						</AuthRoute>
					}
				>
					<Route index element={<BoardsListPage />} />
					<Route path=":id" element={<Board />} />
					<Route path="new" />
				</Route>
				<Route path="not-found" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/not-found" />} />
			</Route>
		</Routes>
	);
}

export default App;
