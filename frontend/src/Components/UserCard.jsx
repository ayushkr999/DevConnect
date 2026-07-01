import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
        Loading user profile...
      </div>
    );
  }

  const { _id, firstname, lastname, photoUrl, age, gender, AboutUs, skills } = user;

  const handleSendRequest = async (status, userId) => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      console.log("SUCCESS:", res.data);

      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const formattedGender = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "";

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900 mt-4 flex flex-col">
      
      {/* Photo Container */}
      <div className="relative h-80 overflow-hidden bg-slate-950">
        <img
          src={
            photoUrl ||
            "https://dummyimage.com/300x300/cccccc/000000&text=No+Image"
          }
          alt={`${firstname} ${lastname}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
        />

        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/10 to-transparent"></div>

        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h2 className="text-2xl font-bold tracking-tight">
            {firstname} {lastname}
          </h2>
          <p className="text-sm text-slate-300 font-medium mt-0.5">
            {age ? `${age} yrs` : "Age N/A"}{formattedGender ? ` • ${formattedGender}` : ""}
          </p>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between text-slate-200">
        
        <div>
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-slate-400 leading-relaxed italic">
            {AboutUs ? `"${AboutUs}"` : "No bio available."}
          </p>
        </div>

        {/* Buttons (rendered only if _id is present - for feed matching) */}
        {_id && (
          <div className="flex gap-3 mt-6">
            <button
              disabled={loading}
              onClick={() => handleSendRequest("ignored", _id)}
              className="flex-1 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 font-semibold hover:bg-red-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition duration-150 text-sm cursor-pointer"
            >
              Ignore
            </button>

            <button
              disabled={loading}
              onClick={() => handleSendRequest("interested", _id)}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-md shadow-indigo-600/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition duration-150 text-sm cursor-pointer"
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;