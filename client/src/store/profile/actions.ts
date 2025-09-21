import type { AppThunk } from "..";
import type { User } from "../../pages/login/types";
import type { ProfileType } from "../../pages/profile/types";

//
// ─── PROFILE ──────────────────────────────────────────────
//

type UserUpdatePending = { type: "user/update/pending" };
type UserUpdateFulfilled = { type: "user/update/fulfilled"; payload: User };
type UserUpdateRejected = { type: "user/update/rejected"; payload: Error };

export const userUpdatePending = (): UserUpdatePending => ({
	type: "user/update/pending",
});
export const userUpdateFulFilled = (user: User): UserUpdateFulfilled => ({
	type: "user/update/fulfilled",
	payload: user,
});
export const userUpdateRejected = (error: Error): UserUpdateRejected => ({
	type: "user/update/rejected",
	payload: error,
});

type ProfileUpdatePending = { type: "profile/update/pending" };
type ProfileUpdateFulfilled = {
	type: "profile/update/fulfilled";
	payload: ProfileType;
};
type ProfileUpdateRejected = {
	type: "profile/update/rejected";
	payload: Error;
};

export const profileUpdatePending = (): ProfileUpdatePending => ({
	type: "profile/update/pending",
});
export const profileUpdateFulFilled = (
	profile: ProfileType,
): ProfileUpdateFulfilled => ({
	type: "profile/update/fulfilled",
	payload: profile,
});
export const profileUpdateRejected = (error: Error): ProfileUpdateRejected => ({
	type: "profile/update/rejected",
	payload: error,
});

type ProfileLoadedPending = { type: "profile/loaded/pending" };
type ProfileLoadedFulfilled = {
	type: "profile/loaded/fulfilled";
	payload: ProfileType;
};
type ProfileLoadedRejected = {
	type: "profile/loaded/rejected";
	payload: Error;
};

export const profileLoadedPending = (): ProfileLoadedPending => ({
	type: "profile/loaded/pending",
});
export const profileLoadedFulFilled = (
	profile: ProfileType,
): ProfileLoadedFulfilled => ({
	type: "profile/loaded/fulfilled",
	payload: profile,
});
export const profileLoadedRejected = (error: Error): ProfileLoadedRejected => ({
	type: "profile/loaded/rejected",
	payload: error,
});

export function loadedProfile(): AppThunk<Promise<void>> {
	return async (dispatch, _getStore, { api }) => {
		dispatch(profileLoadedPending());
		try {
			const { error, profile } = await api.profile.getProfileData();
			if (error) {
				throw new Error(error);
			}
			if (profile) {
				console.log(profile);

				dispatch(profileLoadedFulFilled(profile));
			}
		} catch (error) {
			if (error instanceof Error) {
				dispatch(profileLoadedRejected(error));
			}
		}
	};
}

export function updateProfile({
	user,
	profile,
}: {
	user: User;
	profile: ProfileType;
}): AppThunk<Promise<void>> {
	return async (dispatch) => {
		dispatch(userUpdatePending());
		dispatch(profileUpdatePending());
		try {
			dispatch(userUpdateFulFilled(user));
			dispatch(profileUpdateFulFilled(profile));
			// console.log(getState().auth.user);
		} catch (error) {
			if (error instanceof Error) {
				dispatch(userUpdateRejected(error));
			}
		}
	};
}

export type UserActions =
	| UserUpdatePending //User
	| UserUpdateFulfilled //User
	| UserUpdateRejected; //User

export type UserActionsRejected = UserUpdateRejected;

export type ProfileActions =
	| ProfileUpdatePending //Profile
	| ProfileUpdateFulfilled //Profile
	| ProfileUpdateRejected //Profile
	| ProfileLoadedFulfilled //Profile Loaded
	| ProfileLoadedPending //Profile Loaded
	| ProfileLoadedRejected; //Profile Loaded

export type ProfileActionsRejected =
	| ProfileUpdateRejected
	| ProfileLoadedRejected;
