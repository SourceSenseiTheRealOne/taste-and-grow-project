<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Taste & Grow API

A progressive [Node.js](http://nodejs.org) NestJS API for the Taste & Grow application, powered by **Prisma ORM** and **Supabase PostgreSQL**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation & Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Update your .env file with Supabase credentials
# Open .env and replace [YOUR-PASSWORD] with your actual password
# Get credentials from: Supabase Console → Settings → Database

# 3. Generate Prisma client
npm run prisma:generate

# 4. Create initial database migration
npm run prisma:migrate
# Name it: "init"

# 5. Start development server
npm run start:dev
```

Your API is now running with Prisma + Supabase! 🎉

## 📋 Project Structure

```
src/
├── prisma/
│   ├── prisma.service.ts    # Database service
│   └── prisma.module.ts     # NestJS module
├── auth/                     # Authentication
├── chatgpt/                  # ChatGPT integration
├── config/                   # Configuration
└── entities/                 # Database entities (transitioning to Prisma)

prisma/
└── schema.prisma             # Database schema definition
```

## 📚 Database Configuration

This project uses:
- **ORM**: Prisma
- **Database**: Supabase PostgreSQL
- **Connection Pooling**: Enabled via pgbouncer

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database (Connection pooling for app)
DATABASE_URL="postgresql://postgres.PROJECT_ID:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Database (Direct connection for migrations)
DIRECT_URL="postgresql://postgres.PROJECT_ID:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1

# Server Configuration
PORT=3001
NODE_ENV=development
```

⚠️ **Important**: `.env` is in `.gitignore` - never commit it! Use `.env.example` as a template for your team.

## 🔧 Available Commands

```bash
# Development
npm run start          # Start server
npm run start:dev      # Start in watch mode
npm run start:debug    # Start with debugger

# Build & Production
npm run build          # Build for production
npm run start:prod     # Start production build

# Database
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Create and apply migrations
npm run prisma:studio     # Open visual database browser (http://localhost:5555)
npm run prisma:seed       # Seed database with initial data

# Code Quality
npm run lint           # Lint and fix code
npm run format         # Format code with Prettier
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Test coverage report
npm run test:e2e       # Run end-to-end tests
```

## 📖 Documentation

- **[QUICKSTART.txt](./QUICKSTART.txt)** - Quick reference guide
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Step-by-step setup guide (5 min)
- **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Detailed Prisma & Supabase guide
- **[PRISMA_MIGRATION_SUMMARY.md](../PRISMA_MIGRATION_SUMMARY.md)** - Setup completion summary

## 🗄️ Database Schema

Current models:

### User
```prisma
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  username  String  @unique
  password  String
  role      String  @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Add new models to `prisma/schema.prisma`, then run `npm run prisma:migrate`

## 💡 Using Prisma in Your Code

Example service:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
```

## 🐛 Troubleshooting

**Q: Getting "Can't reach database server"?**
- Verify your Supabase credentials in `.env`
- Check that your Supabase project is active
- Ensure both `DATABASE_URL` and `DIRECT_URL` are set

**Q: Migration fails with "DIRECT_URL not found"?**
- Make sure `DIRECT_URL` is in `.env` (required for migrations)
- Verify the URL format is correct

**Q: Prisma client not found?**
- Run `npm run prisma:generate`
- Restart your IDE's TypeScript language server

**Q: Build fails with TypeScript errors?**
- Run `npm run prisma:generate`
- Check that all Prisma types are generated

## 🔗 External Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS + Prisma Guide](https://docs.nestjs.com/recipes/prisma)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📝 Development Workflow

1. **Create/modify models** → Edit `prisma/schema.prisma`
2. **Migrate database** → Run `npm run prisma:migrate` (creates migration files)
3. **Commit migrations** → Add generated migration files to git
4. **Use in services** → Inject `PrismaService` and use `this.prisma.modelName`

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📦 Tech Stack

- **Framework**: NestJS v11
- **ORM**: Prisma v6
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT + Passport
- **AI Integration**: OpenAI API
- **Language**: TypeScript v5
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## ✅ Setup Status

- ✅ Prisma ORM configured
- ✅ Supabase connection ready
- ✅ NestJS integration complete
- ✅ Database schema initialized
- ✅ Development environment ready

## 📞 Need Help?

- Check the [documentation files](#-documentation) above
- Review [Prisma Discord](https://discord.com/invite/prisma)
- Visit [Supabase Community](https://discord.supabase.com)
- Check [NestJS Discord](https://discord.gg/G7Qnnhy)

---

**Last Updated**: October 17, 2025  
**Framework**: NestJS + Prisma + Supabase PostgreSQL
