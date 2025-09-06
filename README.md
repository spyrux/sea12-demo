Welcome to spyrux's laravel php demo project for sea12 that i built over a weekend with cursor to showcase my skillz with 0->1ing and designing stuff.

# Sea12 - Shipment Management System

⚡ **The ultimate cargo tracking powerhouse** - a blazing-fast laravel + react application that transforms how you manage shipments. built with cutting-edge tech and designed for the modern shipping world.

## 🚀 What's Under the Hood

- **🎯 Shipment Mastery**: Create, track, and dominate cargo management like a pro
- **🚢 Vessel Ninja**: Real-time vessel tracking with ETAs that actually work
- **💰 Transaction Wizard**: Handle complex financial flows with surgical precision
- **👥 Party Central**: Manage shipping relationships like a networking guru
- **📝 Version Control**: Every change tracked, every decision audited
- **🎨 UI That Slaps**: Beautiful, responsive interface that doesn't just look good—it feels good
- **⚡ Live Dashboard**: Real-time stats that keep you ahead of the game

## 🛠 The Tech Arsenal

### Backend (The Heavy Lifters)

- **🔥 Laravel 12** - The PHP framework that doesn't mess around
- **💾 SQLite** - Lightning-fast database (or MySQL/PostgreSQL if you're feeling fancy)
- **⚡ Inertia.js** - Server-side rendering that's smoother than butter
- **🧪 Pest** - Testing framework that actually makes testing fun

### Frontend (The Visual Wizards)

- **⚛️ React 19** - The UI framework that changed everything
- **🛡️ TypeScript** - Type safety so good, it's like having a coding bodyguard
- **🎨 Tailwind CSS 4** - Styling that's faster than your ex's texts
- **♿ Radix UI** - Accessible components that work for everyone
- **🎯 Lucide React** - Icons that actually look good
- **⚡ Vite** - Build tool that's so fast, it's basically teleportation

## 📋 What You Need to Get Started

Before we dive in, make sure you've got these bad boys installed:
install php 
https://laravel.com/docs/12.x/installation
- **🟢 Node.js 18+** and npm (the dynamic duo)
- **🎼 Composer** (PHP package manager extraordinaire)
- **📦 Git** (because version control is life)

## 🚀 Let's Get This Party Started

### 1. 🎯 Clone That Bad Boy

```bash
git clone <repository-url>
cd sea12
```

### 2. 📦 Install the Goods

```bash
# Install PHP dependencies (the backend magic)
composer install

# Install Node.js dependencies (the frontend swagger)
npm install
```

### 3. ⚙️ Environment Setup

```bash
# Copy environment file (don't forget this step!)
cp .env.example .env

# Generate application key (security first, always)
php artisan key:generate
```

### 4. 🗄️ Database Setup

We're rocking SQLite by default because it's fast and furious. The database file will magically appear:

```bash
# Run migrations (this creates all the tables)
php artisan migrate

# Seed the database with demo data (because empty databases are boring)
php artisan db:seed --class=DemoDataSeeder
```

### 5. 🚀 Launch Sequence

```bash
# Start all development services (Laravel, Vite, Queue) - the full monty
composer run dev
```

This fires up:

- 🐘 Laravel development server on `http://localhost:8000`
- ⚡ Vite development server for frontend assets
- 🔄 Queue worker for background jobs

Want to run things individually? No problem:

```bash
# Just the Laravel server (if you're feeling minimal)
php artisan serve

# Just the frontend (if you're a frontend purist)
npm run dev
```

## 🔧 configuration

### database configuration

want to switch databases? no problem. we're rocking sqlite by default, but you can go fancy with mysql or postgresql:

1. update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sea12
DB_USERNAME=root
DB_PASSWORD=
```

2. create the database and run migrations:

```bash
php artisan migrate:fresh --seed
```

### environment variables

here are the key environment variables you need to know about:

```env
APP_NAME="Sea12"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

## 📁 project structure

here's how we organize this beast:

```
sea12/
├── app/
│   ├── Enums/           # application enums
│   ├── Http/
│   │   ├── Controllers/ # api controllers
│   │   ├── Middleware/  # custom middleware
│   │   └── Requests/    # form requests
│   ├── Models/          # eloquent models
│   ├── Observers/       # model observers
│   └── Policies/        # authorization policies
├── database/
│   ├── factories/       # model factories
│   ├── migrations/      # database migrations
│   └── seeders/         # database seeders
├── resources/
│   └── js/
│       ├── components/  # react components
│       ├── pages/       # inertia pages
│       ├── layouts/     # page layouts
│       └── types/       # typescript types
├── routes/              # application routes
└── tests/               # test files
```

## 🧪 testing

time to make sure everything works:

```bash
# run all tests
composer test

# run tests with coverage (because we're thorough like that)
composer test -- --coverage
```

## 🎨 development

### code style

we keep things clean around here. laravel pint for php and prettier for js/ts:

```bash
# format php code
./vendor/bin/pint

# format javascript/typescript code
npm run format

# check code style (no messy code allowed)
npm run format:check
```

### type checking

```bash
# check typescript types (because we're not savages)
npm run types
```

### linting

```bash
# lint javascript/typescript code
npm run lint
```

## 📊 database schema

here's what we're working with:

- **shipments**: core shipment records with versioning
- **shipmentversions**: versioned shipment data with audit trails
- **vessels**: vessel information and tracking
- **locations**: origin and destination locations
- **parties**: shipping parties (shippers, consignees, etc.)
- **transactions**: financial transactions
- **transactionlines**: individual transaction line items
- **contracts**: shipping contracts
- **shipmentitems**: individual items within shipments

## 🔐 authentication

we use laravel's built-in authentication system. user registration and login are handled through the standard laravel auth routes.

## 🚢 shipment workflow

1. **planned**: initial shipment creation
2. **in transit**: shipment is actively being transported
3. **arrived**: shipment has reached its destination
4. **closed**: shipment is completed and closed

## 🤝 contributing

want to help make this thing even better? here's how:

1. fork the repository
2. create a feature branch (`git checkout -b feature/amazing-feature`)
3. commit your changes (`git commit -m 'add amazing feature'`)
4. push to the branch (`git push origin feature/amazing-feature`)
5. open a pull request

## 📝 license

this project is licensed under the mit license - see the [license](license) file for details.

## 🆘 support

hit a roadblock? here's where to get help:

1. check the [laravel documentation](https://laravel.com/docs)
2. review the [inertia.js documentation](https://inertiajs.com/)
3. open an issue in the repository

## 🔄 deployment

### production build

time to take this beast live:

```bash
# build frontend assets
npm run build

# optimize laravel for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### environment setup

make sure your production environment has:

- php 8.2+ with required extensions
- node.js 18+ (for building assets)
- web server (apache/nginx)
- database server (mysql/postgresql recommended for production)

## 📈 performance

we don't mess around with performance:

- the application uses laravel's query optimization features
- frontend assets are optimized with vite
- database queries are optimized with proper indexing
- caching is implemented for better performance

---

built with ❤️ using laravel and react
