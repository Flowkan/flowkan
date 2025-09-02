import { combineReducers, createStore, applyMiddleware } from "redux";
import * as reducers from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import * as thunk from "redux-thunk";
import type { Actions } from "./actions";
import * as auth from "../pages/login/service";
import * as boards from "../pages/boards/service";
import type { createBrowserRouter } from "react-router";

const rootReducer = combineReducers(reducers);
type Router = ReturnType<typeof createBrowserRouter>;

export type ExtraArgument = {
	api: {
		auth: typeof auth;
		boards: typeof boards;
	};
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
	preloadedState: Partial<reducers.State>,
	router: Router,
) {
	const store = createStore(
		rootReducer,
		preloadedState as never,
		composeWithDevTools(
			applyMiddleware(
				thunk.withExtraArgument<reducers.State, Actions, ExtraArgument>({
					api: { auth, boards },
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
