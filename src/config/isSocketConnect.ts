import { getSocket } from "./socket";

export const subscribeSocketConnection = (
  callback: (connected: boolean) => void
) => {
  const socket = getSocket();


  if (!socket.connected) {
    socket.connect();
  }

  if (socket.connected) {
    callback(true);
  }

  const onConnect = () => {
    callback(true);
  };

  const onDisconnect = () => {
    callback(false);
  };

  const onError = () => {
    callback(false);
  };

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("connect_error", onError);


  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("connect_error", onError);
  };
};
