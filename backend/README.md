# ⚙️ Engineering Resource Management System

A full-stack MERN app for managing engineers, projects, assignments, and resource utilization.

---

## 🗂 Folder Structure

```
engineering-resource-manager/
├─ backend/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ assignmentController.js
│  │  ├─ authController.js
│  │  ├─ engineerController.js
│  │  ├─ metaController.js
│  │  └─ projectController.js
│  ├─ middleware/
│  │  └─ authMiddleware.js
│  ├─ models/
│  │  ├─ Assignment.js
│  │  ├─ Project.js
│  │  └─ User.js
│  ├─ routes/
│  │  ├─ assignments.js
│  │  ├─ auth.js
│  │  ├─ engineers.js
│  │  ├─ meta.js
│  │  └─ projects.js
│  ├─ seed/
│  │  └─ seed.js
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  └─ server.js
├─ frontend/
│  ├─ public/
│  │  └─ vite.svg
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ react.svg
│  │  ├─ components/
│  │  │  ├─ ui/
│  │  │  │  ├─ badge.tsx
│  │  │  │  ├─ button-variants.ts
│  │  │  │  ├─ button.tsx
│  │  │  │  ├─ card.tsx
│  │  │  │  ├─ dropdown-menu.tsx
│  │  │  │  ├─ input.tsx
│  │  │  │  ├─ label.tsx
│  │  │  │  ├─ navigation-menu.tsx
│  │  │  │  └─ select.tsx
│  │  │  ├─ CapacityBar.tsx
│  │  │  ├─ Layout.tsx
│  │  │  ├─ Nav.tsx
│  │  │  └─ SkillTags.tsx
│  │  ├─ lib/
│  │  │  ├─ axios.ts
│  │  │  └─ utils.ts
│  │  ├─ pages/
│  │  │  ├─ auth/
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Register.tsx
│  │  │  ├─ engineer/
│  │  │  │  ├─ Dashboard.tsx
│  │  │  │  ├─ MyAssignments.tsx
│  │  │  │  └─ Profile.tsx
│  │  │  └─ manager/
│  │  │     ├─ Analytics.tsx
│  │  │     ├─ AssignmentTimeline.tsx
│  │  │     ├─ CreateAssignment.tsx
│  │  │     ├─ Dashboard.tsx
│  │  │     ├─ Projects.tsx
│  │  │     ├─ SkillGap.tsx
│  │  │     ├─ TeamOverview.tsx
│  │  │     └─ ViewAssignments.tsx
│  │  ├─ routes/
│  │  │  └─ AppRoutes.tsx
│  │  ├─ store/
│  │  │  ├─ assignmentStore.ts
│  │  │  ├─ authStore.ts
│  │  │  ├─ uiStore.ts
│  │  │  └─ userStore.ts
│  │  ├─ utils/
│  │  │  └─ date.ts
│  │  ├─ App.css
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  └─ vite-env.d.ts
│  ├─ .gitignore
│  ├─ components.json
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ tailwind.config.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
└─ file_tree.txt
```

This structure gives a clean overview of the complete full-stack system.

🧾 Let me now update your complete `README.md` file with this included.


# ⚙️ Engineering Resource Management System

A full-stack application to manage engineers, projects, and their resource allocations — with manager and engineer roles, assignment tracking, capacity charts, and skill management.

---

## 🧩 Tech Stack

### 🖥️ Frontend
- React + TypeScript + Vite
- Zustand (State Management)
- Tailwind CSS + ShadCN UI
- React Hook Form + Zod

### 🖥️ Backend
- Node.js + Express (MVC pattern)
- MongoDB + Mongoose
- JWT-based Auth
- RESTful APIs

```

---

## ⚙️ Setup Instructions

### 1. Clone Repo & Install

```bash
git clone https://github.com/kishanachar8/erm.git
cd erm
```

#### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌱 Seeding Sample Data

```bash

```

---

## 🧪 API Testing

Use Postman or ThunderClient.

**Login:** `POST /api/auth/login`  
**Protected Routes:** Add `Authorization: Bearer <token>`

---

## 🌐 Frontend Pages

- `/login` – Login form
- `/manager/dashboard` – Manager overview
- `/manager/projects` – Manage projects
- `/manager/assignments` – Assign engineers
- `/engineer/profile` – Engineer dashboard

---

## 📝 .env Examples

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/erm
JWT_SECRET=your_secret
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📬 Postman Collection

Import via `postman/EngineeringResourceManager.postman_collection.json`

---

## 🧑‍💻 Author

**Kishan** – Full Stack MERN Developer  

---
**Video Link**-"https://www.loom.com/share/40f74b2a150c4e9f8b3656a8cc9c85c7?sid=c2196796-be9e-4a28-ac04-aaa3812ef2f2"
## 📃 License

MIT