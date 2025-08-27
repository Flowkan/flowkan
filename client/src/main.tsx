import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "../src/lib/i18nextHandlers.ts"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
			<Toaster
				position="top-center"
				containerStyle={{
					top: 80,
				}}
			/>
		</BrowserRouter>
	</StrictMode>,
);
