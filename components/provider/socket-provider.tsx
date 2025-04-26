"use client";
import { createContext, useContext, useEffect, useState } from "react";

import { io as ServerIO } from "socket.io-client";

type SocketContext = {
  socket: any | null;
  isConnected: boolean;
};

const CreateSocketContext = createContext<SocketContext>({
  socket: null,
  isConnected: false,
});

export const SocketContext = () => {
  return useContext(CreateSocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ServerIO as any)(
      process.env.NEXT_PUBLIC_CITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      },
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <CreateSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </CreateSocketContext.Provider>
  );
};
