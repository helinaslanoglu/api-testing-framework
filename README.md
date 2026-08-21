# API Testing Framework

A production-style REST API test automation & quality engineering framework built with TypeScript and Playwright (`APIRequestContext`). Designed with standard QA engineering practices including client layer abstractions, pre-authenticated fixtures, strongly-typed request/response models, Zod runtime schema contract validation, dynamic test data factories powered by `@faker-js/faker`, response latency SLA assertions, sensitive-redacted diagnostic logging, controlled transient retries, categorized Playwright test tags, and GitHub Actions CI integration.

---

## Overview

This framework demonstrates practical, maintainable API quality engineering capabilities:
- **Modular API Client Architecture**: Decoupled HTTP requests from test specifications via reusable, resource-specific client classes (`BaseApiClient`, `AuthClient`, `UsersClient`, `HealthClient`).
- **Pre-Authenticated Fixtures**: Isolated authentication handling via `authenticatedUsersClient` fixture, ensuring token isolation without hardcoding credentials in test blocks.
- **Resource Collection Pagination Testing**: Dedicated pagination suite (`tests/pagination/pagination.spec.ts`) validating default limits, skip offsets, page isolation, and metadata consistency (`src/utils/pagination-validator.ts`).
- **Controlled Retry Strategy**: Exponential backoff retry handler (`src/utils/retry-handler.ts`) for transient HTTP/network failures (500, 502, 503, 504, 429) while preserving deterministic assertion failures.
- **Sensitive-Redacted Diagnostics**: Security-conscious logger (`src/utils/logger.ts`) redacting passwords, JWT tokens, Bearer headers, and secrets in diagnostic logs.
- **Response Latency SLA Assertions**: Automatic timing measurement (`responseTimeMs`) on every API request with configurable SLA threshold assertions (`assertSla`, `tests/performance/sla.spec.ts`).
- **Dynamic Test Data Generation**: Powered by **`@faker-js/faker`** (`src/data/user.factory.ts`), generating realistic dynamic payloads with optional deterministic seeding (`seedFaker`).
- **Runtime JSON Schema & Contract Testing**: Powered by **Zod** (`src/models/schemas/`), validating live API responses against runtime type contracts with line-level diagnostic error reporting (`src/utils/schema-validator.ts`).
- **Categorized Test Tagging**: Organized into targeted execution tags (`@smoke`, `@auth`, `@pagination`, `@retry`, `@contract`, `@negative`, `@boundary`, `@sla`).

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
│       └── api-tests.yml        # CI pipeline executing smoke & full regression test suites
├── src/
│   ├── clients/                 # Reusable API Client abstractions
│   │   ├── BaseApiClient.ts     # Base client measuring latency & formatting redacted logs
│   │   ├── AuthClient.ts        # Authentication & token endpoints
│   │   ├── UsersClient.ts       # Users CRUD endpoints
│   │   └── HealthClient.ts      # Availability / health check endpoint
│   ├── config/
│   │   └── env.config.ts        # Centralized environment, SLA, & retry configuration
│   ├── data/
│   │   └── user.factory.ts      # Dynamic test data builder functions powered by @faker-js/faker
│   ├── fixtures/
│   │   └── test.fixture.ts      # Playwright test fixtures (including authenticatedUsersClient)
│   ├── models/                  # TypeScript interfaces & Zod runtime schemas
│   │   ├── common.model.ts      # Generic ApiResponse<T> wrapper with responseTimeMs
│   │   ├── auth.model.ts        # Auth request/response interfaces
│   │   ├── user.model.ts        # User resource interfaces
│   │   └── schemas/             # Zod Schema definitions for contract testing
│   │       ├── common.schema.ts # Error response schema
│   │       ├── auth.schema.ts   # Login & auth/me response schemas
│   │       └── user.schema.ts   # User & UsersList response schemas
│   └── utils/
│       ├── logger.ts            # Sensitive-redacted diagnostic logger utility
│       ├── pagination-validator.ts# Collection & pagination metadata validation helper
│       ├── retry-handler.ts     # Controlled retry handler with exponential backoff
│       ├── schema-validator.ts  # Reusable Zod schema validation utility
│       └── sla-validator.ts     # Reusable response time SLA assertion utility
├── tests/
│   ├── auth/
│   │   └── auth.spec.ts         # Authentication & Bearer token tests (@auth, @smoke)
│   ├── boundary/
│   │   └── boundary.spec.ts     # ID boundaries, empty payloads, & limit edge cases (@boundary)
│   ├── health/
│   │   └── health.spec.ts       # Service availability test cases (@health, @smoke)
│   ├── negative/
│   │   └── negative.spec.ts     # Dedicated failure state testing suite (@negative)
│   ├── pagination/
│   │   └── pagination.spec.ts   # Collection pagination & page isolation suite (@pagination, @smoke)
│   ├── performance/
│   │   └── sla.spec.ts          # Dedicated SLA latency & performance benchmark suite (@sla)
│   ├── retry/
│   │   └── retry.spec.ts        # Controlled transient error retry policy suite (@retry)
│   └── schema/
│       └── schema.spec.ts       # Dedicated JSON Schema & contract validation suite (@contract)
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
| `npm run test:api` | Run full API regression test suite across all 8 spec files |
| `npm run test:smoke` | Run fast smoke test suite (`@smoke`) |
| `npm run test:auth` | Run authentication & authorization test suite (`@auth`) |
| `npm run test:pagination` | Run collection pagination & page isolation test suite (`@pagination`) |
| `npm run test:retry` | Run controlled transient retry policy test suite (`@retry`) |
| `npm run test:schema` | Run Zod JSON Schema contract validation test suite (`@contract`) |
| `npm run test:negative` | Run dedicated negative failure testing suite (`@negative`) |
| `npm run test:boundary` | Run dedicated boundary & edge-case test suite (`@boundary`) |
| `npm run test:sla` | Run response time SLA & latency performance test suite (`@sla`) |
| `npm run test:report` | Serve Playwright HTML test report |

