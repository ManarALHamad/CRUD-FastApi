# First FastAPI CRUD Project

This is my first FastAPI CRUD project.

The application uses a simple frontend built with HTML, CSS, and Vanilla JavaScript, connected to a FastAPI backend with a SQLite database.

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** FastAPI
- **Database:** SQLite
- **ORM:** SQLAlchemy
- **Communication:** JavaScript `fetch()` → FastAPI REST API

## Project Structure

```text
CRUD-FastApi/
│
├── Backend/
│   └── main.py
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── README.md
```

## Backend Setup

Open a terminal and move into the backend folder:

```bash
cd Backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install the required packages:

```bash
pip install fastapi uvicorn sqlalchemy
```

Run the FastAPI server:

```bash
uvicorn main:app --reload
```

If `uvicorn` is not recognized, use:

```bash
python3 -m uvicorn main:app --reload
```

The backend runs at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Open another terminal and move into the frontend folder:

```bash
cd Frontend
```

Run the frontend using Python's local HTTP server:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

## Running the Full Project

The frontend and backend need to run at the same time, so use two terminals.

### Terminal 1 - Backend

```bash
cd Backend
source venv/bin/activate
python3 -m uvicorn main:app --reload
```

### Terminal 2 - Frontend

```bash
cd Frontend
python3 -m http.server 5500
```

## How It Works

```text
HTML / CSS
    ↓
Vanilla JavaScript
    ↓ fetch()
FastAPI REST API
    ↓
SQLAlchemy
    ↓
SQLite
```

The frontend sends HTTP requests to the FastAPI backend using JavaScript `fetch()`.

FastAPI handles the requests, SQLAlchemy communicates with the SQLite database, and the response is returned to the frontend as JSON.

## CRUD Operations

The project supports the four main CRUD operations:

- **Create** - Add a new item
- **Read** - Retrieve existing items
- **Update** - Edit an existing item
- **Delete** - Remove an item

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/items` | Create a new item |
| GET | `/items` | Get all items |
| GET | `/items/{item_id}` | Get one item |
| PUT | `/items/{item_id}` | Update an item |
| DELETE | `/items/{item_id}` | Delete an item |

## API Testing

FastAPI automatically provides Swagger UI for testing the API.

Open:

```text
http://127.0.0.1:8000/docs
```

From there, all API endpoints can be tested directly in the browser.

## Example Item

```json
{
  "name": "MacBook",
  "description": "Development laptop"
}
```

## What I Learned

Through this project, I practiced:

- Creating a REST API with FastAPI
- Using SQLAlchemy with SQLite
- Implementing CRUD operations
- Connecting a frontend to a backend
- Using JavaScript `fetch()`
- Sending and receiving JSON data
- Running frontend and backend servers separately
- Testing API endpoints using Swagger UI