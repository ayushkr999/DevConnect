import { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  MessageCircle,
  Search,
  Send,
  ArrowLeft,
  Clock,
  Sparkles,
  Users,
  ShieldAlert,
} from "lucide-react";
import { BASE_URL } from "../utils/constant";
import { createSocketConnection } from "../utils/socket";
import { addConnections } from "../utils/connectionSlice";

// Format timestamps for message bubbles (e.g., "2:45 PM")
const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Format timestamps for conversation sidebar items
const formatSidebarTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default function Chat() {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const reduxConnections = useSelector((store) => store.connections) || [];
  const userId = user?._id;

  // Local state
  const [connectionsList, setConnectionsList] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatError, setChatError] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 1. Fetch Connections and Recent Conversations
  const fetchInitialData = async () => {
    try {
      const [connectionsRes, conversationsRes] = await Promise.allSettled([
        axios.get(BASE_URL + "/user/connections", { withCredentials: true }),
        axios.get(BASE_URL + "/chat/recent/conversations", { withCredentials: true }),
      ]);

      if (connectionsRes.status === "fulfilled" && connectionsRes.value?.data?.data) {
        const conns = connectionsRes.value.data.data;
        setConnectionsList(conns);
        dispatch(addConnections(conns));
      }

      if (
        conversationsRes.status === "fulfilled" &&
        conversationsRes.value?.data?.conversations
      ) {
        setRecentConversations(conversationsRes.value.data.conversations);
      }
    } catch (err) {
      console.error("Failed to fetch initial chat data:", err.message);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Update connectionsList if redux store updates
  useEffect(() => {
    if (reduxConnections.length > 0 && connectionsList.length === 0) {
      setConnectionsList(reduxConnections);
    }
  }, [reduxConnections]);

  // 2. Build merged contacts list (Connections + Last Message summary)
  const contacts = useMemo(() => {
    const list = connectionsList.map((conn) => {
      // Find matching recent conversation
      const conv = recentConversations.find(
        (c) => c.targetUser?._id?.toString() === conn._id?.toString()
      );

      return {
        _id: conn._id,
        firstname: conn.firstname,
        lastname: conn.lastname,
        photoUrl: conn.photoUrl,
        skills: conn.skills || [],
        AboutUs: conn.AboutUs,
        lastMessage: conv?.lastMessage || null,
        updatedAt: conv?.updatedAt || null,
      };
    });

    // Sort contacts: contacts with recent messages first, then others
    list.sort((a, b) => {
      if (a.updatedAt && b.updatedAt) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      if (a.updatedAt) return -1;
      if (b.updatedAt) return 1;
      return (a.firstname || "").localeCompare(b.firstname || "");
    });

    return list;
  }, [connectionsList, recentConversations]);

  // Filter contacts by search query
  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    const term = searchTerm.toLowerCase();
    return contacts.filter((c) => {
      const name = `${c.firstname || ""} ${c.lastname || ""}`.toLowerCase();
      const skills = (c.skills || []).some((s) => s.toLowerCase().includes(term));
      const text = (c.lastMessage?.text || "").toLowerCase();
      return name.includes(term) || skills || text.includes(term);
    });
  }, [contacts, searchTerm]);

  // 3. Socket.IO Connection & Presence Management
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on("connect", () => {
      // Register online presence
      socket.emit("registerUser", userId);
      socket.emit("getOnlineUsers");

      if (targetUserId) {
        socket.emit("joinChat", {
          firstname: user.firstname,
          userId,
          targetUserId,
        });
      }
    });

    // Handle online users list
    socket.on("onlineUsersList", (list) => {
      setOnlineUserIds(list || []);
    });

    // Handle individual user status change
    socket.on("userStatusChange", ({ userId: changedId, status }) => {
      setOnlineUserIds((prev) => {
        if (status === "online") {
          return prev.includes(changedId) ? prev : [...prev, changedId];
        } else {
          return prev.filter((id) => id !== changedId);
        }
      });
    });

    // Handle incoming messages
    socket.on("messageReceived", (msg) => {
      // If message is for currently active conversation, append it
      if (
        (msg.senderId?.toString() === targetUserId?.toString() &&
          targetUserId?.toString() !== userId?.toString()) ||
        msg.senderId?.toString() === userId?.toString()
      ) {
        setMessages((prev) => {
          if (msg._id && prev.some((m) => m._id === msg._id)) {
            return prev;
          }
          return [
            ...prev,
            {
              _id: msg._id || Math.random().toString(),
              senderId: msg.senderId,
              firstname: msg.firstname,
              text: msg.text,
              createdAt: msg.createdAt || new Date(),
            },
          ];
        });
      }

      // Update recent conversations list so sidebar updates last message
      setRecentConversations((prev) => {
        const otherId =
          msg.senderId?.toString() === userId?.toString()
            ? targetUserId
            : msg.senderId?.toString();

        const existingIdx = prev.findIndex(
          (c) => c.targetUser?._id?.toString() === otherId?.toString()
        );

        const newLastMsg = {
          text: msg.text,
          senderId: msg.senderId,
          createdAt: msg.createdAt || new Date(),
        };

        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            lastMessage: newLastMsg,
            updatedAt: msg.createdAt || new Date(),
          };
          return updated;
        } else {
          return [
            {
              targetUser: { _id: otherId },
              lastMessage: newLastMsg,
              updatedAt: msg.createdAt || new Date(),
            },
            ...prev,
          ];
        }
      });
    });

    socket.on("messageError", ({ message }) => {
      setChatError(message || "Failed to send message");
      setTimeout(() => setChatError(""), 4000);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // 4. Fetch Active Conversation Messages when targetUserId changes
  useEffect(() => {
    if (!targetUserId) {
      setMessages([]);
      setTargetUser(null);
      setChatError("");
      return;
    }

    // Set fallback target user from contacts list while fetching
    const cachedContact = contacts.find(
      (c) => c._id?.toString() === targetUserId?.toString()
    );
    if (cachedContact) {
      setTargetUser(cachedContact);
    }

    const fetchChatMessages = async () => {
      setLoadingChat(true);
      setChatError("");
      try {
        const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
          withCredentials: true,
        });

        if (res.data?.targetUser) {
          setTargetUser(res.data.targetUser);
        }

        const rawMessages = res.data?.messages || res.data?.chat?.messages || [];
        const formatted = rawMessages.map((msg) => ({
          _id: msg._id,
          firstname: msg.senderId?.firstname,
          lastname: msg.senderId?.lastname,
          senderId: msg.senderId?._id || msg.senderId,
          photoUrl: msg.senderId?.photoUrl,
          text: msg.text,
          createdAt: msg.createdAt,
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch conversation:", err);
        if (err.response?.status === 403) {
          setChatError("You can only chat with confirmed connections.");
        } else {
          setChatError("Failed to load conversation history.");
        }
      } finally {
        setLoadingChat(false);
      }
    };

    fetchChatMessages();
  }, [targetUserId, contacts]);

  // 5. Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingChat]);

  // 6. Send Message handler
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !targetUserId || !userId) {
      return;
    }

    const textToSend = newMessage.trim();

    socketRef.current.emit("sendMessage", {
      firstname: user.firstname,
      userId,
      targetUserId,
      text: textToSend,
    });

    setNewMessage("");
  };

  const isTargetOnline =
    targetUserId && onlineUserIds.includes(targetUserId.toString());

  // ---------------- Render Empty State: No Connections at all ----------------
  if (contacts.length === 0 && !loadingChat) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] p-8 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7E8F0] text-[#D43F6C] mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#252525] mb-2">No Chats Available</h2>
          <p className="text-sm text-[#666666] leading-relaxed mb-6">
            You need to establish a connection before you can exchange direct messages. Connect with fellow developers on the home feed!
          </p>
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#D43F6C] hover:bg-[#c0325d] text-white font-semibold shadow-xs text-center transition duration-200"
          >
            <Sparkles className="w-4 h-4" />
            Discover Developers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Outer Card Container */}
      <div className="rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-sm overflow-hidden flex h-[calc(100vh-140px)] min-h-[520px]">
        
        {/* ==================== LEFT SIDEBAR: Conversation List ==================== */}
        <aside
          className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-[#E9E3EC] bg-[#FFFFFF] ${
            targetUserId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#E9E3EC]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#252525]">Chats</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F7E8F0] text-[#D43F6C]">
                  {contacts.length}
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAF5FB] border border-[#E9E3EC] text-[#252525] placeholder:text-[#8A8A8A] pl-9.5 pr-4 py-2 rounded-xl outline-none focus:border-[#D43F6C] focus:ring-1 focus:ring-[#D43F6C] transition duration-150 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#FAF5FB]">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-[#8A8A8A] text-xs sm:text-sm">
                No conversations found matching "{searchTerm}"
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected =
                  targetUserId?.toString() === contact._id?.toString();
                const isOnline = onlineUserIds.includes(contact._id?.toString());

                return (
                  <button
                    key={contact._id}
                    onClick={() => navigate(`/app/chat/${contact._id}`)}
                    className={`w-full text-left p-3.5 sm:p-4 flex items-center gap-3.5 transition duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-[#FAF5FB] border-l-4 border-l-[#D43F6C]"
                        : "hover:bg-[#FAF5FB]/60"
                    }`}
                  >
                    {/* Contact Avatar & Online Indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={
                          contact.photoUrl ||
                          "https://dummyimage.com/100x100/cccccc/000000&text=User"
                        }
                        alt={`${contact.firstname} ${contact.lastname}`}
                        className="w-11 h-11 rounded-2xl object-cover border border-[#E9E3EC]"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#FFFFFF] ${
                          isOnline ? "bg-[#18A866]" : "bg-neutral-300"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                      />
                    </div>

                    {/* Contact Info & Last Message Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-sm truncate ${
                            isSelected
                              ? "font-bold text-[#D43F6C]"
                              : "font-semibold text-[#252525]"
                          }`}
                        >
                          {contact.firstname} {contact.lastname}
                        </span>

                        {contact.lastMessage?.createdAt && (
                          <span className="text-[11px] text-[#8A8A8A] shrink-0 font-medium">
                            {formatSidebarTime(contact.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#666666] truncate font-normal">
                        {contact.lastMessage ? (
                          contact.lastMessage.text
                        ) : (
                          <span className="text-[#8A8A8A] italic">
                            No messages yet • Say hi 👋
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ==================== RIGHT PANEL: Active Conversation ==================== */}
        <main
          className={`flex-1 flex flex-col bg-[#FFFFFF] ${
            !targetUserId ? "hidden md:flex" : "flex"
          }`}
        >
          {targetUserId ? (
            <>
              {/* Conversation Top Header */}
              <div className="h-16 px-4 sm:px-6 border-b border-[#E9E3EC] bg-[#FFFFFF] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <Link
                    to="/app/chat"
                    className="md:hidden p-1.5 -ml-1 text-[#666666] hover:text-[#252525] rounded-lg hover:bg-[#FAF5FB] transition"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Link>

                  {/* Header Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        targetUser?.photoUrl ||
                        "https://dummyimage.com/100x100/cccccc/000000&text=User"
                      }
                      alt="Active user"
                      className="w-10 h-10 rounded-2xl object-cover border border-[#E9E3EC]"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#FFFFFF] ${
                        isTargetOnline ? "bg-[#18A866]" : "bg-neutral-300"
                      }`}
                    />
                  </div>

                  {/* Header User Details */}
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-bold text-[#252525] truncate">
                      {targetUser
                        ? `${targetUser.firstname} ${targetUser.lastname}`
                        : "Developer"}
                    </h2>
                    <p className="text-[11px] font-medium flex items-center gap-1.5">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          isTargetOnline ? "bg-[#18A866]" : "bg-neutral-400"
                        }`}
                      />
                      <span
                        className={
                          isTargetOnline ? "text-[#18A866]" : "text-[#8A8A8A]"
                        }
                      >
                        {isTargetOnline ? "Active now" : "Offline"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Target User Skills (Desktop view) */}
                {targetUser?.skills && targetUser.skills.length > 0 && (
                  <div className="hidden lg:flex items-center gap-1.5 overflow-hidden max-w-xs">
                    {targetUser.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F7E8F0] text-[#B8325A] border border-[#E9E3EC] truncate"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Error Banner if any */}
              {chatError && (
                <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{chatError}</span>
                </div>
              )}

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF5FB]">
                {loadingChat ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#8A8A8A] gap-2">
                    <div className="w-6 h-6 border-2 border-[#D43F6C] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs">Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFFFFF] border border-[#E9E3EC] flex items-center justify-center text-[#D43F6C] shadow-xs mb-3">
                      <MessageCircle className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-[#252525]">
                      Start a conversation
                    </h3>
                    <p className="text-xs text-[#666666] max-w-xs mt-1">
                      Say hello to {targetUser?.firstname || "your connection"} and discuss your next collaboration!
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isSender =
                      msg.senderId?.toString() === userId?.toString();

                    return (
                      <div
                        key={msg._id || index}
                        className={`flex flex-col ${
                          isSender ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[82%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs break-words ${
                            isSender
                              ? "bg-[#D43F6C] text-white rounded-tr-xs"
                              : "bg-[#FFFFFF] text-[#252525] border border-[#E9E3EC] rounded-tl-xs"
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        </div>

                        {/* Timestamp under bubble */}
                        <span className="text-[10px] text-[#8A8A8A] mt-1 px-1 font-medium">
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer Area */}
              <div className="p-3 sm:p-4 border-t border-[#E9E3EC] bg-[#FFFFFF]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Message ${
                      targetUser?.firstname || "connection"
                    }...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-[#FAF5FB] border border-[#E9E3EC] text-[#252525] placeholder:text-[#8A8A8A] px-4 py-2.5 rounded-xl outline-none focus:border-[#D43F6C] focus:ring-1 focus:ring-[#D43F6C] transition duration-150 text-xs sm:text-sm"
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#D43F6C] hover:bg-[#c0325d] disabled:opacity-50 disabled:pointer-events-none text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition duration-150 active:scale-[0.98] cursor-pointer shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            // ==================== Placeholder when no conversation is selected ====================
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAF5FB]">
              <div className="w-16 h-16 rounded-3xl bg-[#FFFFFF] border border-[#E9E3EC] flex items-center justify-center text-[#D43F6C] shadow-xs mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#252525] mb-2">
                Select a Conversation
              </h2>
              <p className="text-sm text-[#666666] max-w-sm leading-relaxed mb-6">
                Choose a connection from the list on the left to start exchanging real-time messages and project ideas.
              </p>
              <Link
                to="/app/connections"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E3EC] text-sm font-semibold text-[#252525] hover:bg-[#FAF5FB] hover:border-[#D43F6C] transition shadow-2xs"
              >
                <Users className="w-4 h-4 text-[#D43F6C]" />
                View All Connections
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}