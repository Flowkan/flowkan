import type { ProfileState } from "../types/defaultStates";
import type { ProfileActions } from "./actions";

const defaultState: ProfileState = {
	profile: {
		username: "",
		dateBirth: "",
		location: "",
		allowNotifications: true,
		bio: "",
	},
	boards: {
		boards: [],
		currentBoard: null,
		loading: false,
		error: null,
	},
	ui: {
		pending: false,
		error: null,
	},
};

//
// ─── PROFILE REDUCER ──────────────────────────────────────────────
//

export function profileReducer(
	state: ProfileState["profile"] = defaultState.profile,
	action: ProfileActions,
): ProfileState["profile"] {
	switch (action.type) {
		case "profile/update/pending":
		case "profile/update/rejected":
		case "profile/loaded/pending":
		case "profile/loaded/rejected":
			return null;
		case "profile/update/fulfilled":
		case "profile/loaded/fulfilled":
			return { ...action.payload };
		default:
			return state;
	}
}
