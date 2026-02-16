# CLAUDE.md

## Project Overview

Node.js/Express/TypeScript API for DataSocial, a social network that connects users with similar interests using a Neo4j graph database. The app collects metadata to build commercial profiles and recommend targeted advertising.

## Architecture

- **Direct Neo4j Connection**: Uses the official `neo4j-driver` to execute Cypher queries directly
- **Pattern**: Route -> Controller -> Service (Neo4j queries) -> Neo4j Database
- **Configuration**: Centralized in `src/config/config.ts`, loads from `config.env`
- **Graph Model**:
  - `(:User)-[:PUBLICA]->(:Post)-[:TIENE_HASHTAG]->(:Hashtag)`
  - Users are connected through shared hashtags

### Key Components

- **src/app.ts**: Entry point - Express server, middleware, routes, error handling
- **src/config/config.ts**: Environment variables configuration
- **src/database/neo4j.ts**: Neo4j driver connection (singleton)
- **src/types/**: TypeScript interfaces (User, Post, Hashtag)
- **src/services/**: Neo4j Cypher queries (userService, postService)
- **src/controllers/**: Request handlers that call services
- **src/routes/**: Route definitions mapping endpoints to controllers
- **src/middlewares/**: Error handling middleware

## Development Commands

```bash
# Development mode with auto-reload
npm run dev

# Alternative dev mode with nodemon
npm run dev:watch

# Build for production
npm run build

# Run production build
npm start

# Type check only
npx tsc --noEmit
```

## Environment Configuration

File: `config.env` (at project root)

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: development/production
- `NEO4J_URI`: Neo4j connection URI (default: bolt://localhost:7687)
- `NEO4J_USER`: Neo4j username
- `NEO4J_PASSWORD`: Neo4j password

## API Endpoints

### Users (`/api/users`)
- `POST /api/users/registro` - Register new user
- `POST /api/users/login` - Login
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/afinidad` - Combined affinity ranking (gustos + hashtags)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts (`/api/posts`)
- `POST /api/posts` - Create post with hashtags
- `GET /api/posts` - List all posts
- `GET /api/posts/usuario/:userId` - Get user's posts
- `GET /api/posts/similares/:userId` - Find users with common hashtags
- `DELETE /api/posts/:id` - Delete post

## Important Notes

- All code is TypeScript
- Passwords are hashed with bcrypt (10 salt rounds)
- User passwords are never returned in API responses
- Hashtags are created automatically via MERGE (no duplicates)
- The similarity query finds users connected through shared hashtags
- No CORS middleware — the frontend is React Native, not web
- Frontend connects using: `const IP = Platform.OS==="android" ? "10.0.2.2" : "localhost";`
