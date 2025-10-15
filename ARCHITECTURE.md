# Modern React App - Hexagonal Architecture

A modern React application implementing Clean Architecture (Hexagonal Architecture) principles with a complete CRUD system for posts using JSONPlaceholder API.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (also known as Ports and Adapters) with clear separation of concerns:

```
src/
├── domain/                    # Domain Layer (Business Logic)
│   ├── entities/             # Domain entities and DTOs
│   │   └── Post.ts
│   └── repositories/         # Repository interfaces (Ports)
│       └── IPostRepository.ts
│
├── application/              # Application Layer (Use Cases)
│   └── use-cases/           # Business use cases
│       ├── CreatePostUseCase.ts
│       ├── DeletePostUseCase.ts
│       ├── GetPostUseCase.ts
│       ├── GetPostsUseCase.ts
│       └── UpdatePostUseCase.ts
│
├── infrastructure/           # Infrastructure Layer (Adapters)
│   └── repositories/        # Repository implementations
│       └── JsonPlaceholderPostRepository.ts
│
├── presentation/            # Presentation Layer (UI)
│   ├── components/         # React components
│   │   ├── PostList.tsx
│   │   ├── PostDetail.tsx
│   │   └── PostForm.tsx
│   └── hooks/             # Custom React hooks
│       └── usePostOperations.ts
│
├── di/                     # Dependency Injection
│   └── container.ts       # DI container
│
└── router/                # Routing configuration
    └── index.tsx         # Router setup with lazy loading
```

## 🎯 Key Features

### Architecture Principles

- **Hexagonal Architecture**: Clean separation between business logic and external dependencies
- **Dependency Inversion**: Domain layer has no dependencies on infrastructure
- **Single Responsibility**: Each layer has a clear, focused purpose
- **Open/Closed Principle**: Easy to extend with new features
- **Interface Segregation**: Small, focused interfaces

### Technical Features

- ✅ **Full CRUD Operations**: Create, Read, Update, Delete posts
- ✅ **Hexagonal Architecture**: Complete separation of concerns
- ✅ **Dependency Injection**: Centralized dependency management
- ✅ **React Query**: Smart caching and data synchronization
- ✅ **Toast Notifications**: Sonner for beautiful confirmations
- ✅ **Lazy Loading**: Route-based code splitting
- ✅ **Modern Routing**: React Router v6 with optimized configuration
- ✅ **TypeScript**: Full type safety
- ✅ **Tailwind CSS**: Modern styling with shadcn/ui components
- ✅ **Clean Code**: ESLint + Prettier with strict rules

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Run ESLint
pnpm format     # Format with Prettier
```

## 📚 Layer Responsibilities

### Domain Layer

**Purpose**: Contains business entities and interfaces (ports)

- Defines `Post` entity and related DTOs
- Declares `IPostRepository` interface
- **No dependencies** on other layers

### Application Layer

**Purpose**: Contains business use cases (orchestration)

- Implements CRUD use cases
- Depends only on Domain layer interfaces
- Validates business rules

### Infrastructure Layer

**Purpose**: Implements external dependencies (adapters)

- `JsonPlaceholderPostRepository` implements `IPostRepository`
- Handles API calls to JSONPlaceholder
- Can be swapped without affecting business logic

### Presentation Layer

**Purpose**: React UI components and hooks

- Connects UI to use cases via custom hooks
- Manages component state and user interactions
- Integrates React Query for caching

### DI Container

**Purpose**: Wires up dependencies

- Single source of truth for dependency creation
- Ensures proper dependency injection
- Makes testing easier

## 🔄 Data Flow

```
User Action → Component → Hook → Use Case → Repository Interface
                                                ↓
                                    Repository Implementation → API
```

### Example: Creating a Post

1. User submits form in `PostForm.tsx`
2. Component calls `createPost.mutate()` from `useCreatePost` hook
3. Hook calls `CreatePostUseCase.execute()`
4. Use case validates and calls `repository.create()`
5. `JsonPlaceholderPostRepository` makes API call
6. Response flows back through layers
7. React Query updates cache
8. Sonner shows success toast
9. Component navigates to new post

## 🎨 UI Components

### PostList

- Displays all posts in a grid
- Lazy loading indicator
- Error handling
- Link to create new post

### PostDetail

- Shows individual post details
- Edit and delete buttons
- Confirmation dialog for deletion (Sonner)
- Navigation back to list

### PostForm

- Create and edit posts
- Form validation
- Loading states
- Cancel and save actions

## 🔧 Configuration

### React Query

- **Stale Time**: 5 minutes
- **Refetch on Window Focus**: Disabled
- Automatic cache invalidation on mutations

### Router

- Lazy loading for all routes
- Loading fallback components
- 404 handling with redirect

### Toast Notifications (Sonner)

- Position: Top right
- Rich colors for success/error
- Confirmation dialogs for destructive actions

## 🧪 Testing Strategy

The architecture makes testing straightforward:

1. **Unit Tests**: Test use cases in isolation with mock repositories
2. **Integration Tests**: Test repository implementations
3. **Component Tests**: Test presentation layer with mock hooks
4. **E2E Tests**: Test complete flows

## 🔄 Adding New Features

### To add a new entity:

1. Create entity in `domain/entities/`
2. Create repository interface in `domain/repositories/`
3. Create use cases in `application/use-cases/`
4. Implement repository in `infrastructure/repositories/`
5. Add to DI container in `di/container.ts`
6. Create components in `presentation/components/`
7. Create custom hooks in `presentation/hooks/`

### Example: Adding Comments

```typescript
// 1. Domain
domain/entities/Comment.ts
domain/repositories/ICommentRepository.ts

// 2. Application
application/use-cases/GetCommentsUseCase.ts
application/use-cases/CreateCommentUseCase.ts

// 3. Infrastructure
infrastructure/repositories/JsonPlaceholderCommentRepository.ts

// 4. DI
di/container.ts (add comment services)

// 5. Presentation
presentation/components/CommentList.tsx
presentation/hooks/useCommentOperations.ts
```

## 🎯 Benefits of This Architecture

1. **Testability**: Easy to test business logic independently
2. **Maintainability**: Clear structure, easy to find code
3. **Flexibility**: Swap implementations without changing business logic
4. **Scalability**: Add features without modifying existing code
5. **Team Collaboration**: Clear boundaries between layers
6. **Technology Independence**: Business logic doesn't depend on React, API, etc.

## 📦 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router 6** - Routing with lazy loading
- **TanStack Query (React Query)** - Data fetching and caching
- **Sonner** - Toast notifications
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - UI components
- **Vite** - Build tool
- **pnpm** - Package manager

## 🌐 API

Uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - a free fake REST API for testing and prototyping.

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ using modern React and Clean Architecture principles.
