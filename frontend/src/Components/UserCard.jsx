import { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] p-8 text-center text-[#666666]">
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

      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Send request failed:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const formattedGender = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "";

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-[#E9E3EC] shadow-sm bg-[#FFFFFF] mt-4 flex flex-col">
      
      {/* Photo Container */}
      <div className="relative h-80 overflow-hidden bg-[#FAF5FB]">
        <img
          src={
            photoUrl ||
            "https://dummyimage.com/300x300/cccccc/000000&text=No+Image"
          }
          alt={`${firstname} ${lastname}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent"></div>

        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h2 className="text-2xl font-bold tracking-tight">
            {firstname} {lastname}
          </h2>
          <p className="text-sm text-white/90 font-medium mt-0.5">
            {age ? `${age} yrs` : "Age N/A"}{formattedGender ? ` • ${formattedGender}` : ""}
          </p>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between text-[#252525]">
        
        <div>
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F7E8F0] text-[#B8325A] border border-[#E9E3EC]"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-[#666666] leading-relaxed italic">
            {AboutUs ? `"${AboutUs}"` : "No bio available."}
          </p>
        </div>

        {/* Buttons (rendered only if _id is present - for feed matching) */}
        {_id && (
          <div className="flex gap-3 mt-6">
            <button
              disabled={loading}
              onClick={() => handleSendRequest("ignored", _id)}
              className="flex-1 py-2.5 rounded-xl border border-[#E9E3EC] bg-[#FFFFFF] text-[#666666] font-semibold hover:bg-[#FAF5FB] hover:text-[#252525] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition duration-150 text-sm cursor-pointer"
            >
              Ignore
            </button>

            <button
              disabled={loading}
              onClick={() => handleSendRequest("interested", _id)}
              className="flex-1 py-2.5 rounded-xl bg-[#F05A24] text-white font-semibold hover:bg-[#E85D04] shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition duration-150 text-sm cursor-pointer"
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