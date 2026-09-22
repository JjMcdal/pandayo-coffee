  # Pandayo Coffee — Project Context

## Project Overview

Pandayo Coffee is a portfolio-quality full-stack web application for managing a coffee shop's operations.

The project is designed to demonstrate:

- Full-stack web development
- Database design and backend development
- Authentication and role-based access control
- POS and inventory workflows
- Automated testing and QA practices
- Maintainable, production-minded development

## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS

### Backend / Database
- Supabase
- PostgreSQL
- GraphQL
- Redis

### Testing
- Jest
- Playwright

### Development / CI
- Git
- GitHub
- GitHub Actions / CI

## Current Application Areas

The application currently includes or is being developed around these areas:

- Authentication and login
- Admin dashboard
- Inventory management
- POS / sales
- Reporting and dashboard metrics
- Role-based access control (RBAC)

## Authentication & RBAC

Authentication determines who the user is.

Authorization / Role-Based Access Control (RBAC) determines what the user is allowed to access.

### Roles

#### Owner
- Full access to the application
- `/admin`
- `/pos`
- `/inventory`

#### Cashier
- POS access
- `/pos`

#### Staff
- Inventory access
- `/inventory`

### Authentication Flow

- Authentication is handled through Supabase Auth.
- User roles are stored in the `profiles` table.
- The application checks the authenticated user's role before allowing access to protected areas.
- Users who are not authenticated are redirected to `/login`.
- Authenticated users are redirected to the appropriate home area based on their role.

## Database & Core Workflows

The application uses Supabase with PostgreSQL as the primary database.

The database currently supports:

- User profiles and roles
- Menu-related data
- Inventory
- Sales / POS transactions
- Inventory stock levels
- Low-stock detection

### Core Inventory Workflow

- Admin users can view inventory.
- Authorized users can create inventory items.
- Authorized users can update inventory items.
- Low-stock items are detected based on configured stock levels.
- Low-stock information is displayed in the admin dashboard.

### Core POS Workflow

- POS transactions create sales records.
- Completed sales can automatically reduce inventory stock.
- Inventory changes are handled through database logic where appropriate.

### Database Source of Truth

The database schema is maintained in:

`supabase/schema.sql`

Database behavior should be treated as the source of truth for data relationships, constraints, and database-level workflows.## Database & Core Workflows

The application uses Supabase with PostgreSQL as the primary database.

The database currently supports:

- User profiles and roles
- Menu-related data
- Inventory
- Sales / POS transactions
- Inventory stock levels
- Low-stock detection

### Core Inventory Workflow

- Admin users can view inventory.
- Authorized users can create inventory items.
- Authorized users can update inventory items.
- Low-stock items are detected based on configured stock levels.
- Low-stock information is displayed in the admin dashboard.

### Core POS Workflow

- POS transactions create sales records.
- Completed sales can automatically reduce inventory stock.
- Inventory changes are handled through database logic where appropriate.

### Database Source of Truth

The database schema is maintained in:

`supabase/schema.sql`

Database behavior should be treated as the source of truth for data relationships, constraints, and database-level workflows.