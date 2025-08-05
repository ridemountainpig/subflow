# Contributing to Subflow

Thank you for your interest in contributing to Subflow!

## 🚀 Technology Stack

- **Next.js** - React framework with App Router
- **Tailwind CSS** - CSS framework
- **shadcn/ui** - UI components library
- **Clerk** - Authentication and user management
- **MongoDB** - NoSQL database
- **exchangerate.host** - Currency exchange API

## 🛠️ Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/ridemountainpig/subflow.git
cd subflow
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
CLERK_WEBHOOK_SIGNING_SECRET=your_webhook_secret  # Optional
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/subscription
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/subscription

# MongoDB (Required)
MONGODB_URI=your_mongodb_connection_string

# Exchange Rate API (Required)
EXCHANGERATE_HOST_API_KEY=your_api_key
```

### 4. Set up required services

#### Clerk Authentication

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the API keys to your `.env.local`

#### MongoDB

Choose one of the following options:

- **Local**: `mongodb://localhost:27017`
- **Cloud**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Zeabur** (Recommended): Deploy using [Zeabur MongoDB Template](https://zeabur.com/templates/KXL04P)

Note: Database name will be handled in the application code.

#### Exchange Rate API

Get a free API key from [exchangerate.host](https://exchangerate.host)

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Making Changes

1. Create a new branch for your feature or fix
2. Make your changes and test locally
3. Run `pnpm format` and `pnpm run build` to ensure code quality
4. Commit your changes with a descriptive message
5. Push to your fork and submit a Pull Request

When submitting a PR, please:

- Include a clear description of changes
- Add screenshots for UI changes
- Reference any related issues

Thank you for contributing! 🎉
