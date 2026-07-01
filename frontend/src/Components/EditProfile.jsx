import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addUser } from "../utils/userSlice";
import toast from "react-hot-toast";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [AboutUs, setAboutUs] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [skills, setSkills] = useState("");

  // Load existing user data
  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAboutUs(user.AboutUs || "");
      setPhotoUrl(user.photoUrl || "");
      setSkills(user.skills ? user.skills.join(", ") : "");
    }
  }, [user]);

  // Save Profile
  const savedProfile = async () => {
    const toastId = toast.loading("Saving profile...");
    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstname,
          lastname,
          age,
          gender,
          AboutUs,
          photoUrl,
          skills: skillsArray,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.user));

      toast.success("Profile updated successfully!", {
        id: toastId,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message, {
        id: toastId,
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center py-6">
      
      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* FORM SIDE */}
        <div className="col-span-12 md:col-span-7 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-white">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Edit Profile
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Update your directory information and developer skills.
            </p>
          </div>

          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="First name"
                value={firstname}
                set={setFirstname}
              />

              <Input
                label="Last Name"
                placeholder="Last name"
                value={lastname}
                set={setLastname}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                placeholder="Age"
                value={age}
                set={setAge}
              />

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* About */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                About / Bio
              </label>
              <textarea
                rows={3}
                value={AboutUs}
                onChange={(e) => setAboutUs(e.target.value)}
                placeholder="Tell other developers about your background, interests, and matching goals..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 text-sm resize-none"
              />
            </div>

            <Input
              label="Photo URL"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              set={setPhotoUrl}
            />

            <Input
              label="Skills (comma-separated)"
              placeholder="e.g. React, Node.js, Express, MongoDB"
              value={skills}
              set={setSkills}
            />

            {/* Save Button */}
            <button
              onClick={savedProfile}
              className="w-full py-3 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all duration-150 text-sm cursor-pointer"
            >
              Save Changes
            </button>

          </div>
        </div>

        {/* PREVIEW SIDE */}
        <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full sticky top-24">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center mb-2">
              Card Preview
            </p>
            <div className="flex justify-center">
              <UserCard
                user={{
                  firstname,
                  lastname,
                  age,
                  gender,
                  AboutUs,
                  photoUrl,
                  skills: skills
                    ? skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [],
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;

/* Reusable Input */
const Input = ({
  label,
  value,
  set,
  type = "text",
  placeholder = "",
}) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>

    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => set(e.target.value)}
      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 text-sm"
    />
  </div>
);