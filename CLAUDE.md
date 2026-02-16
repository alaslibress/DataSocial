# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DataSocial** is a social network that connects users with similar interests. It consists of two sub-projects:

- **`DataSocialBACKAPI/`** — Node.js/Express/TypeScript REST API using Neo4j graph database
- **`DataSocialFRONT/DataSocial/`** — React Native (Expo) mobile app

## Backend (`DataSocialBACKAPI/`)

### Commands

```bash
# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Lint
npm run lint

# Type check only
npx tsc --noEmit
```

### Architecture

Pattern: `Route → Controller → Service (Cypher queries) → Neo4j`

- `src/app.ts` — Express entry point, middleware, routes, global error handler
- `src/config/config.ts` — Centralized config loaded from `config.env`
- `src/database/neo4j.ts` — Singleton Neo4j driver
- `src/routes/` — Route definitions
- `src/controllers/` — Request/response handlers
- `src/services/` — All Cypher queries live here
- `src/types/` — TypeScript interfaces (User, Post, Hashtag)
- `src/middlewares/errorHandler.ts` — Global error middleware

### Graph Model

```
(:User)-[:PUBLICA]->(:Post)-[:TIENE_HASHTAG]->(:Hashtag)
```

Affinity between users is calculated as the sum of:
1. Matching `gustoPrincipal1/2/3` fields
2. Shared hashtags through posts

### Configuration (`config.env`)

```
PORT=3000
NODE_ENV=development
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=Rosaprofe.11
```

No CORS — the frontend is React Native, not a web app.

### Neo4j Setup (Docker)

```bash
# Create container
docker run -d \
  --name datasocial-neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/Rosaprofe.11 \
  -v datasocial-neo4j-data:/data \
  neo4j:5

# Start/stop
docker start datasocial-neo4j
docker stop datasocial-neo4j
```

Web browser: `http://localhost:7474` (user: neo4j, password: Rosaprofe.11)

After creating the container, run the 4 constraints and seed data from `setup-neo4j-docker.txt`.

The `biografia` field only accepts 4 exact string values (see `setup-neo4j-docker.txt` section 4).

## Frontend (`DataSocialFRONT/DataSocial/`)

### Commands

```bash
# Start Expo dev server
npm start

# Android emulator
npm run android

# iOS simulator
npm run ios

# Lint + Prettier check
npm run lint

# Auto-fix lint + format
npm run format
```

### Architecture

- **Routing**: Expo Router (file-based). `app/_layout.tsx` handles auth redirect logic.
  - `(auth)/` group — `login.tsx`, `registro.tsx`
  - `(tabs)/` group — `index.tsx` (feed), `crear-post.tsx`, `afinidad.tsx`, `perfil.tsx`
- **State**: Zustand store at `store/useAuthStore.ts` — holds logged-in user, exposes login/registro/logout/actualizarPerfil
- **API client**: `api/axios.ts` — base URL auto-switches between Android emulator (`10.0.2.2:3000`) and iOS/web (`localhost:3000`)
- **API modules**: `api/userApi.ts`, `api/postApi.ts`
- **Shared types**: `types/index.ts` — `User`, `Post`, `AfinidadResult`, `RegistroData`
- **Reusable components**: `components/` — `PostCard`, `AfinidadCard`, `HashtagChips`
- **Styling**: NativeWind (Tailwind CSS for React Native) + React Native Paper (MD3 theme, primary color `#7C3AED`)
