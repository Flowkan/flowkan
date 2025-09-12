import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import * as thunk from "redux-thunk";
import { useDispatch, useSelector } from "react-redux";

import * as authApi from "../pages/login/service";
import * as boardsApi from "../pages/boards/service";
import * as reducers from "./reducer";
import type { Actions } from "./actions";
import type { createBrowserRouter } from "react-router";

// --- Root Reducer ---
const rootReducer = combineReducers(reducers);

export type Router = ReturnType<typeof createBrowserRouter>;

type ExtraArgument = {
	api: { auth: typeof authApi; boards: typeof boardsApi };
	router: Router;
};

// --- Middleware personalizado ---
const failureRedirects = (router: Router) => (store) => (next) => (action) => {
	const result = next(action);

	if (!action.type.endsWith("/rejected")) {
		return result;
	}

	if (action.payload?.status === 404) {
		router.navigate("/not-found");
	}

	if (action.payload?.status === 401) {
		router.navigate("/login");
	}

	return result;
};

// --- Configuración Store ---
export default function configureStore(
	preloadedState: Partial<ReturnType<typeof rootReducer>>,
	router: Router,
) {
	const store = createStore(
		rootReducer,
		preloadedState as never,
		composeWithDevTools(
			applyMiddleware(
				thunk.withExtraArgument<
					ReturnType<typeof rootReducer>,
					Actions,
					ExtraArgument
				>({ api: { auth: authApi, boards: boardsApi }, router }),
				failureRedirects(router),
			),
		),
	);
	return store;
}

// --- Types ---
export type AppStore = ReturnType<typeof configureStore>;
export type AppGetState = AppStore["getState"];
export type RootState = ReturnType<AppGetState>;
export type AppDispatch = AppStore["dispatch"];

// --- Hooks tipados ---
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// --- Thunk genérico ---
export type AppThunk<ReturnType = void> = thunk.ThunkAction<
	ReturnType,
	RootState,
	ExtraArgument,
	Actions
>;
