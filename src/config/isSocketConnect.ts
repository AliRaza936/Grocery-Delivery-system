// config/isSocketConnect.ts
import { getSocket } from "./socket";

let socketConnected = false;

export const subscribeSocketConnection = (callback: (connected: boolean) => void) => {
  const socket = getSocket();


  callback(socket.connected);

  socket.on("connect", () => {
    socketConnected = true;
    callback(true);
  });

  socket.on("disconnect", () => {
    socketConnected = false;
    callback(false);
  });

  socket.on("connect_error", () => {
    socketConnected = false;
    callback(false);
  });
};
