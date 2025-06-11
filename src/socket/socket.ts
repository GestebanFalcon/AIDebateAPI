import type { Server, Socket } from "socket.io";
import { z } from "zod";

export const sockets: {
    init: (io: Server) => void;
    // object.userId.socketId (one user can have multiple sockets attached to their id)
    socketsByUserId: {[key: string]: {[key: string]: Socket}};
    userIdBySocketId: {[key: string]: string};
    emitToUser: (userId: string, eventName: string, data: any) => void
} = {
    init: (io: Server) => {
        io.on("connect", (socket) => {
            console.log("hehe");
            const { userId } = socket.handshake?.query;
            console.log(userId);

            // Check if there is a valid userId
            if (!userId) {
                socket.disconnect(true);
                return;
            }
            const result = z.string().safeParse(userId)
            if (!result.success) {
                socket.disconnect(true);
                return;
            };
            const id = userId as string;

            //Add socket to stored sockets
            if (!sockets.socketsByUserId[id]) {
                sockets.socketsByUserId[id]= {};
                sockets.socketsByUserId[id][socket.id] = socket;
            }
            //reference back the userId
            sockets.userIdBySocketId[socket.id] = id;

            // Register listeners
            socket.on('gurt', () => {
                console.log("yo " + userId);
                io.of('/').sockets.forEach(eachSocket => {eachSocket.disconnect()});
            })
            socket.on('disconnect', () => {
                console.log("Bye Bye");
                delete sockets.userIdBySocketId[socket.id];
                if (sockets.socketsByUserId[id]){
                    delete sockets.socketsByUserId[id][socket.id];
                }
                
                
            });
        });
    },
    socketsByUserId: {},
    userIdBySocketId: {},
    emitToUser: (userId: string, eventName: string, data: any) => {
        const userSockets = sockets.socketsByUserId[userId]
        if (!userSockets) return;
        for (const socket of Object.values(userSockets)) {
            socket.emit(eventName, data);
        }
    }
}