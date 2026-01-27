
import { getSocket } from "./socket";

export const subscribeSocketConnection = (callback: (connected: boolean) => void) => {
  const socket = getSocket();
  if (!socket) return;


  callback(socket.connected);


  socket.on("connect", () => {
    callback(true);
  });
  
  const handleDisconnect = () => callback(false);
  socket.on("disconnect", handleDisconnect);
  socket.on("connect_error", handleDisconnect);

  return () => {
    socket.off("connect");
    socket.off("disconnect", handleDisconnect);
    socket.off("connect_error", handleDisconnect);
  };
};
