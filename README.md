# DevConnect Backend API 🚀

A backend service for **DevConnect**, a developer matchmaking platform where users can connect with other developers.

---

## 📌 Features

* User authentication (Signup, Login, Logout)
* Profile management
* Send & review connection requests
* View connections and feed

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## 🔐 Authentication Routes (`/auth`)

### ➤ Signup

```
POST /signup
```

### ➤ Login

```
POST /login
```

### ➤ Logout

```
POST /logout
```

---

## 👤 Profile Routes (`/profile`)

### ➤ View Profile

```
GET /profile/view
```

### ➤ Edit Profile

```
PATCH /profile/edit
```

---

## 🤝 Connection Request Routes (`/request`)

### ➤ Send Request

```
POST /request/send/:status/:userId
```

### ➤ Review Request

```
POST /request/review/:status/:requestId
```

### 📌 Status Types

* `interested`
* `ignored`
* `accepted`
* `rejected`

---

## 👥 User Routes (`/user`)

### ➤ Received Requests

```
GET /user/requests/received
```

### ➤ User Connections

```
GET /user/connections
```

### ➤ Feed (Explore Developers)

```
GET /user/feed
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🚀 Getting Started

### 1. Clone the repository

```
git clone https://github.com/your-username/devtinder.git
cd devtinder
```

### 2. Install dependencies

```
npm install
```

### 3. Run the server

```
npm start
```

---

## ⚠️ Important Notes

* Do NOT commit `.env` or `node_modules`
* Use `.gitignore` to exclude sensitive files

---

## 📄 License

This project is for educational and hackathon purposes.

---

## 💡 Future Improvements

* Real-time chat
* AI-based matching
* Notifications system

---

⭐ Feel free to contribute and improve the project!
