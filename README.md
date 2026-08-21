# API Testing Framework

A production-style REST API test automation framework built with TypeScript and Playwright (`APIRequestContext`). Designed with standard QA engineering practices including client layer abstractions, strongly-typed request/response models, Zod runtime schema contract validation, dynamic test data factories powered by `@faker-js/faker`, response latency SLA assertions, custom Playwright fixtures, dedicated negative and boundary test suites, and GitHub Actions CI integration.

---

## Overview

This framework demonstrates practical, maintainable API automation capabilities:
- **Modular API Client Architecture**: Decoupled HTTP requests from test specifications via reusable, resource-specific client classes (`BaseApiClient`, `AuthClient`, `UsersClient`, `HealthClient`).
- **Response Latency SLA Assertions**: Automatic timing measurement (`responseTimeMs`) on every API request with configurable SLA threshold assertions (`assertSla`, `tests/performance/sla.spec.ts`).
- **Dynamic Test Data Generation**: Powered by **`@faker-js/faker`** (`src/data/user.factory.ts`), generating realistic dynamic payloads for POST/PUT operations with optional deterministic seeding (`seedFaker`).
- **Runtime JSON Schema & Contract Testing**: Powered by **Zod** (`src/models/schemas/`), validating live API responses against runtime type contracts with diagnostic error reporting (`src/utils/schema-validator.ts`).
- **Strongly-Typed Contracts**: Full TypeScript strict mode compliance with generic response wrappers (`ApiResponse<T>`) and explicit request/response interfaces.
- **Fixture-Driven Tests**: Custom Playwright fixtures for seamless API client injection into test suites.
- **Dedicated Test Suites**: Organized into positive domain flows, JSON contract validation, failure state testing, parameter boundary testing, and performance SLA benchmarks.

---

## Tech Stack

- **Language**: TypeScript (Strict Mode)
- **Test Runner**: Playwright Test (`APIRequestContext`)
- **Schema Validation**: Zod (`z.object()`, `safeParse()`)
- **Test Data Generation**: `@faker-js/faker`
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
│       └── api-tests.yml        # CI pipeline executing linting, typechecking, and test suite
├── src/
│   ├── clients/                 # Reusable API Client abstractions
│   │   ├── BaseApiClient.ts     # Abstract base client measuring request latency (responseTimeMs)
│   │   ├── AuthClient.ts        # Authentication & token endpoints
│   │   ├── UsersClient.ts       # Users CRUD endpoints
│   │   └── HealthClient.ts      # Availability / health check endpoint
│   ├── config/
│   │   └── env.config.ts        # Centralized typed environment & SLA threshold configuration
│   ├── data/
│   │   └── user.factory.ts      # Dynamic test data builder functions powered by @faker-js/faker
│   ├── fixtures/
│   │   └── test.fixture.ts      # Playwright test fixtures for client injection
│   ├── models/                  # TypeScript interfaces & Zod runtime schemas
│   │   ├── common.model.ts      # Generic ApiResponse<T> wrapper with responseTimeMs
│   │   ├── auth.model.ts        # Auth request/response interfaces
│   │   ├── user.model.ts        # User resource interfaces
│   │   └── schemas/             # Zod Schema definitions for contract testing
│   │       ├── common.schema.ts # Error response schema
│   │       ├── auth.schema.ts   # Login & auth/me response schemas
│   │       └── user.schema.ts   # User & UsersList response schemas
│   └── utils/
│       ├── schema-validator.ts  # Reusable Zod schema validation utility
│       └── sla-validator.ts     # Reusable response time SLA assertion utility
├── tests/
│   ├── auth/
│   │   └── auth.spec.ts         # Login positive/negative & token auth test cases
│   ├── boundary/
│   │   └── boundary.spec.ts     # Resource ID boundaries, empty payloads, & pagination limits
│   ├── health/
│   │   └── health.spec.ts       # Service availability test cases
│   ├── negative/
│   │   └── negative.spec.ts     # Dedicated failure state testing suite
│   ├── performance/
│   │   └── sla.spec.ts          # Dedicated SLA latency & performance benchmark suite
│   ├── schema/
│   │   └── schema.spec.ts       # Dedicated JSON Schema & contract validation suite
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

