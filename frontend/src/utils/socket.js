import { io } from "socket.io-client";
import { SOCKET_URL } from "./constant.js";

export const createSocketConnection = () =>
  io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"], // websocket first, polling fallback for Render
  });