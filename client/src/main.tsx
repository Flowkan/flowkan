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

import { I18nextProvider } from "react-i18next";
import i18n from "../src/lib/i18nextHandlers.ts";

import { store } from "./store/store.ts";

const accessToken = storage.get("auth");
if (accessToken) {
	setAuthorizationHeader(accessToken);
}

const router = createBrowserRouter([{ path: "*", element: <App /> }]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<Provider store={store}>
				<I18nextProvider i18n={i18n}>
					<RouterProvider router={router} />
					<Toaster
						position="top-center"
						containerStyle={{
							top: 80,
						}}
					/>
				</I18nextProvider>
			</Provider>
		</ErrorBoundary>
	</StrictMode>,
);
