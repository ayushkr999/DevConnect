import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

import AuthPage from "./Components/Auth";
import Body from "./Components/Body";
import Feed from "./Components/Feed";
import Profile from "./Components/Profile";
import Connection from "./Components/Connection";
import Request from "./Components/Request";
import { Toaster } from "react-hot-toast";
import Chat from "./Components/Chat";

function App() {
  return (
    <Provider store={appStore}>
       <BrowserRouter>
         <Toaster position="top-center" reverseOrder={false} />
            <Routes>

              <Route path="/" element={<Navigate to="/login" />} />

              <Route path="/login" element={<AuthPage />} />

              <Route path="/app" element={<Body />}>

             <Route path="" element={<Feed />} />

            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connection/>}></Route>
            <Route path="requests" element={<Request/>}></Route>
            <Route path="chat/:targetUserId" element={<Chat/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
  );
}

export default App;




{/* <Route path="/app" element={<Body />}>
   <Route path="" element={<Feed />} />
   <Route path="profile" element={<Profile />} />
</Route> */}