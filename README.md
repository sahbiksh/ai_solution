# AI-Solutions — Customer Inquiry and Promotion Website

A full-stack web application for AI-Solutions, a Sunderland-based AI software company. Features a promotional public website, customer inquiry system, AI chatbot, and secure admin dashboard with analytics.

## Features

### Public Website
- Home, About, Services, Portfolio, Testimonials, Blog, Gallery, Events, Contact pages
- AI-powered virtual assistant chatbot
- Responsive Bootstrap 5 design
- Client-side form validation

### Admin Panel
- JWT-authenticated secure login
- Dashboard with analytics charts (Chart.js)
- Inquiry management with search, filter, and pagination
- CSV and PDF export
- Status tracking (new, in progress, resolved, closed)

### Security
- bcrypt password hashing
- JWT authentication with role-based access
- Rate limiting, Helmet headers, XSS/CSRF protection
- Input validation on client and server
- MongoDB injection sanitization

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Bootstrap 5, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcrypt |
| Testing | Jest, Supertest |
| Deployment | Vercel (frontend), Render/Railway (backend) |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Access
- **Website:** http://localhost:5173
- **API:** http://localhost:5000/api
- **Admin:** http://localhost:5173/admin/login
- **Credentials:** admin@ai-solutions.co.uk / Admin@123456

## Project Structure

```
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/         # DB connection, constants
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, validation, security
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # JWT, email, export, seed
│   │   └── validators/     # Input validation
│   └── tests/              # Jest tests
├── frontend/               # React.js SPA
│   └── src/
│       ├── components/     # UI components
│       ├── pages/          # Route pages
│       ├── services/       # API client
│       └── context/        # Auth context
└── docs/                   # Documentation
    ├── database/           # ER diagram, schema, data dictionary
    ├── system-design/      # Requirements, diagrams
    ├── testing/            # Test cases
    ├── deployment/         # Deployment guide
    ├── API_DOCUMENTATION.md
    ├── PROJECT_DOCUMENTATION.md
    ├── user-manual.md
    └── admin-manual.md
```

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/inquiries | Public | Submit inquiry |
| POST | /api/auth/login | Public | Admin login |
| GET | /api/inquiries | Admin | List inquiries |
| GET | /api/inquiries/statistics | Admin | Analytics data |
| GET | /api/inquiries/export/csv | Admin | Export CSV |
| GET | /api/content/testimonials | Public | Testimonials |
| GET | /api/content/articles | Public | Blog articles |
| POST | /api/content/chatbot | Public | Chatbot |
| GET | /api/health | Public | Health check |

Full API documentation: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## Testing

```bash
cd backend
npm test
```

## Deployment

See [docs/deployment/DEPLOYMENT_GUIDE.md](docs/deployment/DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Vercel, Render/Railway, and MongoDB Atlas.

## Documentation

| Document | Description |
|----------|-------------|
| [Project Documentation](docs/PROJECT_DOCUMENTATION.md) | Full academic project report |
| [Database Design](docs/database/DATABASE_DESIGN.md) | ER diagram, schema, normalization |
| [System Analysis](docs/system-design/SYSTEM_ANALYSIS.md) | Requirements, diagrams, architecture |
| [API Documentation](docs/API_DOCUMENTATION.md) | REST API reference |
| [Testing](docs/testing/TESTING.md) | Test cases and strategy |
| [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md) | Cloud deployment instructions |
| [User Manual](docs/user-manual.md) | End-user guide |
| [Admin Manual](docs/admin-manual.md) | Administrator guide |

## License

MIT
