import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Request = () => {
  const requests = useSelector((store) => store.requests) || [];
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        BASE_URL + "/user/requests/received",
        {
          withCredentials: true,
        }
      );
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (requests.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.647-6.374-1.766Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Requests Found</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            You don't have any incoming connection requests at the moment. Keep building your profile to attract more matches!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Connection Requests
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Review other developers who want to connect with you.
        </p>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => {
          const user = req.fromUserId;
          if (!user) return null;

          return (
            <div
              key={req._id}
              className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between bg-slate-900 border border-slate-800 rounded-2xl shadow-sm hover:border-slate-700 transition duration-150"
            >
              
              {/* User Info Section */}
              <div className="flex items-start gap-4">
                
                {/* Avatar */}
                <div className="relative shrink-0 mt-0.5">
                  <img
                    src={user.photoUrl || "https://dummyimage.com/100x100/cccccc/000000&text=User"}
                    alt={`${user.firstname} ${user.lastname}`}
                    className="h-16 w-16 rounded-xl object-cover border border-slate-800"
                  />
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-green-500"></span>
                </div>

                {/* Text Details */}
                <div>
                  <h2 className="text-lg font-bold text-white leading-snug">
                    {user.firstname} {user.lastname}
                  </h2>

                  {user.age && (
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      {user.age} years old
                    </p>
                  )}

                  {user.AboutUs && (
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-md line-clamp-2">
                      {user.AboutUs}
                    </p>
                  )}

                  {/* Skills Tags */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {user.skills.slice(0, 4).map((skill, index) => (
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

              {/* Action Buttons */}
              <div className="flex gap-2 sm:flex-col shrink-0">
                <button
                  onClick={() => reviewRequest("accepted", req._id)}
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition duration-150 cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() => reviewRequest("rejected", req._id)}
                  className="flex-1 rounded-xl bg-rose-650 hover:bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition duration-150 cursor-pointer"
                >
                  Reject
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Request;