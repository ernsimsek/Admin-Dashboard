# AdminOS — Full-Stack Admin Dashboard

A clean, production-structured SaaS admin dashboard built with React + Node.js + MongoDB.

---

##  Project Structure

```
admin-dashboard/
├── backend/                  # Express API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── middleware/
│   │   └── auth.js           # JWT protect + adminOnly middlewares
│   ├── models/
│   │   ├── User.js           # Mongoose User schema
│   │   └── Stats.js          # Mongoose Stats schema (monthly data)
│   ├── routes/
│   │   ├── auth.js           # POST /login, POST /register, GET /me
│   │   ├── users.js          # CRUD /users
│   │   └── stats.js          # GET /dashboard, /user-growth, /sales, /analytics
│   ├── scripts/
│   │   └── seed.js           # DB seeder (sample users + 12 months of stats)
│   ├── server.js             # Express entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/                 # React + Vite app
    ├── src/
    │   ├── api/
    │   │   └── axios.js      # Axios instance (base URL + JWT interceptors)
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state (login/register/logout)
    │   ├── components/
    │   │   ├── Layout.jsx        # App shell (sidebar + navbar + outlet)
    │   │   ├── Sidebar.jsx       # Collapsible nav sidebar
    │   │   ├── Navbar.jsx        # Top bar with page title
    │   │   ├── StatCard.jsx      # Reusable metric card
    │   │   ├── LineChartComponent.jsx  # Recharts line chart wrapper
    │   │   └── BarChartComponent.jsx   # Recharts bar chart wrapper
    │   ├── pages/
    │   │   ├── Login.jsx         # Auth page
    │   │   ├── Register.jsx      # Auth page
    │   │   ├── Dashboard.jsx     # Stats + charts
    │   │   ├── Users.jsx         # Users table + add/delete
    │   │   └── Analytics.jsx     # Analytics with date range filter
    │   ├── utils/
    │   │   └── ProtectedRoute.jsx  # Redirects to /login if unauthenticated
    │   ├── App.jsx             # Router setup
    │   ├── main.jsx            # React entry
    │   └── index.css           # Tailwind + global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

##  Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET

# Seed database with sample data
npm run seed

# Start backend (development mode with auto-reload)
npm run dev
```

Backend will run at **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# The default VITE_API_URL=http://localhost:5000/api should work out of the box

# Start development server
npm run dev
```

Frontend will run at **http://localhost:5173**

---

##  Demo Credentials

After running `npm run seed` in the backend:

| Field    | Value           |
|----------|-----------------|
| Email    | admin@demo.com  |
| Password | admin123        |

---

##  Environment Variables (Setup)

After setup, create these two files:

- `backend/.env`
- `frontend/.env`

Copy commands:

```bash
cd backend
cp .env.example .env

cd ../frontend
cp .env.example .env
```

### `backend/.env`

Required variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin_dashboard
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Quick explanation:
- `PORT`: Port where the backend runs
- `MONGODB_URI`: MongoDB connection string (local or Atlas)
- `JWT_SECRET`: Strong secret key used to sign JWT tokens
- `JWT_EXPIRES_IN`: JWT expiration duration (example: `7d`)
- `NODE_ENV`: Runtime environment (`development` / `production`)
- `CLIENT_URL`: Frontend URL used for CORS

### `frontend/.env`

Required variable:

```env
VITE_API_URL=http://localhost:5000/api
```

Quick explanation:
- `VITE_API_URL`: Backend API base URL used by the frontend

---

##  API Endpoints

| Method | Path                     | Auth | Description            |
|--------|--------------------------|------|------------------------|
| POST   | /api/auth/register       | No   | Register user          |
| POST   | /api/auth/login          | No   | Login, get JWT token   |
| GET    | /api/auth/me             | Yes  | Get current user       |
| GET    | /api/users               | Yes  | List users (+ search)  |
| POST   | /api/users               | Yes  | Create user            |
| PUT    | /api/users/:id           | Yes  | Update user            |
| DELETE | /api/users/:id           | Yes  | Delete user            |
| GET    | /api/stats/dashboard     | Yes  | Summary stat cards     |
| GET    | /api/stats/user-growth   | Yes  | Monthly user growth    |
| GET    | /api/stats/sales         | Yes  | Monthly sales data     |
| GET    | /api/stats/analytics     | Yes  | Daily analytics data   |

---

##  Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 18, Vite, React Router v6 |
| Styling   | Tailwind CSS (custom config)    |
| Charts    | Recharts                        |
| HTTP      | Axios (with interceptors)       |
| Backend   | Node.js, Express                |
| Database  | MongoDB, Mongoose               |
| Auth      | JWT (jsonwebtoken + bcryptjs)   |

---

