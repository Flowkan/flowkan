import { register } from "./service";
import { apiClient } from "../../api/client";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import type { User } from "./types";
import type { Mock } from "vitest";

vi.mock("../../api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe("register", () => {
  const baseUser: User = {
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "securePass123",
    confirmPassword: "securePass123",
    photo: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería llamar a apiClient.post con los parámetros correctos cuando photo es null", async () => {
    const mockUser: User = { ...baseUser, photo: null };

    await register(mockUser);

    expect(apiClient.post).toHaveBeenCalledWith(
      USER_ENDPOINTS.REGISTER,
      mockUser,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  });

  it("debería llamar a apiClient.post con los parámetros correctos cuando photo es un File", async () => {
    const file = new File(["contenido"], "foto.png", { type: "image/png" });
    const mockUser: User = { ...baseUser, photo: file };

    await register(mockUser);

    expect(apiClient.post).toHaveBeenCalledWith(
      USER_ENDPOINTS.REGISTER,
      mockUser,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  });

  it("debería propagar un error si apiClient.post falla", async () => {
    const mockUser: User = { ...baseUser, photo: null };
    const mockError = new Error("Network error");

    (apiClient.post as unknown as Mock).mockRejectedValueOnce(mockError);

    await expect(register(mockUser)).rejects.toThrow("Network error");
  });

  it("debería manejar errores genéricos correctamente", async () => {
    const mockUser: User = { ...baseUser, photo: null };

    (apiClient.post as unknown as Mock).mockRejectedValueOnce("Algo salió mal");

    await expect(register(mockUser)).rejects.toEqual("Algo salió mal");
  });
});