import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import storage from "./utils/storage.ts";
import { setAuthorizationHeader } from "./api/client.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/errors/error-boundary.tsx";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { type User } from "../src/pages/login/types.ts";

import { I18nextProvider } from "react-i18next";
import i18n from "../src/lib/i18nextHandlers.ts";
import configureStore from "./store/index.ts";
import SocketProvider from "./hooks/socket/socket-provider.tsx";
import { responseJwtInterceptors } from "./api/client.ts";
import * as Sentry from "@sentry/react";
import { resolveBaseURLFromEnv } from "./utils/resolveBaseUrlEnv.ts";

// import { store } from "./store/store.ts";

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	integrations: [
		Sentry.browserTracingIntegration({}),
		Sentry.consoleLoggingIntegration({
			levels: ["log", "warn", "error", "info"],
		}),
	],
	tracePropagationTargets: ["localhost", /^https:\/\/flowkan\.es/],
	environment: resolveBaseURLFromEnv(),
	// 10% para sentry (no saturar) en produccion y el 100% en desarrollo
	tracesSampleRate: resolveBaseURLFromEnv() === "production" ? 0.1 : 1,
	enableLogs: import.meta.env.MODE === "development",
});

const accessToken = storage.get("auth");
if (accessToken) {
	setAuthorizationHeader(accessToken);
}

const storedUser = localStorage.getItem("user");

const user = storedUser ? (JSON.parse(storedUser) as User) : null;
if (user) {
	Sentry.setUser({
		id: user.id.toString(),
		username: user.name,
		email: user.email,
	});
}

const router = createBrowserRouter([{ path: "*", element: <App /> }]);
const store = configureStore(
	{ auth: { user, isAuthenticated: !!accessToken, error: null } },
	router,
);

responseJwtInterceptors(store.dispatch, router);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<Provider store={store}>
				<I18nextProvider i18n={i18n}>
					<SocketProvider>
						<RouterProvider router={router} />
						<Toaster
							position="top-center"
							containerStyle={{
								top: 80,
							}}
						/>
					</SocketProvider>
				</I18nextProvider>
			</Provider>
		</ErrorBoundary>
	</StrictMode>,
);