### Running Tests & Quality Checks

| Command | Description |
| :--- | :--- |
| `npm run typecheck` | Run TypeScript compiler type checking without emitting files |
| `npm run lint` | Execute ESLint across all TypeScript source and test files |
| `npm run test:api` | Run complete Playwright API test suite |
| `npm run test:schema` | Run Zod JSON Schema contract validation test suite |
| `npm run test:negative` | Run dedicated negative testing suite |
| `npm run test:boundary` | Run dedicated boundary & edge-case test suite |
| `npm run test:sla` | Run response time SLA & latency performance test suite |
| `npm run test:report` | Serve Playwright HTML test report |

---

## Test Coverage Overview

### Health Suite (`tests/health/health.spec.ts`)
- `GET /users?limit=1`: Confirms API connectivity, HTTP status 200, valid headers, and non-empty payload.

### Users Resource Suite (`tests/users/users.spec.ts`)
- Paginated user retrieval, single user GET, POST user creation with Faker.js data, PUT user modification, DELETE user resource, SLA latency assertion, and 404 non-existent user handling.

### Auth Suite (`tests/auth/auth.spec.ts`)
- JWT authentication login, Bearer token profile fetch, invalid login 400 Bad Request handling, and missing token handling.

### JSON Schema & Contract Suite (`tests/schema/schema.spec.ts`)
- Runtime Zod schema contract validation for Users List, Single User, Create User, Delete User, Login, Auth Me, and API Error responses.

### Dedicated Negative Suite (`tests/negative/negative.spec.ts`)
- Verification of 400 Bad Request state on missing credentials, 400 on empty payload, 401/403 state on missing Authorization header, 401/403 state on malformed Bearer token, and 404 state on invalid resource IDs.

### Dedicated Boundary Suite (`tests/boundary/boundary.spec.ts`)
- Querying User ID = `0`, negative ID `-1`, extremely large ID `99999999`, pagination boundary `limit=0`, high pagination boundary `limit=1000`, and updating resource with empty payload `{}`.

### Dedicated SLA Performance Suite (`tests/performance/sla.spec.ts`)
- Validates response latencies for `GET /users`, `GET /users/1`, `POST /auth/login`, and `POST /users/add` against configurable SLA threshold targets (3000ms default).

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
                   Measures & Validates
             +---------------+---------------+
             |                               |
             v                               v
 +-----------------------+       +-----------------------+
 |  Zod Schema Validator |       |   SLA Latency Checker |
 | (schema-validator.ts) |       |   (sla-validator.ts)  |
 +-----------+-----------+       +-----------+-----------+
             |                               |
             +---------------+---------------+
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

1. **Base Client (`BaseApiClient`)**: Wraps Playwright's native `APIRequestContext`. Centralizes request execution (`get`, `post`, `put`, `patch`, `delete`), base URL construction, response duration measurement (`responseTimeMs`), and response formatting into generic `ApiResponse<T>` objects.
2. **Resource Clients (`AuthClient`, `UsersClient`, `HealthClient`)**: Provide domain-specific methods (e.g. `usersClient.getUser(id)`).
3. **Zod Schema Validator (`schema-validator.ts`)**: Validates live JSON responses against Zod definitions at runtime with diagnostic error reporting.
4. **SLA Latency Validator (`sla-validator.ts`)**: Validates response times against configurable thresholds (`defaultSlaThresholdMs`).
5. **Dynamic Data Factory (`user.factory.ts`)**: Generates dynamic payloads via `@faker-js/faker` with optional deterministic seeding (`seedFaker`).
