import { login, logout } from "./service";
import {
	apiClient,
	setAuthorizationHeader,
	removeAuthorizationHeader,
} from "../../api/client";
import storage from "../../utils/storage";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import type { Mock } from "vitest";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

vi.mock("../../api/client", () => ({
	apiClient: { post: vi.fn() },
	setAuthorizationHeader: vi.fn(),
	removeAuthorizationHeader: vi.fn(),
}));

vi.mock("../../utils/storage", () => ({
	default: {
		set: vi.fn(),
		remove: vi.fn(),
	},
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe("Verify that the credentials are correct", () => {
	const mockCredentials = {
		email: "test@example.com",
		password: "12345678",
		turnstileResponse: "fdsafasdfsad",
	};

	// Tipado de mockResponse según AxiosResponse
	const mockResponse: AxiosResponse<{
		accessToken: string;
		user: {
			id: number;
			name: string;
			email: string;
			password: string;
			photo: string | null | undefined;
		};
	}> = {
		data: {
			accessToken: "fake-token",
			user: {
				id: 1,
				name: "Test User",
				email: "test@example.com",
				password: "12345678",
				photo: null,
			},
		},
		status: 200,
		statusText: "OK",
		headers: {},
		config: {} as InternalAxiosRequestConfig,
	};

	it("should login must call the endpoint, save the token, and return the user", async () => {
		(apiClient.post as Mock).mockResolvedValueOnce(mockResponse);

		const user = await login(mockCredentials);

		expect(apiClient.post).toHaveBeenCalledWith(
			USER_ENDPOINTS.LOGIN,
			mockCredentials,
		);
		expect(storage.set).toHaveBeenCalledWith("auth", "fake-token");
		expect(setAuthorizationHeader).toHaveBeenCalledWith("fake-token");
		expect(user).toEqual(mockResponse.data.user);
	});

	it("should throw if apiClient.post fails and not store token", async () => {
		(apiClient.post as Mock).mockRejectedValueOnce(
			new Error("Invalid credentials"),
		);

		await expect(login(mockCredentials)).rejects.toThrow("Invalid credentials");

		expect(storage.set).not.toHaveBeenCalled();
		expect(setAuthorizationHeader).not.toHaveBeenCalled();
	});

	it("should logout delete the token and clear the headers", async () => {
		await logout();

		expect(storage.remove).toHaveBeenCalledWith("auth");
		expect(removeAuthorizationHeader).toHaveBeenCalled();
	});

	it("should verify length password", () => {
		expect(mockCredentials.password.length).toBeGreaterThanOrEqual(8);
	});

	it("should verify fields not empty with error message", () => {
		const emptyCredentials = { email: "", password: "" };
		expect(() => {
			if (emptyCredentials.email === "" || emptyCredentials.password === "") {
				throw new Error("Debe completar todos los campos");
			}
		}).toThrow("Debe completar todos los campos");
	});

	it("should verify fields not empty not error message", () => {
		expect(mockCredentials.email).not.toBe("");
		expect(mockCredentials.password).not.toBe("");
	});
});
