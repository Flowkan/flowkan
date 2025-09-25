import {
	combineReducers,
	createStore,
	applyMiddleware,
	type Dispatch,
	type Middleware,
	type UnknownAction,
} from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import * as thunk from "redux-thunk";
import { useDispatch, useSelector } from "react-redux";

import * as authApi from "../pages/login/service";
import * as profileApi from "../pages/profile/service";
import * as boardsApi from "../pages/boards/service";
import type { Actions } from "./boards/actions";
import type { createBrowserRouter } from "react-router";
import { authReducer } from "./auth/reducer";
import { profileReducer } from "./profile/reducer";
import { boardsReducer, ui } from "./boards/reducer";

// --- Root Reducer ---
const rootReducer = combineReducers({
	auth: authReducer,
	profile: profileReducer,
	boards: boardsReducer,
	ui: ui
});

export type Router = ReturnType<typeof createBrowserRouter>;

type ExtraArgument = {
	api: {
		auth: typeof authApi;
		boards: typeof boardsApi;
		profile: typeof profileApi;
	};
	router: Router;
};

export type RootState = ReturnType<typeof rootReducer>;

function isRejectedAction(
	action: unknown,
): action is UnknownAction & { payload?: { status?: number } } {
	return (
		typeof action === "object" &&
		action !== null &&
		"type" in action &&
		typeof (action as { type: unknown }).type === "string" &&
		(action as { type: string }).type.endsWith("/rejected")
	);
}

// --- Middleware personalizado ---
const failureRedirects =
	(router: Router): Middleware<Dispatch<Actions>, RootState> =>
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(_store) =>
	(next) =>
	(action: unknown) => {
		const result = next(action);
		if (!isRejectedAction(action)) {
			return result;
		}

		const status = action.payload?.status;
		if (status === 404) {
			router.navigate("/not-found");
			return undefined;
		}
		if (status === 401) {
			router.navigate("/login");
			return undefined;
		}

		return result;
	};

// --- Configuración Store ---
export default function configureStore(
	preloadedState: Partial<RootState>,
	router: Router,
) {
	const store = createStore(
		rootReducer,
		preloadedState as never,
		composeWithDevTools(
			applyMiddleware(
				thunk.withExtraArgument<RootState, Actions, ExtraArgument>({
					api: { auth: authApi, boards: boardsApi, profile: profileApi },
					router,
				}),
				failureRedirects(router),
			),
		),
	);
	return store;
}

// --- Types ---
export type AppStore = ReturnType<typeof configureStore>;
export type AppGetState = AppStore["getState"];
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
