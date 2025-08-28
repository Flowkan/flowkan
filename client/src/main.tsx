import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { I18nextProvider } from "react-i18next";
import i18n from "../src/lib/i18nextHandlers.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<I18nextProvider i18n={i18n}>
				<App />
				<Toaster
					position="top-center"
					containerStyle={{
						top: 80,
					}}
				/>
			</I18nextProvider>
		</BrowserRouter>
	</StrictMode>,
);
