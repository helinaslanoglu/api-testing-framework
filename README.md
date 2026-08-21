# API Testing Framework

A production-style REST API test automation framework built with TypeScript and Playwright (`APIRequestContext`). Designed with standard QA engineering practices including client layer abstractions, strongly-typed request/response models, dynamic test data factories, custom Playwright fixtures, and GitHub Actions CI integration.

---

## Overview

This framework demonstrates practical, maintainable API automation capabilities:
- **Modular API Client Architecture**: Decoupled HTTP requests from test specifications via reusable, resource-specific client classes (`BaseApiClient`, `AuthClient`, `UsersClient`, `HealthClient`).
- **Strongly-Typed Contracts**: Full TypeScript strict mode compliance with generic response wrappers (`ApiResponse<T>`) and explicit request/response interfaces.
- **Fixture-Driven Tests**: Custom Playwright fixtures for seamless API client injection into test suites.
- **Data Driven & Dynamic Generators**: Dynamic payload generation functions (`user.factory.ts`) ensuring repeatable, isolated test execution.
- **Comprehensive Assertions**: Multi-layer validations checking HTTP status codes, header signatures, response body structure, dynamic data types, and business payload fields.
- **Positive & Negative Test Coverage**: Verification of both happy-path CRUD operations and realistic API failure states (e.g. 404 Not Found, 400 Bad Request, 401 Unauthorized).

---

## Tech Stack

- **Language**: TypeScript (Strict Mode)
- **Test Runner**: Playwright Test (`APIRequestContext`)
- **Runtime**: Node.js (v20+)
- **Package Manager**: npm
- **Linter**: ESLint (Flat Config + `@typescript-eslint`)
- **Target API**: [DummyJSON](https://dummyjson.com) (Public REST API)
- **CI/CD**: GitHub Actions

---

## Project Structure

```
api-testing-framework/
├── .github/
│   └── workflows/
│       └── api-tests.yml        # CI pipeline for linting, typechecking, and test execution
├── src/
│   ├── clients/                 # Reusable API Client abstractions
│   │   ├── BaseApiClient.ts     # Abstract base client wrapping Playwright APIRequestContext
│   │   ├── AuthClient.ts        # Authentication & token endpoints
│   │   ├── UsersClient.ts       # Users CRUD endpoints
│   │   └── HealthClient.ts      # Availability / health check endpoint
│   ├── config/
│   │   └── env.config.ts        # Centralized typed environment configuration
│   ├── data/
│   │   └── user.factory.ts      # Test data builder functions
│   ├── fixtures/
│   │   └── test.fixture.ts      # Playwright test fixtures for client injection
│   ├── models/                  # TypeScript models and interfaces
│   │   ├── common.model.ts      # Generic ApiResponse<T> wrapper
│   │   ├── auth.model.ts        # Auth request/response interfaces
│   │   └── user.model.ts        # User resource interfaces
├── tests/
│   ├── auth/
│   │   └── auth.spec.ts         # Login positive/negative & token auth test cases
│   ├── health/
│   │   └── health.spec.ts       # Service availability test cases
│   └── users/
│       └── users.spec.ts        # User CRUD positive & negative test cases
├── .env.example                 # Environment configuration template
├── .gitignore                   # Workspace git exclusion rules
├── eslint.config.js             # ESLint 9 configuration
├── package.json                 # Project manifest and npm scripts
├── playwright.config.ts         # Playwright API configuration
├── README.md                    # Project documentation
└── tsconfig.json                # Strict TypeScript configuration
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher (v20 recommended)
- npm v9 or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/helinaslanoglu/api-testing-framework.git
cd api-testing-framework
npm install
```

### Environment Setup

Copy the template environment file:

```bash
cp .env.example .env
```

The configuration layer (`src/config/env.config.ts`) automatically falls back to default public endpoints if no `.env` file is present.

### Running Tests & Quality Checks

| Command | Description |
| :--- | :--- |
| `npm run typecheck` | Run TypeScript compiler type checking without emitting files |
| `npm run lint` | Execute ESLint across all TypeScript source and test files |
| `npm run test:api` | Run all Playwright API test suites |
| `npm run test:report` | Serve Playwright HTML test report |

---

## Current Coverage

### Health Suite (`tests/health/health.spec.ts`)
- `GET /users?limit=1`: Confirms API connectivity, HTTP status 200, valid headers, and non-empty payload.

### Users Resource Suite (`tests/users/users.spec.ts`)
- **Positive Scenarios**:
  - Retrieve paginated users list (`GET /users?limit=5&skip=0`).
  - Retrieve single user by ID (`GET /users/1`).
  - Create user resource (`POST /users/add`).
  - Update user resource (`PUT /users/1`).
  - Delete user resource (`DELETE /users/1`).
- **Negative Scenarios**:
  - Retrieve non-existent user ID (`GET /users/99999`), validating HTTP 404 and error body.

### Auth Suite (`tests/auth/auth.spec.ts`)
- **Positive Scenarios**:
  - Authenticate with valid credentials (`POST /auth/login`), asserting JWT `accessToken`.
  - Fetch profile using Bearer token (`GET /auth/me`).
- **Negative Scenarios**:
  - Authenticate with invalid credentials (`POST /auth/login`), validating HTTP 400 Bad Request.
  - Access profile without token (`GET /auth/me`), validating HTTP 401/403 state.

---

## Architecture

```
                 +-----------------------+
                 |  Playwright Test Spec |
                 +-----------+-----------+
                             |
                   Injects via Fixtures
                             v
                 +-----------------------+
                 |  Resource API Clients |
                 | (Auth, Users, Health) |
                 +-----------+-----------+
                             |
                         Extends
                             v
                 +-----------------------+
                 |    BaseApiClient      |
                 | (Wraps Playwright     |
                 |   APIRequestContext)  |
                 +-----------+-----------+
                             |
                  Sends HTTP Request to
                             v
                 +-----------------------+
                 |  Target REST API      |
                 | (https://dummyjson.com)|
                 +-----------------------+
```

1. **Base Client (`BaseApiClient`)**: Wraps Playwright's native `APIRequestContext`. Centralizes request execution (`get`, `post`, `put`, `patch`, `delete`), base URL construction, and standard response formatting into generic `ApiResponse<T>` objects.
2. **Resource Clients (`AuthClient`, `UsersClient`, `HealthClient`)**: Provide clean, domain-specific methods (e.g. `usersClient.getUser(id)`) hiding raw URL formatting and HTTP details.
3. **Fixtures (`test.fixture.ts`)**: Extends Playwright's `test` object to automatically instantiate and expose API clients to test blocks without manual setup boilerplates.
