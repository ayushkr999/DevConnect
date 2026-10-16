# 🚀 DevConnect

> A full-stack developer networking platform where developers can discover other developers, build connections, and communicate through real-time chat.

DevConnect is a **MERN stack social networking platform for developers**, combining profile discovery, connection requests, private networking, and real-time messaging into one application.

---

## 🌐 Live Demo

**Frontend:**  
https://dev-connect-phi-kohl.vercel.app

---

# ✨ Features

### 🏠 Landing Page
- Clean and responsive landing page
- Easy navigation to Login and Signup
- Highlights the core features of DevConnect
- Modern developer-focused UI

### 🔐 Authentication
- User signup and login
- JWT-based authentication
- JWT stored securely using **httpOnly cookies**
- Logout functionality
- Protected routes using authentication middleware
- Password hashing using **bcrypt**

### 👤 Developer Profiles
- Create and manage developer profiles
- Add profile photo, bio, skills, age and gender
- Edit profile information
- Live profile preview while editing
- Responsive profile interface

### 🔍 Developer Discovery
- Discover developers through a personalized feed
- Explore developer profiles and skills
- Send connection requests
- Ignore developers
- Pagination for developer feed
- Prevent duplicate and self connection requests

### 📨 Connection Requests
- View received connection requests
- Inspect developer profiles
- Accept or reject connection requests
- Manage networking relationships

### 🤝 Connections
- View accepted developer connections
- Access connected developers
- Start conversations with connections

### 💬 Real-Time Chat
- Real-time messaging using **Socket.IO**
- Private chat rooms between connected users
- Persistent chat messages stored in MongoDB
- SHA-256 based room generation
- Real-time communication between frontend and backend

### 🎨 Modern UI
- Responsive design
- Dark-themed interface
- Tailwind CSS
- Toast notifications
- Loading states
- Reusable React components
- Smooth and user-friendly navigation

### ⚡ State Management
- Redux Toolkit for global application state
- Separate slices for:
  - User
  - Feed
  - Connections
  - Requests

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router
- Socket.IO Client
- JavaScript

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcrypt
- cookie-parser
- CORS

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React Client    │
                    │  React + Redux      │
                    │  Tailwind CSS       │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Server    │
                    │   Node.js Backend   │
                    │   JWT Middleware    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │ Users / Requests    │
                    │ Chats / Connections │
                    └─────────────────────┘


              Real-Time Communication

      React Client  ◄──── Socket.IO ────► Node Server
                            │
                            ▼
                         MongoDB
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

## Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile/view` | Get logged-in user's profile |
| PATCH | `/api/profile/edit` | Update profile |

## Requests

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/request/send/:status/:toUserId` | Send/ignore request |
| POST | `/api/request/review/:status/:requestId` | Accept/reject request |

## Network

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/feed` | Get developer feed |
| GET | `/api/user/requests/received` | Get received requests |
| GET | `/api/user/connections` | Get accepted connections |

## Chat

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat/:targetUserId` | Get chat history |

---

# 🔐 Security

- JWT authentication
- JWT stored in **httpOnly cookies**
- Password hashing with **bcrypt**
- Authentication middleware for protected routes
- CORS configuration
- Prevention of self connection requests
- Prevention of duplicate connection requests
- Private Socket.IO chat rooms
- SHA-256 based room identification

---

# 📁 Project Structure

```text
DevConnect/
│
├── backend/
│   ├── index.js
│   ├── .env
│   ├── package.json
│   │
│   └── src/
│       ├── config/
│       │   ├── db.js
│       │   └── socket.js
│       │
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── profile.controller.js
│       │   ├── request.controller.js
│       │   └── user.view.controller.js
│       │
│       ├── middlewares/
│       │   └── auth.middleware.js
│       │
│       ├── models/
│       │   ├── user.model.js
│       │   ├── connectionRequest.model.js
│       │   └── chat.js
│       │
│       └── routes/
│           ├── auth.route.js
│           ├── profile.route.js
│           ├── connectionRequest.routes.js
│           ├── network.routes.js
│           └── chat.route.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    │
    └── src/
        ├── App.jsx
        ├── main.jsx
        │
        ├── Components/
        │   ├── Auth.jsx
        │   ├── Body.jsx
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── Feed.jsx
        │   ├── UserCard.jsx
        │   ├── EditProfile.jsx
        │   ├── Profile.jsx
        │   ├── Connection.jsx
        │   ├── Request.jsx
        │   └── Chat.jsx
        │
        └── utils/
            ├── appStore.js
            ├── userSlice.js
            ├── feedSlice.js
            ├── connectionSlice.js
            ├── requestSlice.js
            ├── socket.js
            └── constant.js
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
Landing Page
 │
 ├── Signup ──► Create Account
 │
 └── Login ───► JWT Authentication
                    │
                    ▼
                  Feed
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Profile   Requests  Connections
                                │
                                ▼
                              Chat
                                │
                                ▼
                          Socket.IO
                                │
                                ▼
                       Real-Time Messages
```

---

# 💡 Key Technical Highlights

### 🔑 Authentication
Implemented secure authentication using JWT, httpOnly cookies, bcrypt password hashing, and protected backend routes.

### ⚡ Real-Time Communication
Implemented private real-time communication using Socket.IO while storing chat history in MongoDB for persistence.

### 🧠 State Management
Used Redux Toolkit to manage authentication state, developer feed, connection requests, and connections.

### 🔗 Networking System
Designed a complete developer networking flow including discovery, connection requests, acceptance/rejection, and connections.

### 📄 Pagination
Implemented pagination in the developer discovery feed to efficiently handle larger numbers of users.

### 🔒 Request Validation
Implemented checks to prevent users from sending duplicate or self connection requests.

---

# 🚀 Future Improvements

- 🔔 Real-time connection/message notifications
- 🟢 Online/offline user status
- ✍️ Typing indicators
- 📎 File and image sharing in chat
- 🔎 Advanced developer search and filtering
- 👥 Developer groups
- 🎥 Video calling
- 📱 Progressive Web App support

---

# 📌 Project Summary

**DevConnect** is a full-stack developer networking and communication platform built with the **MERN stack and Socket.IO**.

The project demonstrates practical implementation of:

- Full-stack web development
- REST API development
- JWT authentication
- Secure password handling
- MongoDB data modeling
- Redux state management
- Real-time communication
- Socket.IO private rooms
- Pagination
- Responsive UI development
- Protected backend routes

DevConnect combines **professional networking and real-time communication** into a single developer-focused platform.