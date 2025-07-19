# DK System

## Description

This project, `dk-system`, is a Node.js application built with TypeScript, designed to provide a robust and scalable backend solution. It leverages `Express.js` for building web APIs, `Zod` for schema validation, `Helmet` for securing HTTP headers and Error Middlewares. The project includes comprehensive testing with `Jest` and `Supertest`, and API documentation is generated using `swagger-jsdoc` and served with `swagger-ui-express`.

## Installation

To get started with the DK System, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd dk-system
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Scripts

Here are the available scripts to manage the project:

- `npm run build`: Compiles the TypeScript source code into JavaScript, outputting to the `dist` directory.
- `npm start`: Starts the compiled Node.js application from the `dist` directory.
- `npm run dev`: Starts the application in development mode using `tsx watch`, which provides live reloading for faster development.
- `npm test`: Runs all tests using `Jest`, with the `--detectOpenHandles` flag to help identify any open handles that might prevent Jest from exiting cleanly.

## API Documentation

The API documentation is generated using Swagger and can be accessed once the server is running. Typically, it will be available at `/docs` relative to your server's base URL (e.g., `http://localhost:3000/docs`).

## Development Setup

For local development, you can use the `npm run dev` script, which will automatically recompile and restart the server on code changes.

## Testing

Tests are written using Jest and Supertest. To run the test suite, use the command:

```bash
npm test
```

## Project Structure

```
.gitignore
package.json
package-lock.json
tsconfig.json
src/
  server.ts
  ...
dist/
  server.js
  ...
```





## Application

This section outlines the core business logic governing topic management within the DK System:

### Topic Creation (POST /topic)

- The `POST /topic` endpoint is used to create new topics.
- In version 1.0 (the root version), this operation always creates a completely new, independent topic.

### Topic Update and Derivation (PUT /topic/{id})

- The `PUT /topic/{id}` endpoint is used to update an existing topic, but it functions as a derivation mechanism.
- Instead of directly modifying the original topic, a new topic is created based on the content of the original topic.
- The `id` of the original topic is used as the `parentTopicId` for this newly created topic, establishing a clear lineage.
- This process facilitates the creation of derivations and manages different versions of a topic, allowing for historical tracking and branching of content.

### Topic Search and Tree Structure (GET /topic/{id})

- The `GET /topic/{id}` endpoint retrieves a specific topic along with its entire tree of subtopics.
- This allows for a comprehensive view of a topic and all its derived versions or related sub-topics.

### Topic Deletion (DELETE /topic/{id})

- A topic can only be deleted if it does not have any subtopics (i.e., no other topics have it as their `parentTopicId`).
- This rule ensures data integrity and prevents the accidental deletion of parent topics that would orphan their derived versions.