---

## Architecture

```
                 +-----------------------+
                 |  Playwright Test Spec |
                 +-----------+-----------+
                             |
                   Injects via Fixtures
              (e.g. authenticatedUsersClient)
                             v
                 +-----------------------+
                 |  Resource API Clients |
                 | (Auth, Users, Health) |
                 +-----------+-----------+
                             |
             +---------------+---------------+
             |               |               |
             v               v               v
 +-----------------------+ +-------------------+ +-------------------+
 |  Zod Schema Validator | |  SLA Latency      | |  Redacted Logger  |
 | (schema-validator.ts) | | (sla-validator.ts)| | (logger.ts)       |
 +-----------+-----------+ +---------+---------+ +---------+---------+
             |                       |                   |
             +-----------------------+-------------------+
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

1. **Base Client (`BaseApiClient`)**: Wraps Playwright's native `APIRequestContext`. Centralizes request execution, latency measurement (`responseTimeMs`), sensitive data redaction (`logger.ts`), and uniform response formatting into `ApiResponse<T>`.
2. **Resource Clients (`AuthClient`, `UsersClient`, `HealthClient`)**: Provide domain-specific methods (e.g. `usersClient.getUser(id)`).
3. **Pre-Authenticated Fixtures (`test.fixture.ts`)**: Extends Playwright's `test` object with `authenticatedUsersClient` providing pre-authenticated token state.
4. **Retry Strategy (`retry-handler.ts`)**: Retries transient HTTP 5xx/429 failures with exponential backoff while allowing deterministic test failures to report immediately.
5. **Redacted Diagnostics (`logger.ts`)**: Sanitizes authorization tokens, passwords, and sensitive headers in diagnostic outputs.
