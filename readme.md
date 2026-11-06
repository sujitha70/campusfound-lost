# 🎒 CampusLost & Found Hub

A full-stack web application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** designed to help university students and faculty report lost belongings, post found items, and streamline the recovery process across campus.

---

## 📌 1. Project Description

Losing personal belongings such as ID cards, electronics, notebooks, or accessories on a busy college campus is a common problem. Traditional methods like notice boards or scattered WhatsApp groups are inefficient, unorganized, and lack verification. 

**CampusLost & Found Hub** solves this by providing a centralized, searchable digital platform. Students can log in with their institutional credentials, report lost or found items with location tags and dates, filter active listings by category, and update the item status to "Claimed" once returned to the rightful owner.

---

## 🎯 2. Project Objectives

* **Centralize Campus Listings:** Replace scattered message forwards with a single, structured portal for all lost and found items.
* **Implement Full CRUD Operations:** Enable authenticated users to Create, Read, Update, and Delete item reports seamlessly.
* **Ensure Secure Access:** Protect user data and item modification privileges using JSON Web Tokens (JWT) and password hashing (`bcryptjs`).
* **Deliver a Responsive UI:** Provide an intuitive, mobile-friendly interface using React.js so students can post items on the go.
* **Cloud Integration & Deployment:** Connect the application to a live MongoDB Atlas cluster and deploy both client and server for public access.

---

## 🛠️ 3. Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), React Router DOM | Component-based UI and client-side routing |
| **Styling** | CSS3 / Tailwind CSS / Bootstrap | Responsive layout and modern design |
| **HTTP Client** | Axios | Communicating with backend REST APIs |
| **Backend** | Node.js, Express.js | RESTful API server and business logic |
| **Database** | MongoDB Atlas, Mongoose ODM | Cloud NoSQL data storage and schema modeling |
| **Authentication** | JSON Web Token (JWT), `bcryptjs` | Stateless user authentication and password encryption |
| **Deployment** | Vercel / Netlify (Frontend), Render (Backend) | Live production hosting |

---

## ✨ 4. Features and Functionalities

### 🔐 User Authentication & Authorization
* Student registration with Name, Institutional Email, Registration Number, and encrypted password.
* JWT-based login system that persists user sessions.
* Protected routes ensuring only logged-in students can post items, and only the original creator can edit or delete their post.

### 📦 Complete CRUD Operations
* **Create (`POST`):** Report a lost or found item with title, category, description, campus location, date, image URL, and contact details.
* **Read (`GET`):** View all active campus listings on the home feed or click an item to view full details and reporter contact information.
* **Update (`PUT`):** Edit item descriptions or toggle the item status from `Active` to `Claimed` once resolved.
* **Delete (`DELETE`):** Permanently remove a listing from the database.

### 🔍 Search & Category Filtering
* Filter items dynamically by type (`Lost` vs. `Found`) and category (`Electronics`, `Documents & ID`, `Accessories`, `Books & Stationery`, `Others`).
* Keyword search bar to quickly locate specific items or campus buildings.

---

## 📂 5. Project Folder Structure

```text
campus-lost-found/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection setup
│   ├── controllers/
│   │   ├── authController.js     # Register & Login logic
│   │   └── itemController.js     # CRUD logic for Lost/Found items
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token verification
│   ├── models/
│   │   ├── User.js               # Student schema
│   │   └── Item.js               # Lost/Found item schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   └── itemRoutes.js         # /api/items endpoints
│   ├── .env                      # Environment variables (not committed)
│   ├── package.json
│   └── server.js                 # Express app entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js  # Base URL and JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── ItemCard.jsx      # Individual item display card
│   │   │   └── ProtectedRoute.jsx# Route guard for authenticated pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user login state
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Main feed with search & filters
│   │   │   ├── Login.jsx         # Student login form
│   │   │   ├── Register.jsx      # Student registration form
│   │   │   ├── PostItem.jsx      # Form to report Lost/Found item
│   │   │   ├── EditItem.jsx      # Form to update existing listing
│   │   │   └── MyItems.jsx       # Personal dashboard to manage posts
│   │   ├── App.jsx               # Route definitions
│   │   └── main.jsx              # React DOM rendering
│   ├── .env                      # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
│
├── presentation/
│   └── Project_Presentation.pptx # 7-10 Slide Project Presentation
└── README.md
```

---

## 🏗️ 6. Step-by-Step Build Process (Backend to Frontend)

### Phase 1: Database Setup (MongoDB Atlas)
1. **Create Cluster:** Log in to MongoDB Atlas and create a free shared cluster (`M0`).
2. **Database Access:** Create a database user with a username and password.
3. **Network Access:** Whitelist IP address `0.0.0.0/0` so your local environment and cloud deployment server can connect.
4. **Connection String:** Copy the connection URI and replace `<password>` with your database user password.

