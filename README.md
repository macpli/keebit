# Keebit

Keebit is an inventory management application designed specifically for custom mechanical keyboards. It allows users to manage their collections of keyboards, switches, and other related items efficiently.

Deployment of the app is comming once it's in a suitable state.

## Features

- **User Authentication**: Secure login using GitHub (more comming).
- **Collection Management**: Create, edit, and delete collections of items.
- **Item Management**: Add, edit, and delete items within collections.
- **Container Management**: Organize items into containers within collections.


## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, PostgreSQL
- **Authentication**: NextAuth.js with GitHub provider
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/keebit.git
   cd keebit
   ```
2. Install dependencies
    ```sh
    npm install
    ```
3. Set up environment variables: Create a .env.local file in the root directory and add the following variables:
```
DATABASE_HOST=your_database_host
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

4. Run the development server:
```
npm run dev
```
### Folder Structure
- app: Contains the main application components and pages.
- components: Reusable UI components.
- lib: Utility functions and database connection.
- types: TypeScript type definitions.
- public/: Static assets.
- styles/: Global styles.