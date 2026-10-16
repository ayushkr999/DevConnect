import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { createSocketConnection } from "../utils/socket.js";
import { BASE_URL } from "../utils/constant.js";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Chat() {

    const { targetUserId } = useParams();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("")
    const user = useSelector((store) => store.user);
    const userId = user?._id;
    const socketRef = useRef(null);

    const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => ({
        firstname: msg.senderId?.firstname,
        lastname: msg.senderId?.lastname,
        userId: msg.senderId?._id,
        text: msg.text,
        createdAt: msg.createdAt,
      }));

      setMessages(chatMessages);
    } catch (err) {
      console.error("Failed to fetch chat messages:", err.message);
    }
  };

useEffect(() => {
  fetchChatMessages();
}, []);

    useEffect(() => {
     if (!userId) return;

  const socket = createSocketConnection();
  socketRef.current = socket;

  socket.on("connect", () => {
    socket.emit("joinChat", { firstname: user.firstname, userId, targetUserId });
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("messageReceived", ({ firstname, text }) => {
    setMessages((prev) => [...prev, { firstname, text }]);
  })

  return () => socket.disconnect();
}, [userId, targetUserId])


     // Send message handler
   const sendMessage = () => {
   if (!socketRef.current || !newMessage.trim()) return;
   socketRef.current.emit("sendMessage",{
    firstname: user.firstname,
    userId,
    targetUserId,
    text : newMessage
   })
   setNewMessage("")
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2">
      <div className="rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-sm flex flex-col h-137.5 overflow-hidden">

        {/* Header */}
        <div className="border-b border-[#E9E3EC] px-5 py-4 text-[#252525] font-bold bg-[#FFFFFF] flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-[#18A866] rounded-full"></div>
          <span>Conversation</span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF5FB]">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#8A8A8A] text-sm">
              No messages yet. Send a message to start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.userId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[70%]">
                  <div
                    className={`text-xs text-[#8A8A8A] font-semibold mb-1 ${
                      msg.userId === userId ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.firstname}
                  </div>

                  <div
                    className={`
                      px-4 py-2.5 rounded-2xl text-sm wrap-break-word shadow-sm
                      ${
                        msg.userId === userId
                          ? "bg-[#D43F6C] text-white rounded-tr-sm"
                          : "bg-[#FFFFFF] text-[#252525] rounded-tl-sm border border-[#E9E3EC]"
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#E9E3EC] p-4 flex gap-2 bg-[#FFFFFF]">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newMessage.trim()) {
                sendMessage();
              }
            }}
            className="flex-1 bg-[#FAF5FB] border border-[#E9E3EC] text-[#252525] placeholder:text-[#8A8A8A] px-4 py-2.5 rounded-xl outline-none focus:border-[#D43F6C] focus:ring-1 focus:ring-[#D43F6C] transition duration-150 text-sm"
          />

          <button
            className="bg-[#D43F6C] hover:bg-[#c0325d] text-white px-5 py-2.5 rounded-xl transition font-semibold text-sm shadow-sm active:scale-[0.98] cursor-pointer"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}