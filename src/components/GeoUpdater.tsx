"use client";

import { getSocket } from "@/config/socket";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

function GeoUpdater({ userId }: { userId: string }) {
  const { status } = useSession();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!userId) return;

    const socket = getSocket();
    socketRef.current = socket;

    socket.connect();
    socket.emit("identity", userId);

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("updateLocation", {
          userId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
      socket.disconnect();
    };
  }, [status, userId]);

  return null;
}

export default GeoUpdater;
