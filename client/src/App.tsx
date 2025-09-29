import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, type ReactNode } from "react";
import { Layout } from "./components/layout/layout";
import { BackofficeLayout } from "./components/layout/backoffice_layout";
import { HomePage } from "./pages/home";
import { NotFound } from "./pages/not-found";
import Profile from "./pages/profile/profile";
import { useAppSelector } from "./store";
import { ConfirmPage } from "./pages/register/ConfirmPage";
import ChangePassword from "./pages/login/change_password";
import { VerifyPendingPage } from "./pages/register/VerifyPendingPage";
import { PricingPage } from "./pages/PricingPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { SkeletonCustom } from "./components/ui/skeleton/skeleton";
import BoardItemSocket from "./pages/boards/board-socket/board-item-socket.tsx";
// import SocketProvider from "./hooks/socket/socket-provider.tsx";

const LoginPage = lazy(() =>
	import("./pages/login/login").then((m) => ({ default: m.LoginPage })),
);
const BoardsList = lazy(() => import("./pages/boards/boards-list"));
const Board = lazy(() => import("./pages/boards/board"));
const InvitationPage = lazy(() => import("./pages/boards/invitation-page"));
const RegisterPage = lazy(() => import("./pages/register/register"));

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
							<Suspense
								fallback={
									<div className="flex min-h-screen items-center justify-center">
										<SkeletonCustom
											rows={4}
											columns={1}
											rowHeight="h-12"
											gap="gap-4"
											className="w-full max-w-md rounded-xl p-10 shadow-2xl"
											spinnerText="Cargando Login"
										/>
									</div>
								}
							>
								<LoginPage />
							</Suspense>
						</AuthRoute>
					}
				/>
				<Route
					path="change-password"
					element={
						<AuthRoute requireAuth={false} redirectTo="/login">
							<ChangePassword />
						</AuthRoute>
					}
				/>
				<Route
					path="register"
					element={
						<AuthRoute requireAuth={false} redirectTo="/boards">
							<Suspense
								fallback={
									<div className="flex min-h-screen items-center justify-center">
										<SkeletonCustom
											rows={5}
											columns={1}
											rowHeight="h-12"
											gap="gap-4"
											className="w-full max-w-md rounded-xl p-10 shadow-2xl"
											spinnerText="Cargando Registro"
										/>
									</div>
								}
							>
								<RegisterPage />
							</Suspense>
						</AuthRoute>
					}
				/>
				<Route
					path="/invitacion"
					element={
						<Suspense
							fallback={
								<div className="flex min-h-screen items-center justify-center">
									<SkeletonCustom
										rows={2}
										columns={1}
										rowHeight="h-12"
										gap="gap-4"
										className="w-full max-w-md"
										spinnerText="Generando enlace"
									/>
								</div>
							}
						>
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
				<Route
					path="/verify-pending"
					element={
						<Suspense
							fallback={
								<div className="flex min-h-screen items-center justify-center">
									<SkeletonCustom
										rows={4}
										columns={1}
										rowHeight="h-12"
										gap="gap-4"
										className="w-full max-w-md"
										spinnerText="Verificación pendiente"
									/>
								</div>
							}
						>
							<VerifyPendingPage />
						</Suspense>
					}
				/>
				<Route path="features" element={<FeaturesPage />} />
				<Route path="solutions" element={<SolutionsPage />} />
				<Route path="prices" element={<PricingPage />} />
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
						<Suspense
							fallback={
								<div className="flex min-h-screen items-center justify-center">
									<SkeletonCustom
										rows={4}
										columns={3}
										rowHeight="h-36"
										columnWidth="w-full"
										gap="gap-6"
										className="grid w-full max-w-xl grid-cols-1 p-6 sm:grid-cols-2 md:grid-cols-3"
										spinnerText="Lista de Tableros"
									/>
								</div>
							}
						>
							<BoardsList />
						</Suspense>
					}
				/>
				<Route
					path=":slug"
					element={
						<Suspense
							fallback={
								<div className="flex min-h-screen items-center justify-center">
									<SkeletonCustom
										rows={1}
										columns={4}
										rowHeight="h-200"
										gap="gap-4"
										className="w-full min-w-6xl p-10 shadow-2xl"
										spinnerText="Cargando Tablero"
									/>
								</div>
							}
						>
							<BoardItemSocket>
								<Board />
							</BoardItemSocket>
						</Suspense>
					}
				/>
			</Route>
			<Route
				path="/profile"
				element={
					<AuthRoute requireAuth={true}>
						<BackofficeLayout />
					</AuthRoute>
				}
			>
				<Route
					index
					element={
						<Suspense
							fallback={
								<div className="flex min-h-screen items-center justify-center">
									<SkeletonCustom
										rows={1}
										columns={4}
										rowHeight="h-200"
										gap="gap-4"
										className="w-full min-w-6xl p-10 shadow-2xl"
										spinnerText="Cargando Tablero"
									/>
								</div>
							}
						>
							<Profile />
						</Suspense>
					}
				/>
			</Route>
		</Routes>
	);
}

export default App;
