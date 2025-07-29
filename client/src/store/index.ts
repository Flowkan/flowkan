import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import * as thunk from "redux-thunk";
import type { Actions } from "./actions";
import type { State } from "./reducer";
import type { createBrowserRouter } from "react-router";
import type { Credentials } from "./actions";

const api = {
	auth: {
		login: async (credentials: Credentials) => {
			// Simulación de llamada a API de login
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					if (
						credentials.username === "user" &&
						credentials.password === "pass"
					) {
						resolve({ success: true });
					} else {
						reject(new Error("Invalid credentials from API mock"));
					}
				}, 500);
			});
		},
		logout: async () => {
			// Simulación de llamada a API de logout
			return new Promise((resolve) => setTimeout(resolve, 200));
		},
	},
	boards: {
		getBoard: async (boardId: string) => {
			/* ... */
		},
		createColumn: async (column: any) => {
			/* ... */
		},
		createTask: async (task: any) => {
			/* ... */
		},
		updateTask: async (taskId: string, updates: any) => {
			/* ... */
		},
		deleteTask: async (taskId: string) => {
			/* ... */
		},
	},
};
type Router = ReturnType<typeof createBrowserRouter>;

export type ExtraArgument = {
	api: typeof api;
	router: Router;
};

// @ts-expect-error: any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const failureRedirects = (router: Router) => (store) => (next) => (action) => {
	const result = next(action);
	if (!action.type.endsWith("/rejected")) {
		return result;
	}

	if (action.payload.status === 404) {
		router.navigate("/not-found");
	}
	if (action.payload.status === 401) {
		router.navigate("/login");
	}
	return result;
};

export default function configureStore(
	preloadedState: Partial<State>,
	router: Router,
) {
	const store = createStore(
		rootReducer,
		preloadedState as never,
		composeWithDevTools(
			applyMiddleware(
				thunk.withExtraArgument<State, Actions, ExtraArgument>({
					api: api,
					router,
				}),
				failureRedirects(router),
			),
		),
	);
	return store;
}

export type AppStore = ReturnType<typeof configureStore>;
export type AppGetState = AppStore["getState"];
export type RootState = ReturnType<AppGetState>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export type AppThunk<ReturnType = void> = thunk.ThunkAction<
	ReturnType,
	RootState,
	ExtraArgument,
	Actions
>;
