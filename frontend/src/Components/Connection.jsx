import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connection = () => {
  const connections = useSelector((store) => store.connections) || [];
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (connections.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m0 0-.003-.031c0-.225.012-.447.037-.666A11.944 11.944 0 0 1 12 15c2.17 0 4.207.576 5.963 1.584A6.062 6.062 0 0 1 18 18.72Zm-12-1.4A6 6 0 0 0 1.8 17.32a3 3 0 0 0 4.681 2.72 11.996 11.996 0 0 0 1.418-1.725ZM16.5 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM18 8.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM7.125 8.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Connections Yet</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            You haven't connected with any other developers yet. Start discovering peers on the home feed!
          </p>
          <Link
            to="/app"
            className="inline-block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center transition duration-200"
          >
            Discover Developers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Your Connections
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          You have connected with {connections.length} developer{connections.length > 1 && "s"}.
        </p>
      </div>

      {/* Connections List */}
      <div className="space-y-4">
        {connections.map((connection) => (
          <div
            key={connection._id}
            className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between bg-slate-900 border border-slate-800 rounded-2xl shadow-sm hover:border-slate-700 transition duration-150"
          >
            {/* Left Info section */}
            <div className="flex items-start gap-4">
              
              {/* Avatar */}
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={connection.photoUrl || "https://dummyimage.com/100x100/cccccc/000000&text=User"}
                  alt={`${connection.firstname} ${connection.lastname}`}
                  className="h-16 w-16 rounded-xl object-cover border border-slate-800"
                />
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-green-500"></span>
              </div>

              {/* Text details */}
              <div>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {connection.firstname} {connection.lastname}
                </h2>
                
                {connection.age && (
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {connection.age} years old
                  </p>
                )}

                {connection.AboutUs && (
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-md line-clamp-2">
                    {connection.AboutUs}
                  </p>
                )}

                {/* Skills tags */}
                {connection.skills && connection.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {connection.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Message Action Button */}
            <div className="shrink-0">
              <Link
                to={`/app/chat/${connection._id}`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition duration-150"
              >
                💬 Message
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Connection;