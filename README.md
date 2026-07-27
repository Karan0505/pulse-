# Pulse GraphQL Backend (Enterprise Clean Architecture)

Production-ready, highly scalable, enterprise-grade GraphQL backend built using Node.js, TypeScript, Apollo Server v4/v5, `graphql-ws`, Express, Prisma ORM, PostgreSQL, Redis, JWT Authentication, and Zod validation.

---

## 🛠 Tech Stack

- **Runtime & Language**: Node.js & Strict TypeScript
- **API Engine**: Apollo Server & Express
- **GraphQL Subscriptions**: `graphql-ws` & WebSockets over `ws`
- **Database & ORM**: PostgreSQL & Prisma ORM (19 domain models)
- **Caching & PubSub**: Redis (`ioredis`) & `graphql-subscriptions`
- **Authentication**: JWT (Access Tokens + Refresh Tokens) & bcryptjs
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization
- **Validation**: Zod Schemas
- **Performance**: DataLoader (N+1 query prevention) & Redis Caching
- **Logging**: Pino & Pino HTTP Logger
- **Email Service**: Nodemailer (Welcome, Password Reset, Email Verification)
- **AI Module**: Conversation History, Prompt Tracking, Pluggable Streaming Response Engine

---

## 📁 Architecture & Directory Structure

Follows Enterprise Clean Architecture with decoupled Repository Pattern, Service Layer, Validators, and Resolvers:

```
pulse/
├── prisma/
│   ├── schema.prisma          # 19 Enterprise Models, Relations & Indexes
│   └── seed.ts                # Database Seeder (Roles, Permissions, Admin)
├── src/
│   ├── app.ts                 # Express Setup, Security Headers, CORS, Rate Limiting
│   ├── server.ts              # Server Entrypoint (Apollo Server + WebSockets + HTTP)
│   ├── config/                # Environment Variable Central Config
│   ├── constants/             # Enums, Roles, Permissions, PubSub Triggers
│   ├── auth/                  # Password Hashing & JWT Token Management
│   ├── errors/                # Custom Error Classes & GraphQL Error Formatter
│   ├── interfaces/            # TypeScript Interfaces & GraphQL Context
│   ├── logger/                # Pino Structured JSON Logger
│   ├── loaders/               # DataLoaders for N+1 Batching (Users, Orgs, Teams, etc.)
│   ├── validators/            # Zod Input Validation Schemas
│   ├── prisma/                # Prisma Client Singleton
│   ├── redis/                 # Redis Client & RedisService Cache Helper
│   ├── events/                # PubSub Event Emitter
│   ├── repositories/          # Data Access Layer (Prisma queries)
│   │   ├── UserRepository.ts
│   │   ├── BlogRepository.ts
│   │   ├── OrganizationRepository.ts
│   │   ├── TeamRepository.ts
│   │   ├── CategoryRepository.ts
│   │   ├── NotificationRepository.ts
│   │   ├── ActivityLogRepository.ts
│   │   ├── AnalyticsRepository.ts
│   │   └── AIRepository.ts
│   ├── services/              # Core Business Logic Layer
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   ├── BlogService.ts
│   │   ├── OrganizationService.ts
│   │   ├── TeamService.ts
│   │   ├── CategoryService.ts
│   │   ├── NotificationService.ts
│   │   ├── AIService.ts
│   │   └── EmailService.ts
│   ├── controllers/           # File Upload Controller
│   └── graphql/               # GraphQL Domain Layer
│       ├── typeDefs/          # Type Definitions (Schema)
│       ├── resolvers/         # Queries, Mutations, Subscriptions & Type Resolvers
│       ├── middleware/        # Auth & RBAC Resolver Guards
│       ├── context/           # GraphQL Context Factory
│       └── schema.ts          # Executable Schema Builder
├── .env                       # Local Environment Configuration
├── package.json
└── tsconfig.json
```

---

## ⚙️ Prerequisites

1. **Node.js** (v18.x or later)
2. **PostgreSQL** installed and running locally on port `5432`
3. **Redis** installed and running locally on port `6379`

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` if not already present:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` matches your local PostgreSQL instance:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pulse_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Database Migration & Seeding
Generate Prisma Client:
```bash
npm run prisma:generate
```

Run Database Migrations:
```bash
npm run prisma:migrate
```

Seed Database (Creates Admin Account, Default Roles & Permissions):
```bash
npm run prisma:seed
```

Default Admin Credentials:
- **Email**: `admin@pulsebackend.com`
- **Password**: `AdminPassword123!`

---

## 🏃 Running the Application

### Development Mode
Start dev server with hot reload (`ts-node-dev`):
```bash
npm run dev
```

The GraphQL endpoint will be available at:
- **HTTP**: `http://localhost:4000/graphql`
- **WebSockets**: `ws://localhost:4000/graphql`
- **Health Check**: `http://localhost:4000/health`

### Production Build & Run
Compile TypeScript and run compiled JS:
```bash
npm run build
npm start
```

---

## 🔒 Authentication & GraphQL Usage

Send the Access Token in your GraphQL request header:
```json
{
  "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"
}
```

### Sample GraphQL Operations

#### Signup Mutation
```graphql
mutation Signup {
  signup(input: {
    email: "john@example.com"
    password: "Password123!"
    firstName: "John"
    lastName: "Doe"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      role {
        name
      }
    }
  }
}
```

#### Login Mutation
```graphql
mutation Login {
  login(input: {
    email: "admin@pulsebackend.com"
    password: "AdminPassword123!"
  }) {
    accessToken
    refreshToken
  }
}
```

#### Fetch Current User (Query)
```graphql
query Me {
  me {
    id
    email
    firstName
    lastName
    role {
      name
      permissions {
        action
        resource
      }
    }
  }
}
```

#### GraphQL Subscription (Real-time Notifications over `graphql-ws`)
```graphql
subscription OnNotification {
  notificationCreated {
    id
    title
    message
    type
    createdAt
  }
}
```

---

## 📂 File Upload REST API

Post files to `/api/v1/upload` (Form Data field: `file`):
```bash
curl -X POST http://localhost:4000/api/v1/upload \
  -F "file=@/path/to/image.jpg"
```
Response:
```json
{
  "message": "File uploaded successfully",
  "url": "http://localhost:4000/uploads/uuid.jpg",
  "filename": "uuid.jpg",
  "size": 1048576
}
```