### Phase 2: Building the Backend (Node.js + Express.js)
1. **Initialize Node Server:** Create the `backend` folder, run `npm init -y`, and install `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, and `jsonwebtoken`.
2. **Database Connection (`config/db.js`):** Use `mongoose.connect(process.env.MONGO_URI)` to establish an asynchronous connection to MongoDB Atlas.
3. **Design Schemas (`models/`):**
   * `User.js`: Define fields for `name`, `email`, `registrationNumber`, and `password`. Add a Mongoose `pre('save')` hook to hash passwords using `bcryptjs`.
   * `Item.js`: Define fields for `title`, `category`, `type` (`Lost`/`Found`), `description`, `location`, `date`, `image`, `contactInfo`, `status` (`Active`/`Claimed`), and `postedBy` (referencing `User._id`).
4. **Create Auth Middleware (`middleware/authMiddleware.js`):** Extract the Bearer token from `req.headers.authorization`, verify it with `jwt.verify()`, and attach the authenticated user's ID to `req.user`.
5. **Develop Controllers (`controllers/`):**
   * `authController.js`: Write `registerUser` (creates user and returns JWT) and `loginUser` (verifies credentials and returns JWT).
   * `itemController.js`: Write `createItem`, `getItems` (with query filters for category and type), `getItemById`, `updateItem` (checks if `item.postedBy === req.user.id`), and `deleteItem`.
6. **Configure Routes & Server (`routes/` & `server.js`):** Mount `/api/auth` and `/api/items` in `server.js`, enable `cors()` and `express.json()`, and listen on `PORT=5000`.

### Phase 3: Building the Frontend (React.js)
1. **Scaffold React App:** Run `npm create vite@latest frontend -- --template react` and install `axios` and `react-router-dom`.
2. **Setup Axios Instance (`src/api/axiosInstance.js`):** Create a central Axios configuration pointing to `http://localhost:5000/api` and attach the JWT token from `localStorage` to every outgoing request header.
3. **Global Auth State (`src/context/AuthContext.jsx`):** Manage `user` state across the app so components know whether a student is logged in.
4. **Build Core Pages (`src/pages/`):**
   * `Home.jsx`: Fetches `GET /api/items` on load using `useEffect` and displays cards with category and `Lost`/`Found` filter buttons.
   * `Login.jsx` & `Register.jsx`: Controlled forms that send credentials to `/api/auth` and save the returned JWT token to `localStorage`.
   * `PostItem.jsx`: Form that sends a `POST /api/items` request to create a new listing.
   * `MyItems.jsx`: Displays items posted by the logged-in user with buttons to **Mark as Claimed (`PUT`)**, **Edit (`PUT`)**, or **Delete (`DELETE`)**.

### Phase 4: Integration & Deployment
1. **Test Locally:** Run backend on port `5000` and frontend on port `5173`. Verify all CRUD actions reflect in MongoDB Atlas.
2. **Deploy Backend:** Push code to GitHub, connect the `backend` root directory to **Render**, and add `MONGO_URI` and `JWT_SECRET` in Render's Environment Variables.
3. **Deploy Frontend:** Connect the `frontend` root directory to **Vercel**, set `VITE_API_URL` to your live Render backend URL, and deploy.

---

## ⚙️ 7. Installation and Execution Steps

Follow these steps to run the project locally on your machine:

### Prerequisites
* **Node.js** (v18 or higher)
* **Git**
* **MongoDB Atlas URI**

### Step 1: Clone the Repository
```bash
git clone [https://github.com/your-username/campus-lost-found.git](https://github.com/your-username/campus-lost-found.git)
cd campus-lost-found
```

### Step 2: Configure and Start the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key
```

Start the backend development server:
```bash
npm run dev
```
*The backend server will start running at `http://localhost:5000`.*

### Step 3: Configure and Start the Frontend
Open a new terminal window and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the React development server:
```bash
npm run dev
```
*The frontend application will open at `http://localhost:5173`.*

---

## 📡 8. API Endpoints Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student account |
| `POST` | `/api/auth/login` | Public | Authenticate student & get JWT token |
| `GET` | `/api/items` | Public | Fetch all active lost & found items |
| `GET` | `/api/items/:id` | Public | Fetch single item details by ID |
| `POST` | `/api/items` | Private (JWT) | Create a new lost or found item listing |
| `PUT` | `/api/items/:id` | Private (Owner) | Update item details or mark as `Claimed` |
| `DELETE` | `/api/items/:id` | Private (Owner) | Delete an item listing |

---

## 🌐 9. Live Deployment Links

* **Frontend Live URL (Vercel/Netlify):** `[Insert Deployed Frontend Link Here]`
* **Backend API URL (Render/Railway):** `[Insert Deployed Backend Link Here]`
* **Project Presentation (PPTX):** `[Link to Presentation File in Repository]`

---

 
---

## 📄 License
This project was developed as part of the **MERN Stack Web Development Training Program**.