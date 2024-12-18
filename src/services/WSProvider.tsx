import { tokenStorage } from "@/store/storage";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "./config";
import { refresh_tokens } from "./apiIntercepetors";

interface WSService {
  initializeSocket: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, cb: (data: any) => void) => void;
  off: (event: string) => void;
  removeListener: (listenerName: string) => void;
  updatedAccessToken: () => void;
  disconnect: () => void;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socketAccessToken, setSocketAccessToken] = useState<string | null>(null);
  const socket = useRef<Socket>();

  useEffect(() => {
    const token = tokenStorage.getString('access_token') as any;
    setSocketAccessToken(token);
  }, []);

  useEffect(() => {
    if (socketAccessToken) {
      socket.current = io(SOCKET_URL, {
        transports: ['websocket'],
        withCredentials: true,
        extraHeaders: {
          access_token: socketAccessToken || "",
        },
      });

      socket.current.on('connect_error', (error) => {
        if (error.message === "Authentication error") {
          console.log("Auth connection error ", error.message);
          refresh_tokens().then(() => {
            // Assuming refresh_tokens updates the token in localStorage.
            const newToken = tokenStorage.getString('access_token') as string;
            setSocketAccessToken(newToken);
            socket.current?.disconnect();
            socket.current?.connect(); // Reconnect with the new token
          });
        }
      });

    

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [socketAccessToken]);

  const emit = (event: string, data: any = {}) => {
    socket.current?.emit(event, data);
  };

  const on = (event: string, cb: (data: any) => void) => {
    socket.current?.on(event, cb);
  };

  const off = (event: string) => {
    socket.current?.off(event);
  };

  const removeListener = (listenerName: string) => {
    socket.current?.removeListener(listenerName);
  };

  const disconnect = () => {
    socket.current?.disconnect();
    socket.current = undefined;
  };

  const updatedAccessToken = () => {
    const token = tokenStorage.getString('access_token') as any;
    setSocketAccessToken(token);
  };

  const socketService: WSService = {
    initializeSocket: () => {},
    emit,
    on,
    off,
    disconnect,
    removeListener,
    updatedAccessToken,
  };

  return <WSContext.Provider value={socketService}>{children}</WSContext.Provider>;
};

export const useWS = (): WSService => {
  const socketService = useContext(WSContext);
  if (!socketService) {
    throw new Error("useWS must be used within a WS Provider");
  }
  return socketService;
};
