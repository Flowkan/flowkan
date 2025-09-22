import { Server, Socket } from "socket.io";
import BoardService from "../services/BoardService";
import BoardModel from "../models/BoardModel";
import prisma from "../config/db";

const boardService = new BoardService(new BoardModel(prisma));

type OnlineEntry = { socketId: string; userId: string };
const onlineUsers = new Map<string, Map<string, OnlineEntry>>();  //: Record<string, { socketId: string; userId: number }[]> = {};

export default function registerBoardSockets(io: Server, socket: Socket) {
  socket.on("joinBoard", async ({ boardId, userId }) => {
    try {
      const usersInBoard = await boardService.getBoardUsers({
        userId,
        boardId,
      });
      const isMember = usersInBoard.some((u) => u.id === userId);

      if (!isMember) {
        console.warn(
          `Usuario ${userId} intentó unirse a tablero ${boardId} sin permisos`,
        );
        return;
      }

      console.log('hola mundo');
      
      socket.join(boardId);
      socket.on('dragStart',({start,boardId})=>{          
        io.to(boardId).emit("movingCard",start)  
      })

      let boardMap = onlineUsers.get(boardId)
      if(!boardMap){
        boardMap = new Map<string,OnlineEntry>();
        onlineUsers.set(boardId,boardMap)
      }
      boardMap.set(socket.id,{socketId:socket.id,userId})
      // if (!onlineUsers[boardId]) onlineUsers[boardId] = [];
      // onlineUsers[boardId].push({ socketId: socket.id, userId });

      emitBoardUsers(io, boardId, userId).catch((err)=>console.error("emitBoardUsers",err));      
    } catch (error) {
      console.error("Error en joinBoard:", error);
    }
  });

  // socket.on("disconnect", async () => {
  //   try {
  //     for (const boardId in onlineUsers) {
  //       const before = onlineUsers[boardId].length;
  //       onlineUsers[boardId] = onlineUsers[boardId].filter(
  //         (u) => u.socketId !== socket.id,
  //       );

  //       if (before !== onlineUsers[boardId].length) {
  //         // Emitimos siempre, aunque el tablero quede vacío
  //         const anyUserId = onlineUsers[boardId]?.[0]?.userId || null;
  //         await emitBoardUsers(io, boardId, anyUserId);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error en disconnect:", error);
  //   }
  // });
}

async function emitBoardUsers(
  io: Server,
  boardId: string,
  userId: number | null,
) {
  const members = await boardService.getBoardUsers({ boardId });

  const membersWithStatus = onlineUsers.get(boardId)?.entries()
  if(!membersWithStatus)return;
  // console.log(Array.from(membersWithStatus));
  // console.log(members.find(m=>m.id === 1));
  
  const usersOnline =  Array.from(membersWithStatus).map(([key,value])=>{
    const m = members.find(m => {
      // console.log(m);      
      return m.id === Number(value.userId)
    })
    return {
      id: m?.id,
      name: m?.name,
      email: m?.email,
      photo: m?.photo,
    }
  })
  // console.log(usersOnline);
  
  io.to(boardId).emit("boardUsers", usersOnline);
  
    // .filter((m) => onlineUsers[boardId]?.some((ou) => ou.userId === m.id))
    // .map((m) => ({
    //   id: m.id,
    //   name: m.name,
    //   email: m.email,
    //   photo: m.photo,
    // }));

  
}

export function handleMoveTask(io:Server,socket:Socket){
  
  // socket.on('dragStart',({start,boardId})=>{          
  //   io.emit("movingCard",start)  
  // })

  // disconnect(io,socket)

}

function disconnect(io:Server,socket:Socket){
  socket.on("disconnect", async () => {
    try {
      const boardsChanged: Array<{ boardId: string; anyUserId: string | null }> = [];

      for (const [boardId, boardMap] of onlineUsers.entries()) {
        if (boardMap.has(socket.id)) {
          boardMap.delete(socket.id);
          const anyUserId = boardMap.size ? Array.from(boardMap.values())[0].userId : null;
          boardsChanged.push({ boardId, anyUserId });

          if (boardMap.size === 0) {
            onlineUsers.delete(boardId);
          }
        }
      }

      // Emitir sin bloquear la desconexión
      for (const { boardId, anyUserId } of boardsChanged) {
        emitBoardUsers(io, boardId, null).catch((err) =>
          console.error("emitBoardUsers en disconnect:", err),
        );
      }
    } catch (error) {
      console.error("Error en disconnect:", error);
    }
  });
}
