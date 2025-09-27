import {
  DragStart,
  DragUpdate,
  DropResult,
  ServerBoard,
  SocketBoard,
  Task,
} from "../types";

export default class BoardHandler {
  private readonly locks = new Map<string, string>();
  constructor(private readonly io: ServerBoard) {}
  initialize(socket: SocketBoard) {
    socket.on("board:dragstart", ({ start, task, x, y }) =>
      this.handleDragStart(socket, { start, task, x, y }),
    );
    socket.on("board:dragsendcoords", ({ x, y }) =>
      this.handleDragCatchCoords(socket, { x, y }),
    );
    socket.on("board:dragupdate", ({ update }) =>
      this.handleUpdate(socket, update),
    );
    socket.on("board:dragend", ({ result }) =>
      this.handleDragEnd(socket, result),
    );
  }

  private handleDragStart(
    socket: SocketBoard,
    payload: { start: DragStart; task: Task; x: number; y: number },
  ) {
    const { start, task, x, y } = payload;
    if (!socket.data.room) return;

    const { draggableId } = start;
    const userId = socket.data.user?.id;
    if (!userId) return;

    this.locks.set(draggableId, String(userId));
    socket.to(socket.data.room).emit("board:dragstarted", {
      userId: String(userId),
      name: String(socket.data?.user?.name),
      start,
      task,
      x,
      y,
      board: socket.data.board,
    });
  }

  private handleDragCatchCoords(
    socket: SocketBoard,
    payload: { x: number; y: number },
  ) {
    if (!socket.data.room) return;
    const { x, y } = payload;
    socket.to(socket.data.room).emit("board:dragshowcoords", {
      x,
      y,
    });
  }
  private handleUpdate(socket: SocketBoard, update: DragUpdate) {
    if (!socket.data.room) return;
    socket.to(socket.data.room).emit("board:dragupdated", {
      update,
    });
  }
  private handleDragEnd(socket: SocketBoard, result: DropResult) {
    if (!socket.data.room) return;

    const { draggableId } = result;
    const userId = socket.data.user?.id;

    if (draggableId && userId) {
      //Elimina el bloqueo de la tarea arrastrada
      const lockOwner = this.locks.get(draggableId);
      if (lockOwner === String(userId)) {
        this.locks.delete(draggableId);
      }
    }

    socket.to(socket.data.room).emit("board:dragend", {
      result,
    });
  }
}
