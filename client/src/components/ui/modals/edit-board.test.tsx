import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BoardsState } from "../../../store/types/defaultStates";
import { Provider, useDispatch } from "react-redux";
import EditBoard from "./edit-board";
import type { Board, EditBoardsData } from "../../../pages/boards/types";

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

	const board: Board = {
		id: "1",
		slug: "board-1",
		title: "board 1",
		lists: [],
		members: [],
		image: "",
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
		expect(screen.getByText("Editar tablero")).toBeDefined();
	});

	test("should call handleEditForm with updated title", async () => {
		renderComponent();

		const titleInput = screen.getByLabelText(/Nuevo título/);
		const editButton = screen.getByRole("button", { name: /EDITAR/i });

		expect(editButton).toHaveTextContent("EDITAR");
		expect(editButton).toBeDisabled();

		await userEvent.type(titleInput, "updated title");

		expect(editButton).toBeEnabled();

		await userEvent.click(editButton);

		expect(handleEditForm).toHaveBeenCalledWith({ title: "updated title" });
		expect(handleHideMessage).toHaveBeenCalled();
	});

	test("should call handleEditForm with updated image", async () => {
		renderComponent();

		const fileChanged = screen.getByLabelText(/Nuevo fondo/);
		const editButton = screen.getByRole("button", { name: /EDITAR/i });

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

	test("should render error");
});
