import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { HomePage } from "./pages/home";
import { NotFound } from "./pages/not-found";
import { RegisterPage } from "./pages/register/register";
import { Suspense, lazy, type ReactNode } from "react";
import Board from "./components/Board";
import { useAppSelector } from "./store";
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

	const shouldAllow = requireAuth ? isLogged : !isLogged;
	const fallbackRoute = redirectTo ?? (requireAuth ? "/login" : "/boards");

	return shouldAllow ? (
		children
	) : (
		<Navigate to={fallbackRoute} replace state={{ from: location.pathname }} />
	);
};

function LoginSkeleton() {
	return (
		<div className="bg-background flex min-h-screen items-center justify-center">
			<div className="w-full max-w-sm animate-pulse space-y-6 rounded bg-white p-8 shadow-md">
				<div className="mx-auto h-6 w-32 rounded bg-gray-300" />

				<div className="h-10 w-full rounded border bg-red-100" />

				<div className="space-y-2">
					<div className="h-4 w-32 rounded bg-gray-300" />
					<div className="h-10 w-full rounded bg-gray-300" />
				</div>

				<div className="space-y-2">
					<div className="h-4 w-24 rounded bg-gray-300" />
					<div className="h-10 w-full rounded bg-gray-300" />
				</div>

				<div className="flex items-center space-x-2">
					<div className="h-4 w-4 rounded bg-gray-300" />
					<div className="h-4 w-24 rounded bg-gray-300" />
				</div>

				<div className="h-10 w-full rounded bg-gray-300" />
			</div>
		</div>
	);
}

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
							<Board />
						</AuthRoute>
					}
				/>
				<Route path="not-found" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/not-found" />} />
			</Route>
		</Routes>
	);
}

export default App;
