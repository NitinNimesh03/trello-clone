# Quick Start Guide - Running Locally

Follow these steps to run the Trello Clone project on your local machine.

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

Verify installations:
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
mysql --version   # Should show 8.x or higher
```

---

## Step 1: Set Up MySQL Database

1. **Start MySQL service** (if not already running)
   - Windows: Check Services app or run MySQL from Start Menu
   - Mac/Linux: `sudo service mysql start` or `brew services start mysql`

2. **Create and seed the database:**
   ```bash
   # Navigate to project root
   cd C:\Users\Dell\Desktop\scalerai
   
   # Run the schema file (enter your MySQL root password when prompted)
   mysql -u root -p < database/schema.sql
   ```
   
   **Alternative (if above doesn't work):**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Then run:
   source database/schema.sql
   # Or copy-paste the contents of database/schema.sql
   ```

3. **Verify database was created:**
   ```bash
   mysql -u root -p -e "USE trello_clone; SHOW TABLES;"
   ```
   You should see `lists` and `cards` tables.

---

## Step 2: Set Up Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install: express, mysql2, cors, dotenv, nodemon

3. **Create `.env` file:**
   
   **Windows (PowerShell):**
   ```powershell
   @"
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=trello_clone
   PORT=5000
   "@ | Out-File -FilePath .env -Encoding utf8
   ```
   
   **Mac/Linux:**
   ```bash
   cat > .env << EOF
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=trello_clone
   PORT=5000
   EOF
   ```
   
   **Or manually create `.env` file** in the `backend` folder with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=trello_clone
   PORT=5000
   ```
   
   ⚠️ **Important:** Replace `your_mysql_password` with your actual MySQL root password. If you don't have a password, leave it empty: `DB_PASSWORD=`

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   Server running on port 5000
   ```
   
   ✅ **Backend is now running at:** `http://localhost:5000`
   
   **Keep this terminal window open!**

---

## Step 3: Set Up Frontend

1. **Open a NEW terminal window** (keep backend running)

2. **Navigate to frontend directory:**
   ```bash
   cd C:\Users\Dell\Desktop\scalerai\frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install: react, react-dom, @dnd-kit packages, vite

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```
   
   ✅ **Frontend is now running at:** `http://localhost:3000`

---

## Step 4: Access the Application

1. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

2. **You should see:**
   - A blue Trello-like board
   - Three default lists: "To Do", "In Progress", "Done"
   - Sample cards in each list

3. **Test the features:**
   - ✅ Drag lists horizontally to reorder
   - ✅ Drag cards vertically to reorder within a list
   - ✅ Drag cards between lists (cross-list movement)
   - ✅ Click "Edit" to modify list/card titles
   - ✅ Click "Delete" to remove items
   - ✅ Click "+ Add a card" to create new cards
   - ✅ Click "+ Add another list" to create new lists

---

## Troubleshooting

### Backend Issues

**Problem: "Cannot connect to MySQL"**
- ✅ Check MySQL service is running
- ✅ Verify `.env` file has correct credentials
- ✅ Test connection: `mysql -u root -p`

**Problem: "Port 5000 already in use"**
- ✅ Change `PORT=5000` to `PORT=5001` in `.env`
- ✅ Or kill the process using port 5000

**Problem: "Module not found"**
- ✅ Run `npm install` again in `backend` folder
- ✅ Delete `node_modules` and `package-lock.json`, then `npm install`

### Frontend Issues

**Problem: "Cannot connect to backend API"**
- ✅ Verify backend is running on port 5000
- ✅ Check browser console for CORS errors
- ✅ Verify `vite.config.js` has proxy configuration

**Problem: "Port 3000 already in use"**
- ✅ Vite will automatically use next available port (3001, 3002, etc.)
- ✅ Or specify port: `npm run dev -- --port 3001`

**Problem: "Module not found"**
- ✅ Run `npm install` again in `frontend` folder
- ✅ Delete `node_modules` and `package-lock.json`, then `npm install`

### Database Issues

**Problem: "Database doesn't exist"**
- ✅ Run `mysql -u root -p < database/schema.sql` again
- ✅ Or manually create: `CREATE DATABASE trello_clone;`

**Problem: "Tables are empty"**
- ✅ The schema includes seed data, but if missing:
  ```sql
  INSERT INTO lists (id, title, position) VALUES
  (1, 'To Do', 1.0),
  (2, 'In Progress', 2.0),
  (3, 'Done', 3.0);
  ```

---

## Development Workflow

### Running Both Servers

You need **two terminal windows**:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Making Changes

- **Backend changes:** Server auto-restarts with nodemon
- **Frontend changes:** Browser auto-refreshes with Vite HMR
- **Database changes:** Restart backend server

### Stopping Servers

- Press `Ctrl + C` in each terminal window
- Or close the terminal windows

---

## Production Build (Optional)

### Build Frontend:
```bash
cd frontend
npm run build
```
Output: `frontend/dist/` folder

### Run Backend in Production:
```bash
cd backend
npm start
```

---

## Next Steps

- ✅ Read `README.md` for architecture details
- ✅ Explore the codebase structure
- ✅ Check API endpoints in `backend/src/routes/`
- ✅ Review drag & drop implementation in `frontend/src/components/`

**Happy coding! 🚀**
