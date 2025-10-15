# Modern React 19 App

A modern React application built with the latest technologies and best practices.

## 🚀 Tech Stack

- **React 19** - Latest React with improved performance and new features
- **Vite** - Fast build tool and development server
- **TypeScript** - Strict typing with comprehensive ESLint configuration
- **Tailwind CSS 4** - Next-generation utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible component library
- **React Router** - Declarative routing for React
- **TanStack Query** - Powerful data synchronization for React
- **pnpm** - Fast, disk space efficient package manager

## 🛠️ Development Tools

- **ESLint** - Super strict linting configuration
- **Prettier** - Code formatting with Tailwind CSS support
- **Husky** - Git hooks for pre-commit validation
- **lint-staged** - Run linters on staged files
- **TypeScript** - Strict configuration with comprehensive rules

## 📦 Installation

Make sure you have Node.js 20+ and pnpm installed.

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

## 🧹 Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type check
pnpm type-check
```

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
├── App.tsx           # Main app component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## ⚡ Features

- **Modern React 19** with latest features and performance improvements
- **Strict TypeScript** configuration with comprehensive error checking
- **Super strict ESLint** with rules for React, TypeScript, accessibility, and Tailwind CSS
- **Automatic code formatting** with Prettier and Tailwind CSS class sorting
- **Pre-commit hooks** for linting, formatting, and type checking
- **Optimized Vite configuration** with smart chunking and fast HMR
- **Ready-to-use components** from shadcn/ui
- **TanStack Query** setup for efficient data fetching
- **React Router** for client-side routing

## 🎯 Development Guidelines

- Follow the established ESLint and Prettier configurations
- Use TypeScript strictly - no `any` types
- Prefer functional components with hooks
- Use TanStack Query for server state management
- Follow the component structure from shadcn/ui
- Keep components small and focused
- Use semantic HTML and ensure accessibility

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript compiler

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `.prettierrc` - Prettier configuration

## 🚨 Pre-commit Hooks

The project uses Husky to run the following checks before commits:

- **Pre-commit**: Lint and format staged files
- **Pre-push**: Run type checking
- **Commit-msg**: Validate commit message format

## 📚 Learn More

- [React 19 Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [React Router Documentation](https://reactrouter.com)

## 📄 License

This project is licensed under the MIT License.
