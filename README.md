# Kali MHS Enterprise MERN Application

A modern, enterprise-grade MERN stack application built with Clean Architecture principles, designed for scalability and maintainability.

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Architecture**: Clean Architecture (Domain-Driven Design)
- **Validation**: Zod
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Email**: Nodemailer
- **File Upload**: Multer

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **State Management**: React Query (TanStack Query) + Context API
- **API Client**: Axios
- **3D Rendering**: Three.js + React Three Fiber
- **Validation**: Zod

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload for both frontend and backend
- **Database**: MongoDB container with persistent volumes

## 📁 Project Structure

```
kali-mhs/
├── backend/                # Express backend
│   ├── src/
│   │   ├── domain/        # Business entities
│   │   ├── usecases/      # Business logic
│   │   ├── controllers/   # HTTP handlers
│   │   ├── routes/        # API routes
│   │   ├── infrastructure/# External services
│   │   ├── middlewares/   # Custom middleware
│   │   ├── validations/   # Zod schemas
│   │   ├── config/        # Configuration
│   │   └── jobs/          # Background jobs
│   ├── uploads/           # File uploads
│   └── Dockerfile.dev     # Dev Docker image
│
├── frontend/              # Next.js frontend
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Utilities & API client
│   └── Dockerfile.dev    # Dev Docker image
│
└── docker-compose.yml    # Multi-container orchestration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (optional, recommended)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kali-mhs
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up
   ```

   This will start:
   - MongoDB on `localhost:27017`
   - Backend API on `localhost:5000`
   - Frontend on `localhost:3000`

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Option 2: Local Development (Without Docker)

1. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Get your connection string

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your MongoDB connection string
   npm install
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   cp .env.example .env.local
   # Edit .env.local if needed
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

### Backend (.env)
See `backend/.env.example` for all required variables:
- MongoDB connection string
- JWT secrets
- CORS origins
- SMTP/email configuration
- File upload settings

### Frontend (.env.local)
See `frontend/.env.example` for configuration:
- API base URL
- Feature flags
- Application URLs

## 📝 Available Scripts

### Backend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Lint code
npm run format    # Format code with Prettier
npm test          # Run tests
```

### Frontend
```bash
npm run dev       # Start Next.js dev server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Lint code
```

## 🏛️ Clean Architecture

The backend follows Clean Architecture principles:

1. **Domain Layer**: Pure business entities and interfaces
2. **Use Cases Layer**: Business rules and application logic
3. **Controllers Layer**: HTTP request handlers
4. **Infrastructure Layer**: External services (DB, email, storage)

**Benefits**:
- ✅ Testable - Business logic independent of frameworks
- ✅ Flexible - Easy to swap out technologies
- ✅ Maintainable - Clear separation of concerns
- ✅ Scalable - Add features without breaking existing code

## 🔐 Security Features

- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Rate limiting (general + auth-specific)
- ✅ Input sanitization (NoSQL injection prevention)
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Request correlation IDs for tracking
- ✅ Comprehensive error handling

## 🎨 Frontend State Management

**React Query (TanStack Query)** for server state:
- Automatic caching and refetching
- Built-in loading/error states
- Optimistic updates
- Request deduplication

**Context API** for client state:
- Theme preferences
- UI state
- User preferences

## 📦 Deployment

The application is containerized and can be deployed to:
- AWS (ECS, EC2, Lambda)
- Azure (App Service, Container Instances)
- Google Cloud (Cloud Run, Compute Engine)
- DigitalOcean Droplets
- Any VPS with Docker support
- On-premise servers

**"Build once, deploy anywhere"** - Same Docker images work on all platforms.

## 🛣️ Roadmap

Phase 1: ✅ Foundation (Current)
- Backend Clean Architecture
- Frontend Next.js setup
- Docker development environment

Phase 2: Backend Core Architecture
Phase 3: Database Schema & Models
Phase 4-8: Business Features (CMS, RFQ, Documents, Careers, Email)
Phase 9-11: Frontend Development
Phase 12-15: Security, SEO, DevOps, Testing
Phase 16-17: Future-proofing & Documentation

## 📄 License

Proprietary - Kali MHS Enterprise

## 👥 Team

Kali MHS Development Team

---

Built with ❤️ using Modern MERN Stack
