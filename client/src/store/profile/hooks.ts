import { useCallback } from "react";
import { useAppDispatch } from "..";
import type { User } from "../../pages/login/types";
import type { ProfileType } from "../../pages/profile/types";
import { loadedProfile, updateProfile } from "./actions";

//
// ─── BOARDS PROFILE ──────────────────────────────────────────────
//

export function useUpdatedProfile() {
	const dispatch = useAppDispatch();
	return function ({ user, profile }: { user: User; profile: ProfileType }) {
		return dispatch(updateProfile({ user, profile }));
	};
}

export function useLoadedProfile() {
	const dispatch = useAppDispatch();
	const loadProfile = useCallback(() => {
		return dispatch(loadedProfile());
	}, [dispatch]);
	return loadProfile;
}
