// socket.js
import { io } from "socket.io-client";
import { SOCKET_URL } from "./constant.js";

export const createSocketConnection = () => {
  return io(SOCKET_URL, {
    withCredentials: true,
  });
};