import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { MessageCircle, Users, Search, Sparkles } from "lucide-react";

const Connection = () => {
  const connections = useSelector((store) => store.connections) || [];
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Failed to fetch connections:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filteredConnections = connections.filter((conn) => {
    const fullName = `${conn.firstname || ""} ${conn.lastname || ""}`.toLowerCase();
    const skillsMatch = (conn.skills || []).some((s) =>
      s.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const bioMatch = (conn.AboutUs || "").toLowerCase().includes(searchTerm.toLowerCase());
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      skillsMatch ||
      bioMatch
    );
  });

  if (!loading && connections.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7E8F0] text-[#D43F6C] mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#252525] mb-2">No Connections Yet</h2>
          <p className="text-sm text-[#666666] leading-relaxed mb-6">
            You haven't connected with any other developers yet. Discover peers with shared tech stacks on the feed!
          </p>
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#D43F6C] hover:bg-[#c0325d] text-white font-semibold shadow-sm text-center transition duration-200"
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
      {/* Page Header with Stats and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#252525]">
              Your Connections
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F7E8F0] text-[#D43F6C]">
              {connections.length} {connections.length === 1 ? "developer" : "developers"}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-[#666666]">
            Collaborate, network, and exchange real-time messages with your peer developers.
          </p>
        </div>

        {/* Search input for connections */}
        {connections.length > 0 && (
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E9E3EC] text-[#252525] placeholder:text-[#8A8A8A] pl-10 pr-4 py-2 rounded-xl outline-none focus:border-[#D43F6C] focus:ring-1 focus:ring-[#D43F6C] transition duration-150 text-sm shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* Grid of Connections */}
      {filteredConnections.length === 0 && searchTerm ? (
        <div className="rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] p-10 text-center shadow-xs">
          <p className="text-sm text-[#666666]">
            No connections found matching "<span className="font-semibold text-[#252525]">{searchTerm}</span>"
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-3 text-xs font-semibold text-[#D43F6C] hover:underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredConnections.map((connection) => {
            const formattedGender = connection.gender
              ? connection.gender.charAt(0).toUpperCase() + connection.gender.slice(1)
              : "";

            return (
              <div
                key={connection._id}
                className="flex flex-col justify-between p-5 bg-[#FFFFFF] border border-[#E9E3EC] rounded-2xl shadow-xs hover:border-[#D43F6C]/40 hover:shadow-sm transition-all duration-200"
              >
                <div>
                  {/* Top section: Avatar, Info, Message button */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={
                            connection.photoUrl ||
                            "https://dummyimage.com/100x100/cccccc/000000&text=User"
                          }
                          alt={`${connection.firstname} ${connection.lastname}`}
                          className="h-14 w-14 rounded-2xl object-cover border border-[#E9E3EC]"
                        />
                        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#FFFFFF] bg-[#18A866]"></span>
                      </div>

                      {/* Name & Demographic info */}
                      <div>
                        <h2 className="text-base font-bold text-[#252525] leading-snug">
                          {connection.firstname} {connection.lastname}
                        </h2>

                        <p className="text-xs text-[#8A8A8A] font-medium mt-0.5">
                          {connection.age ? `${connection.age} yrs` : "Developer"}
                          {formattedGender ? ` • ${formattedGender}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Quick Message Button */}
                    <Link
                      to={`/app/chat/${connection._id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#D43F6C] hover:bg-[#c0325d] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition duration-150 shrink-0 cursor-pointer"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Message</span>
                    </Link>
                  </div>

                  {/* Bio */}
                  {connection.AboutUs && (
                    <p className="mt-3 text-xs sm:text-sm text-[#666666] leading-relaxed line-clamp-2">
                      "{connection.AboutUs}"
                    </p>
                  )}
                </div>

                {/* Skills tags footer */}
                {connection.skills && connection.skills.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#FAF5FB] flex flex-wrap gap-1.5">
                    {connection.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F7E8F0] text-[#B8325A] border border-[#E9E3EC]/70"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                    {connection.skills.length > 5 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#8A8A8A] bg-[#FAF5FB]">
                        +{connection.skills.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Connection;