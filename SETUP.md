# Setup Commands - Quick Reference

## One-Time Setup

### 1. Database Setup
```bash
# Create database and tables
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (Windows PowerShell)
@"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=trello_clone
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8

# Or manually create .env with above content
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## Running the Project

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## Verify Everything Works

1. Backend health check: `http://localhost:5000/api/health`
2. Frontend: `http://localhost:3000`
3. You should see 3 lists with sample cards

## Common Issues

- **MySQL connection error**: Check `.env` file credentials
- **Port already in use**: Change PORT in `.env` or kill process
- **Module not found**: Delete `node_modules` and run `npm install` again

For detailed troubleshooting, see [QUICKSTART.md](./QUICKSTART.md)
