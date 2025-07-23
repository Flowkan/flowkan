import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { HomePage } from "./pages/home";
import { NotFound } from "./pages/not-found";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<HomePage />} />

				<Route path="not-found" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/not-found" />} />
			</Route>
		</Routes>
	);
}

export default App;
