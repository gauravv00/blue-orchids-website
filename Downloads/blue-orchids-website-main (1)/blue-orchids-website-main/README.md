# Blue Orchids – The Beauty Hub 🌸

> Full-stack booking system for Blue Orchids women's salon, Magarpatta City, Pune.
>
> 📖 **[View Project Overview & Features](./PROJECT_OVERVIEW.md)**

## Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | HTML, CSS, Vanilla JS    |
| Backend   | Node.js + Express.js     |
| Database  | MySQL + Sequelize ORM    |
| Validation| express-validator        |
| Testing   | Jest + Supertest         |

---

## Prerequisites

- **Node.js** 18+ → [download](https://nodejs.org)
- **MySQL** 8+ → [download](https://dev.mysql.com/downloads/)

---

## Setup (Step-by-Step)

### 1. Clone the repository

```bash
git clone https://github.com/gauravv00/blue-orchids-website.git
cd blue-orchids-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the MySQL database

Open MySQL terminal and run:

```sql
source schema.sql
```

Or manually:

```sql
CREATE DATABASE IF NOT EXISTS blue_orchids CHARACTER SET utf8mb4;
```

The tables will be auto-created by Sequelize when you start the server.

### 4. Configure environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blue_orchids
DB_USER=root
DB_PASSWORD=your_mysql_password
NODE_ENV=development
```

### 5. Start the server

**Development (auto-restart on changes):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

### 6. Open in browser

- **Website:** http://localhost:3000
- **Booking page:** http://localhost:3000/contact.html
- **Admin dashboard:** http://localhost:3000/admin.html

---

## API Documentation

Base URL: `http://localhost:3000/api`

### Create Booking

```bash
POST /api/bookings
Content-Type: application/json

{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "+91 98765 43210",
  "date": "2026-04-15",
  "time": "11:00 AM",
  "guests": 2,
  "special_requests": "Bridal makeup consultation"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully!",
  "data": { "id": 1, "status": "pending", ... }
}
```

### Get All Bookings

```bash
GET /api/bookings
GET /api/bookings?status=pending
GET /api/bookings?search=priya
```

### Get Single Booking

```bash
GET /api/bookings/:id
```

### Update Booking Status

```bash
PATCH /api/bookings/:id
Content-Type: application/json

{ "status": "confirmed" }
```

Status options: `pending`, `confirmed`, `cancelled`

### Delete Booking

```bash
DELETE /api/bookings/:id
```

### Get Statistics

```bash
GET /api/bookings/stats
```

### Health Check

```bash
GET /api/health
```

---

## Project Structure

```
blue-orchids-website/
├── server/                    # Backend
│   ├── config/database.js     # Sequelize config
│   ├── controllers/           # Request handlers
│   ├── middleware/             # Validators + error handler
│   ├── models/Booking.js      # Database model
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   └── app.js                 # Express app
├── public/                    # Frontend (served statically)
│   ├── index.html             # Home page (with booking modal)
│   ├── contact.html           # Booking form page
│   ├── admin.html             # Admin dashboard
│   ├── css/style.css          # Styles
│   └── js/
│       ├── main.js            # Core UI logic
│       ├── booking.js         # Booking form + modal
│       └── admin.js           # Admin dashboard
├── tests/                     # Test suite
│   ├── api.test.js            # API integration tests
│   └── booking.test.js        # Model unit tests
├── server.js                  # Entry point
├── schema.sql                 # MySQL schema
├── package.json
├── .env.example
└── README.md
```

---

## Testing

### Setup test database

```sql
CREATE DATABASE IF NOT EXISTS blue_orchids_test CHARACTER SET utf8mb4;
```

### Run tests

```bash
npm test
```

---

## Database Schema

```sql
CREATE TABLE bookings (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(100)  NOT NULL,
  email            VARCHAR(100)  NOT NULL,
  phone            VARCHAR(20)   NOT NULL,
  date             DATE          NOT NULL,
  time             VARCHAR(20)   NOT NULL,
  guests           INT           DEFAULT 1,
  special_requests TEXT          DEFAULT NULL,
  status           ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## License

© 2026 Blue Orchids – The Beauty Hub. All rights reserved.
