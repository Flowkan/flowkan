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

import configureStore from "./store/index.ts";

const accessToken = storage.get("auth");
if (accessToken) {
	setAuthorizationHeader(accessToken);
}

const router = createBrowserRouter([{ path: "*", element: <App /> }]);
const store = configureStore({ auth: !!accessToken }, router);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<Provider store={store}>
				<RouterProvider router={router} />
				<Toaster
					position="top-center"
					containerStyle={{
						top: 80,
					}}
				/>
			</Provider>
		</ErrorBoundary>
	</StrictMode>,
);
