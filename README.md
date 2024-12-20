# Screen Recorder

This is a screen recording application built with TypeScript, Express, Sequelize, and Socket.IO.

## Prerequisites

- Node.js
- PostgreSQL

## Installation

Clone the repository:

```sh
git clone <repository-url>
cd screen-recorder
```

Install dependencies:

```sh
npm install
```

Create a `.env` file based on .env.example and fill in the required environment variables:

```sh
cp .env.example .env
```

## Scripts

- **Build the project:**

```sh
npm run build
```

- **Start the project:**

```sh
npm start
```

- **Start the project in development mode:**

```sh
npm run dev
```

- **Run tests:**

```sh
npm test
```

- **Run tests with coverage:**

```sh
npm run test:cov
```

- **Create the database:**

```sh
npm run db:create
```

- **Drop the database:**

```sh
npm run db:drop
```

- **Recreate the database and run migrations:**

```sh
npm run db:up
```

## Usage

Start the server:

```sh
npm start
```

The server will be running on `http://localhost:3001`
