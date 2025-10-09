import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BoardsState } from "../../../store/types/defaultStates";
import { Provider } from "react-redux";
import EditBoard from "./edit-board";
import { toast } from "react-hot-toast";

vi.mock("react-hot-toast", () => {
	const toast = {
		custom: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
	};
	return {
		__esModule: true,
		default: toast,
		toast,
	};
});

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

describe("EditBoard", () => {
	const state: BoardsState = {
		auth: {
			isAuthenticated: false,
			error: null,
			user: null,
		},
		profile: null,
		boards: {
			boards: [],
			currentBoard: null,
			loading: false,
			error: null,
			currentPage: 1,
			totalPages: 1,
			hasMore: false,
		},
		ui: { pending: false, error: null },
	};

	const handleEditForm = vi.fn();
	const handleHideMessage = vi.fn();

	const renderComponent = (error?: Error) => {
		if (error) {
			state.ui.error = error;
		}

		return render(
			<Provider
				store={{
					getState: () => state,
					//@ts-expect-error
					subscribe: () => {},
					//@ts-expect-error
					dispatch: () => {},
				}}
			>
				<EditBoard
					handleEditForm={handleEditForm}
					handleHideMessage={handleHideMessage}
					oldTitle=""
				/>
			</Provider>,
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("should render", () => {
		const { container } = renderComponent();

		expect(container).toMatchSnapshot();
		expect(screen.getByText("editBoard.form.header")).toBeDefined();
	});

	test("should call handleEditForm with updated title", async () => {
		renderComponent();

		const titleInput = screen.getByLabelText(/editBoard.form.newTitle/);
		const editButton = screen.getByRole("button", { name: /editBoard.edit/i });

		expect(editButton).toHaveTextContent("editBoard.edit");
		expect(editButton).toBeDisabled();

		await userEvent.type(titleInput, "updated title");

		expect(editButton).toBeEnabled();

		await userEvent.click(editButton);

		expect(handleEditForm).toHaveBeenCalledWith({ title: "updated title" });
		expect(handleHideMessage).toHaveBeenCalled();
	});

	test("should call handleEditForm with updated image", async () => {
		renderComponent();

		const fileChanged = screen.getByLabelText(/editBoard.form.newImg/);
		const editButton = screen.getByRole("button", { name: /editBoard.edit/i });

		const file = new File(["content"], "test-image.png", {
			type: "image/png",
		});

		await userEvent.upload(fileChanged, file);
		await userEvent.click(editButton);

		expect(handleEditForm).toHaveBeenCalledWith({
			image: file,
		});
		expect(handleHideMessage).toHaveBeenCalled();
	});

	test("should render error", async () => {
		renderComponent();

		const fileChanged = screen.getByLabelText(/editBoard.form.newImg/);
		const editButton = screen.getByRole("button", { name: /editBoard.edit/i });

		const bigFile = new File(["a".repeat(6 * 1024 * 1024)], "big.png", {
			type: "image/png",
		});

		await userEvent.upload(fileChanged, bigFile);
		await userEvent.click(editButton);

		expect(toast.custom).toHaveBeenCalledTimes(1);
		expect(toast.custom).toHaveBeenCalledWith(expect.any(Function));
	});
});
