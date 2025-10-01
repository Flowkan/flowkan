import { register } from "./service";
import { apiClient } from "../../api/client";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import type { UserRegister } from "./types";
import type { Mock } from "vitest";

vi.mock("../../api/client", () => ({
	apiClient: {
		post: vi.fn(),
	},
}));

describe("register", () => {
	const baseUser: UserRegister = {
		name: "Juan Pérez",
		email: "juan@example.com",
		password: "securePass123",
		confirmPassword: "securePass123",
		photo: null,
		turnstileResponse: "adsfasdf",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should call apiClient.post with the correct parameters when photo is null", async () => {
		const mockUser: UserRegister = { ...baseUser, photo: null };

		await register(mockUser);

		expect(apiClient.post).toHaveBeenCalledWith(
			USER_ENDPOINTS.REGISTER,
			mockUser,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);
	});

	it("should call apiClient.post with the correct parameters when photo is a File", async () => {
		const file = new File(["contenido"], "foto.png", { type: "image/png" });
		const mockUser: UserRegister = { ...baseUser, photo: file };

		await register(mockUser);

		expect(apiClient.post).toHaveBeenCalledWith(
			USER_ENDPOINTS.REGISTER,
			mockUser,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);
	});

	it("should propagate an error if apiClient.post fails", async () => {
		const mockUser: UserRegister = { ...baseUser, photo: null };
		const mockError = new Error("Network error");

		(apiClient.post as unknown as Mock).mockRejectedValueOnce(mockError);

		await expect(register(mockUser)).rejects.toThrow("Network error");
	});

	it("should handle duplicate email error", async () => {
		const mockUser: UserRegister = { ...baseUser, photo: null };
		const prismaError = {
			response: {
				data: {
					code: "P2002",
					message: "El email ya está registrado",
				},
			},
		};

		(apiClient.post as unknown as Mock).mockRejectedValueOnce(prismaError);

		await expect(register(mockUser)).rejects.toEqual(prismaError);
	});

	it("should handle generic errors correctly", async () => {
		const mockUser: UserRegister = { ...baseUser, photo: null };

		(apiClient.post as unknown as Mock).mockRejectedValueOnce("Algo salió mal");

		await expect(register(mockUser)).rejects.toEqual("Algo salió mal");
	});
});
