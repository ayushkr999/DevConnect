import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import { Link } from 'react-router-dom'
import UserCard from './UserCard'

const CardSkeleton = () => (
  <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-2xl animate-pulse mt-4">
    <div className="w-full h-80 rounded-xl bg-slate-800" />
    <div className="h-6 w-2/3 rounded bg-slate-800 mt-5" />
    <div className="h-4 w-1/2 rounded bg-slate-800 mt-2" />
    <div className="h-16 w-full rounded bg-slate-800 mt-4" />
    <div className="flex gap-3 mt-6">
      <div className="h-10 flex-1 rounded-lg bg-slate-800" />
      <div className="h-10 flex-1 rounded-lg bg-slate-800" />
    </div>
  </div>
);

const EmptyFeed = () => (
  <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center shadow-2xl mt-4">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
    <p className="text-sm text-slate-400 leading-relaxed mb-6">
      There are no new developers in your area right now. Try checking your connections or check back later!
    </p>
    <Link to="/app/connections" className="inline-block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 text-center transition duration-200">
      View Connections
    </Link>
  </div>
);

const Feed = () => {
  const feed=useSelector((store)=>store.feed)
  const dispatch=useDispatch();

  const getfeed=async()=>{
    if(feed) return;
    try{
       const res=await axios.get(BASE_URL+"/user/feed",{withCredentials:true})
       dispatch(addFeed(res?.data?.data));
    }
    catch(err){
       console.error(err);
    }
  }

  useEffect(()=>{
     getfeed();
  },[])

  // Loading state
  if (!feed) {
    return (
      <div className="flex justify-center my-10">
        <CardSkeleton />
      </div>
    );
  }

  // Empty state
  if (feed.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <EmptyFeed />
      </div>
    );
  }

  return (
     <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  )
}

export default Feed

