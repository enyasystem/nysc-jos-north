# NYSC Jos North Biodata Platform

## Overview

The NYSC Jos North Biodata Platform is a comprehensive web application designed to manage National Youth Service Corps (NYSC) operations in Jos North Local Government Area. It serves as a centralized platform for managing executive committee members (Excos), developers, events, and resources for the corps community. The application provides both public-facing pages and an administrative dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI design
- **State Management**: TanStack React Query for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Icons**: Lucide React for consistent iconography

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript for type safety across the entire stack
- **API Design**: RESTful API architecture with structured routes for different entities
- **Middleware**: Custom logging middleware for API request tracking
- **Error Handling**: Centralized error handling with structured error responses

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Database**: PostgreSQL configured through Drizzle with Neon serverless driver
- **Schema**: Centralized schema definition in shared directory for consistency between frontend and backend
- **Migrations**: Drizzle Kit for database schema migrations and version control

### Data Models
The application manages five core entities:
- **Users**: Authentication and user management
- **Excos**: Executive committee member profiles with contact information
- **Developers**: Platform developer profiles with skills and status tracking
- **Events**: Community events with categorization and status management
- **Resources**: File and document management with categorization
- **UI Settings**: Customizable interface settings for branding and appearance

### Project Structure
- **Monorepo Architecture**: Single repository with client, server, and shared code
- **Shared Types**: Common TypeScript definitions and Zod schemas in `/shared`
- **Client Directory**: React frontend with component-based architecture
- **Server Directory**: Express.js backend with route-based organization
- **Component Library**: Comprehensive UI component library based on Radix UI primitives

### Development Setup
- **Build System**: Vite for frontend, esbuild for backend production builds
- **Development**: Hot module replacement for frontend, tsx for server development
- **Type Checking**: Strict TypeScript configuration with path mapping for clean imports
- **Code Quality**: Organized component structure with separation of concerns

## External Dependencies

### Database Service
- **Neon Database**: Serverless PostgreSQL database hosting
- **Connection**: Environment-based DATABASE_URL configuration
- **Driver**: @neondatabase/serverless for optimized serverless connections

### UI Framework Dependencies
- **Radix UI**: Complete set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Feather-inspired icon library for consistent visual design
- **shadcn/ui**: Pre-built component library built on Radix UI primitives

### Development Tools
- **Vite Plugins**: React plugin, runtime error overlay, and Replit-specific tooling
- **Build Tools**: esbuild for production bundling, PostCSS for CSS processing
- **Type Safety**: Zod for runtime validation, drizzle-zod for schema validation

### Form and Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Hookform Resolvers**: Zod integration for form validation
- **Validation**: Type-safe validation schemas shared between client and server

### Query Management
- **TanStack React Query**: Server state management, caching, and synchronization
- **API Layer**: Custom fetch wrapper with error handling and credential management