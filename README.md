# Trello Clone - Project Management Tool

A Kanban-style project management web application built as a full-stack assignment. This application replicates Trello's core functionality with drag-and-drop support for organizing tasks.

## Tech Stack

- **Frontend:** React 18 with Vite
- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **Drag & Drop:** @dnd-kit/core and @dnd-kit/sortable
- **API Style:** REST

## Project Structure

```
scalerai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── listController.js    # List business logic
│   │   │   └── cardController.js    # Card business logic
│   │   ├── models/
│   │   │   ├── List.js              # List data access layer
│   │   │   └── Card.js              # Card data access layer
│   │   ├── routes/
│   │   │   ├── lists.js             # List API routes
│   │   │   └── cards.js             # Card API routes
│   │   └── server.js                # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.jsx            # Main board container
│   │   │   ├── List.jsx             # List component with card drag & drop
│   │   │   └── Card.jsx             # Card component
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── database/
│   └── schema.sql                   # MySQL schema and seed data
└── README.md
```

## Database Design

### Schema Overview

The database uses a simple, normalized schema with two main tables:

1. **`lists`** - Represents columns in the board
   - `id` (INT, PRIMARY KEY)
   - `title` (VARCHAR(255))
   - `position` (DECIMAL(10,2)) - Used for ordering lists
   - `created_at`, `updated_at` (TIMESTAMP)

2. **`cards`** - Represents tasks within lists
   - `id` (INT, PRIMARY KEY)
   - `list_id` (INT, FOREIGN KEY → lists.id)
   - `title` (VARCHAR(255))
   - `description` (TEXT)
   - `position` (DECIMAL(10,2)) - Used for ordering cards within a list
   - `created_at`, `updated_at` (TIMESTAMP)

### Design Decisions

1. **Position Column (DECIMAL)**: 
   - Using `DECIMAL(10,2)` instead of `INT` allows fractional positions (e.g., 1.0, 1.5, 2.0)
   - This makes reordering easier - we can insert items between existing positions without updating all records
   - For simplicity, we use integer increments (1.0, 2.0, 3.0...) and reassign positions on reorder

2. **Foreign Key with CASCADE**:
   - Cards have a foreign key to lists with `ON DELETE CASCADE`
   - Deleting a list automatically deletes all its cards

3. **Indexes**:
   - `idx_position` on `lists.position` for fast ordering
   - `idx_list_position` on `cards(list_id, position)` for efficient card queries

4. **Single Board Assumption**:
   - No `boards` table since assignment assumes only one board
   - All lists belong to the implicit single board

## Quick Start

**🚀 For step-by-step local setup instructions, see [QUICKSTART.md](./QUICKSTART.md)**

Quick summary:
1. Set up MySQL database: `mysql -u root -p < database/schema.sql`
2. Backend: `cd backend && npm install && npm run dev`
3. Frontend: `cd frontend && npm install && npm run dev`
4. Open: `http://localhost:3000`

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trello_clone
PORT=5000
```

5. Create and seed the database:
```bash
mysql -u root -p < ../database/schema.sql
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Lists

- `GET /api/lists` - Get all lists (ordered by position)
- `GET /api/lists/:id` - Get a single list
- `POST /api/lists` - Create a new list
  ```json
  { "title": "List Title" }
  ```
- `PUT /api/lists/:id` - Update list title
  ```json
  { "title": "New Title" }
  ```
- `DELETE /api/lists/:id` - Delete a list (cascades to cards)
- `POST /api/lists/reorder` - Reorder lists
  ```json
  { "listIds": [3, 1, 2] }
  ```

### Cards

- `GET /api/cards/list/:listId` - Get all cards for a list
- `GET /api/cards/:id` - Get a single card
- `POST /api/cards` - Create a new card
  ```json
  { "listId": 1, "title": "Card Title", "description": "Optional description" }
  ```
- `PUT /api/cards/:id` - Update card
  ```json
  { "title": "New Title", "description": "New description", "listId": 2 }
  ```
- `DELETE /api/cards/:id` - Delete a card
- `POST /api/cards/reorder` - Reorder cards (within list or move between lists)
  ```json
  { "cardIds": [5, 3, 4], "listId": 1 }
  ```

## Drag & Drop Implementation

### Strategy

The application uses **@dnd-kit** library for drag-and-drop functionality. The implementation follows a two-level approach:

1. **List-level drag & drop** (Board component):
   - Lists can be reordered horizontally
   - Uses `horizontalListSortingStrategy`
   - On drag end, sends array of list IDs to `/api/lists/reorder`

