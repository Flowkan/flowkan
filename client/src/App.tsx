import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { HomePage } from "./pages/home";
import { NotFound } from "./pages/not-found";
import { RegisterPage } from "./pages/register/register";
import { Suspense, lazy, type ReactNode } from "react";
import { useAppSelector } from "./store/hooks.ts";
import LoginSkeleton from "./components/ui/LoginSkeleton.tsx";
import NewBoardPage from "./pages/boards/new-board.tsx";
const LoginPage = lazy(() =>
	import("./pages/login/login").then((module) => ({
		default: module.LoginPage,
	})),
);
const Board = lazy(() => import("./pages/boards/board"));
const BoardsList = lazy(() => import("./pages/boards/boards-list"));

interface AuthRouteProps {
	children: ReactNode;
	requireAuth: boolean;
	redirectTo?: string;
}

const AuthRoute = ({ children, requireAuth, redirectTo }: AuthRouteProps) => {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const location = useLocation();

	if (requireAuth && !isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	if (!requireAuth && isAuthenticated) {
		return (
			<Navigate
				to={redirectTo || "/boards"}
				replace
				state={{ from: location.pathname }}
			/>
		);
	}

	return <>{children}</>;
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
						<AuthRoute requireAuth={false} redirectTo="/boards">
							<RegisterPage />
						</AuthRoute>
					}
				/>
				<Route
					path="boards"
					element={
						<AuthRoute requireAuth={true}>
							<Suspense fallback={<LoginSkeleton />}>
								<Outlet />
							</Suspense>
						</AuthRoute>
					}
				>
					<Route index element={<BoardsList />} />
					<Route path=":boardId" element={<Board />} />
					{/* <Route path="new" element={<NewBoardPage />} /> */}
				</Route>
				<Route path="not-found" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/not-found" />} />
			</Route>
		</Routes>
	);
}

export default App;
