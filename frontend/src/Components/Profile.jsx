import React from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'

const Profile = () => {
  const user = useSelector((store) => store.user);

  if (!user) return <p className="text-[#666666] text-center py-10 text-sm">Loading profile...</p>;

  return (
    <div>
      <EditProfile user={user} />
    </div>
  );
};


export default Profile