2. **Card-level drag & drop** (List component):
   - Cards can be reordered vertically within a list
   - Each List component has its own `DndContext`
   - Uses `verticalListSortingStrategy`
   - On drag end, sends array of card IDs to `/api/cards/reorder`

### Ordering Logic

**Backend Reordering Algorithm:**

When a drag operation completes:
1. Frontend sends the new ordered array of IDs (e.g., `[3, 1, 2]`)
2. Backend assigns positions sequentially: `1.0, 2.0, 3.0, ...`
3. All position updates happen in parallel using `Promise.all()`
4. Database ensures consistency through transactions (implicit in MySQL)

**Why this approach:**
- Simple and predictable
- Easy to debug and explain
- No complex gap-filling logic needed
- Works well for typical board sizes (< 100 items)

**Trade-offs:**
- Reordering one item updates multiple records
- For very large boards (1000+ items), a fractional position approach would be better
- Current approach prioritizes simplicity and correctness

### Moving Cards Between Lists

The application fully supports dragging cards between lists:
1. Cards can be dragged and dropped onto any list's droppable area
2. Cards can be dropped on other cards in different lists (inserts before that card)
3. The Board component manages a unified `DndContext` for all drag operations
4. Each List has a droppable area that accepts cards from other lists
5. On drop, the backend API updates both `list_id` and `position` atomically

**Implementation Details:**
- Board-level `DndContext` handles both list and card drags
- Lists use `useDroppable` hook to create drop zones
- Cards use `useSortable` hook for dragging
- Drag end handler detects target list and reorders cards accordingly

## Code Organization

### Backend Structure

- **Models** (`models/`): Data access layer - all database queries
- **Controllers** (`controllers/`): Business logic and request handling
- **Routes** (`routes/`): API endpoint definitions
- **Config** (`config/`): Database connection and configuration

### Frontend Structure

- **Components** (`components/`): React components (Board, List, Card)
- **Services** (`services/`): API communication layer
- Separation of concerns: Components handle UI, services handle data fetching

## Assumptions & Trade-offs

### Assumptions

1. **Single Board**: Only one board exists (no authentication needed)
2. **No Real-time Updates**: Changes require page refresh or manual reload
3. **No Optimistic Updates**: All operations wait for server confirmation
4. **Simple UI**: Focus on functionality over visual polish

### Trade-offs (Due to 1-Day Constraint)

1. **Cross-list Card Movement**: 
   - ✅ Fully implemented with drag & drop
   - Cards can be dragged between lists seamlessly
   - Visual feedback shows drop zones

2. **Error Handling**:
   - Basic error handling implemented
   - No retry logic or advanced error recovery
   - Trade-off: Functional but not production-ready

3. **Performance**:
   - No pagination for cards/lists
   - All data loaded upfront
   - Trade-off: Works for small boards, may need optimization for large datasets

4. **UI/UX**:
   - Basic styling resembling Trello
   - No animations or advanced interactions
   - Trade-off: Functional and clean, but not pixel-perfect

## Testing the Application

1. **Create a List**: Click "+ Add another list" button
2. **Create a Card**: Click "+ Add a card" in any list
3. **Edit List/Card**: Click "Edit" button
4. **Delete List/Card**: Click "Delete" button
5. **Reorder Lists**: Drag list headers horizontally
6. **Reorder Cards**: Drag cards vertically within a list

## Deployment Notes

### Backend Deployment

- Ensure MySQL database is accessible
- Set environment variables on hosting platform
- Recommended: Railway, Render, or Heroku

### Frontend Deployment

- Build: `npm run build` in frontend directory
- Deploy `dist/` folder to Vercel, Netlify, or similar
- Update `VITE_API_URL` environment variable to point to deployed backend

## Future Enhancements (Not in Scope)

- User authentication and multiple boards
- Real-time collaboration
- Card attachments and comments
- Search and filtering
- Card labels and due dates
- Activity log
- Board backgrounds

## Code Understanding

This codebase is designed to be:
- **Readable**: Clear variable names, consistent structure
- **Explainable**: Each function has a single responsibility
- **Modular**: Separation of concerns between layers
- **Interview-safe**: No complex patterns that are hard to explain

Key areas to understand:
1. Database schema and position-based ordering
2. Drag & drop flow: Frontend → API → Database
3. Component hierarchy: Board → List → Card
4. API structure: Routes → Controllers → Models

---

**Built for:** SDE Intern Fullstack Assignment  
**Time Constraint:** 1 day  
**Focus:** Correctness, code quality, and explainability over feature completeness
