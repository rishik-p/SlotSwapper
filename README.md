SlotSwapper

SlotSwapper is a peer-to-peer time-slot scheduling and swapping application.
Users can mark calendar events as swappable, browse other users’ available slots, and request a swap.
If both parties agree, the system automatically updates their calendars in real-time.

Tech Stack & Design Choices:

> Frontend: React (Vite + TypeScript)
> Backend: Node.js (Express + TypeScript)
> Database: MongoDB with Mongoose
> Authentication: JWT (JSON Web Tokens)
> Realtime Updates: Socket.IO

Design Highlights:

> Separation between frontend (/client) and backend (/server).
> Event lifecycle follows: BUSY → SWAPPABLE → SWAP_PENDING → BUSY.
> Realtime notifications use Socket.IO with userId-to-socketId mapping.
> UI built with plain CSS for simple and fast styling.

Setup & Run Locally:
> Step 1: Clone the Repository

git clone [https://github.com/](https://github.com/rishik-p/SlotSwapper.git)
cd SlotSwapper

> Step 2: Backend Setup

cd server
npm install
Create a .env file inside the "server" folder with this content:
PORT=5000
MONGO_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your_secret_key
To start backend:
npm run dev
Server runs at: http://localhost:5000

> Step 3: Frontend Setup

cd ../client
npm install
Create a .env file inside the "client" folder with this content:
VITE_API_BASE=http://localhost:8000/api
To start the frontend (React app):
npm run dev
Frontend runs at: http://localhost:5173

> Step 4: Test the Workflow

Sign up two users.
Each user creates calendar events.
One user marks an event as SWAPPABLE.
The other user visits the Marketplace page and sends a swap request.
The receiver sees a real-time notification and can Accept or Reject the swap.
When accepted, both users’ calendars update automatically.

API Endpoints

All API routes are prefixed with /api
Authenticated endpoints require Authorization: Bearer <token> header.

Method | Endpoint | Auth | Description
POST | /auth/signup | No | Register a new user
POST | /auth/login | No | Login and receive a JWT token
GET | /events/my | Yes | Get logged-in user’s events
POST | /events | Yes | Create a new event
PUT | /events/:id | Yes | Update event (change status etc.)
DELETE | /events/:id | Yes | Delete an event
GET | /swappable | Yes | View all swappable slots from other users
POST | /swap-request | Yes | Create a swap request
GET | /swap-requests | Yes | View incoming and outgoing swap requests
POST | /swap-response/:id | Yes | Accept or reject a swap request

Example curl command for signup:
curl -X POST http://localhost:5000/api/auth/signup

-H "Content-Type: application/json"
-d '{"name":"Rishi","email":"rishi@example.com
","password":"123456"}'

Example curl command for creating a swap request:
curl -X POST http://localhost:5000/api/swap-request

-H "Authorization: Bearer <TOKEN>"
-H "Content-Type: application/json"
-d '{"mySlotId":"<my-slot-id>","theirSlotId":"<their-slot-id>"}'

> Assumptions:

Each user is uniquely identified by email.
Events use ISO timestamps (startTime, endTime) and appear in the user’s local timezone.
When a swap is accepted, both events exchange their userId fields.
Only authenticated users can create, update, or delete events.

Challenges:

Integrating Socket.IO for real-time notifications and handling user connections was tricky.
Implementing secure JWT authentication and fixing CORS issues between frontend and backend.
Managing environment variables correctly during deployment on Vercel (frontend) and Render (backend).

Deployment Notes

Frontend: deploy on Vercel.
Framework Preset: Vite
Set environment variable VITE_API_BASE = https://your-backend-url.onrender.com/api

Backend: deploy on Render.
Environment: Node
Root Directory: server
Build Command: npm run build
Start Command: npm start
Add environment variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret

Database: MongoDB Atlas (free tier) for persistent cloud storage.

Example Environment Variables:
Server (.env):
PORT=8000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret

Client (.env):
VITE_API_BASE=https://your-backend-url.onrender.com/api

Demo Flow:
> Sign up a new user and create calendar events.
> Mark an event as swappable.
> Log in from another user and browse the Marketplace.
> Send a swap request — the receiver gets an instant toast notification.
> The receiver accepts — both calendars auto-update.
> Real-time confirmation appears via Socket.IO.
