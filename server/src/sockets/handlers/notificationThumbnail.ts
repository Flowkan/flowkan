import { appEvents } from "../../events/appEvents";
import { ServerUser, SocketUser, ThumbnailCompletedPayload } from "../types";

export default class NotificationThumbnailHandler {
  constructor(private readonly io: ServerUser) {
    this.listenToAppEvents();
  }
  initialize(socket: SocketUser) {
    this.handleJoinRoom(socket);
  }
  handleJoinRoom(socket: SocketUser) {
    const user = socket.data.user;
    if (!user) return;
    socket.join(String(user.id));
  }
  handleThumbnailLoading(data: { userId: number; originalPath: string }) {
    // if(!socket.data.user)return;
    this.io.to(String(data.userId)).emit("user:thumbnailLoading", data);
  }
  handleThumbnailComplete(data: ThumbnailCompletedPayload) {
    // if(!socket.data.user)return;
    this.io.to(String(data.userId)).emit("user:thumbnailCompleted", data);
  }
  handleThumbnailError(data: { userId: number; thumbnailName: string }) {
    // if(!socket.data.user)return;
    this.io.to(String(data.userId)).emit("user:thumbnailError");
  }

  private listenToAppEvents() {
    appEvents.on(
      "thumbnail:processing",
      this.handleThumbnailLoading.bind(this),
    );
    appEvents.on(
      "thumbnail:completed",
      this.handleThumbnailComplete.bind(this),
    );
    // appEvents.on('thumbnail:error', this.handleThumbnailError.bind(this));
  }
}
