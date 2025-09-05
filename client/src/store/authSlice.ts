// src/features/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginService } from "../pages/login/service";

interface User {
	id: number;
	name: string;
	email: string;
	photo?: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

const token = localStorage.getItem("auth");
const initialState: AuthState = {
	user: null,
	isAuthenticated: !!token,
	status: "idle",
	error: null,
};

export const login = createAsyncThunk(
	"auth/login",
	async (credentials: { email: string; password: string }, thunkAPI) => {
		try {
			const user = await loginService(credentials);
			return user;
		} catch (err: unknown) {
			if (err instanceof Error) {
				return thunkAPI.rejectWithValue(err.message);
			}
			return thunkAPI.rejectWithValue("Error en login");
		}
	},
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.status = "idle";
			state.error = null;
			localStorage.removeItem("auth");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.user = action.payload;
				state.isAuthenticated = true;
			})
			.addCase(login.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
				state.isAuthenticated = false;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
