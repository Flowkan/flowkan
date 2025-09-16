import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, type ReactNode } from "react";
import { Layout } from "./components/layout/layout";
import { BackofficeLayout } from "./components/layout/backoffice_layout.tsx";
import { HomePage } from "./pages/home";
import { NotFound } from "./pages/not-found";
import { RegisterPage } from "./pages/register/register";
import Profile from "./pages/profile/profile.tsx";
import LoginSkeleton from "./components/ui/LoginSkeleton";
import { useAppSelector } from "./store";
import { ConfirmPage } from "./pages/register/ConfirmPage.tsx";



const LoginPage = lazy(() =>
	import("./pages/login/login").then((m) => ({ default: m.LoginPage })),
);
const BoardsList = lazy(() => import("./pages/boards/boards-list"));
const Board = lazy(() => import("./pages/boards/board"));
const InvitationPage = lazy(() => import("./pages/boards/invitation-page.tsx"));

interface AuthRouteProps {
	children: ReactNode;
	requireAuth: boolean;
	redirectTo?: string;
}
const AuthRoute = ({ children, requireAuth, redirectTo }: AuthRouteProps) => {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

	if (requireAuth && !isAuthenticated) return <Navigate to="/login" replace />;
	if (!requireAuth && isAuthenticated)
		return <Navigate to={redirectTo || "/boards"} replace />;
	return <>{children}</>;
};

function App() {
	return (
		<Routes>
			{/* Public routes */}
			<Route path="/" element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route
					path="login"
					element={
						<AuthRoute requireAuth={false} redirectTo="/boards">
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
					path="profile"
					element={
						<AuthRoute requireAuth={true}>
							<Profile />
						</AuthRoute>
					}
				/>				
				<Route
					path="/invitacion"
					element={
						<Suspense fallback={<LoginSkeleton />}>
							<InvitationPage />
						</Suspense>
					}
				/>
				<Route
					path="confirm"
					element={
						<AuthRoute requireAuth={false} redirectTo="/boards">
							<ConfirmPage />
						</AuthRoute>
					}
				/>
				<Route path="not-found" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/not-found" />} />
			</Route>

			{/* Backoffice routes */}
			<Route
				path="/boards"
				element={
					<AuthRoute requireAuth={true}>
						<BackofficeLayout />
					</AuthRoute>
				}
			>
				<Route
					index
					element={
						<Suspense fallback={<LoginSkeleton />}>
							<BoardsList />
						</Suspense>
					}
				/>
				<Route
					path=":boardId"
					element={
						<Suspense fallback={<LoginSkeleton />}>
							<Board />
						</Suspense>
					}
				/>
			</Route>
		</Routes>
	);
}

export default App;
