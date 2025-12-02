# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medusa is an open-source headless commerce platform that provides building blocks for digital commerce applications. It's a sophisticated, enterprise-grade e-commerce platform built with modern JavaScript/TypeScript tooling.

## Common Development Commands

### Building and Development
```bash
# Build all packages
yarn build

# Watch mode for development (in specific package)
cd packages/medusa && yarn watch

# Run development server (for admin dashboard)
cd packages/admin/dashboard && yarn dev
```

### Testing
```bash
# Run unit tests across all packages
yarn test

# Run specific integration tests
yarn test:integration:packages    # Package integration tests
yarn test:integration:api         # API integration tests
yarn test:integration:modules     # Module integration tests

# Run tests for a specific package
cd packages/medusa && yarn test
```

### Code Quality
```bash
# Type checking (run after making changes)
tsc --noEmit

# Linting (run after type checking)
yarn lint
yarn lint --fix

# Format code
yarn prettier
```

### Git Workflow
```bash
# Install git hooks
yarn hooks:install

# Version packages (for maintainers)
yarn version

# Generate OpenAPI specs
yarn openapi:generate
```

### CRITICAL: Commit and Push Rules
**Claude Code MUST ask for user permission before:**
- Any `git commit` operation
- Any `git push` operation

This rule applies to ALL files and ALL changes, regardless of the topic or context. No exceptions.

## Architecture and Patterns

### Module Structure
Each domain (product, order, customer, etc.) is organized as a module with consistent structure:
```
packages/modules/[module-name]/
├── src/
│   ├── models/          # Database entities
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── migrations/      # Database migrations
│   └── index.ts         # Module definition
```

### Service Pattern
Services extend `MedusaService` and use dependency injection:
```typescript
class ProductService extends MedusaService {
  @InjectTransactionManager()
  @MedusaContext()
  @EmitEvents()
  async create(data: CreateProductInput): Promise<Product> {
    // Implementation
  }
}
```

### API Route Structure
```
packages/medusa/src/api/
├── admin/               # Admin API routes
│   └── products/
│       ├── route.ts     # Route handlers
│       ├── middlewares.ts
│       ├── validators.ts
│       └── query-config.ts
└── store/               # Store API routes
```

### Workflow System
Complex operations use the workflow pattern:
```typescript
const createProductWorkflow = createWorkflow(
  "create-product",
  function (input: WorkflowInput) {
    const product = createProductStep(input)
    const prices = when(input.prices, (prices) => {
      return createPricesStep(prices)
    })
    return new WorkflowResponse({ product, prices })
  }
)
```

### Database Patterns
- Uses MikroORM with PostgreSQL
- Entities use decorators from `@medusajs/framework/utils`
- Soft deletes with `@DeleteDateColumn()`
- Repository pattern extending `mikro-orm-base-repository-factory`

### Event System
```typescript
// Emit events
@EmitEvents()
async updateProduct(id: string, data: UpdateData) {
  // Method implementation
  // Events are automatically emitted
}

// Subscribe to events
class ProductSubscriber {
  async handleProductCreated(event: { data: Product }) {
    // Handle event
  }
}
```

## Code Style Guidelines

### TypeScript
- Strict mode enabled
- Always handle errors appropriately
- Use proper types, avoid `any`
- Follow existing patterns in the codebase

### ESLint & Prettier Rules
- No semicolons
- Double quotes for strings
- 2-space indentation
- Trailing commas in multiline structures
- Max line length: 80 characters (exceptions for URLs, long strings)
- Always use parentheses around arrow function parameters

### Import Organization
1. External dependencies
2. Framework imports (`@medusajs/*`)
3. Internal imports (relative paths)

## Development Workflow

### Branch Naming
- `fix/` - Bug fixes
- `feat/` - New features  
- `docs/` - Documentation changes

### Pull Requests
- Base branch: `develop` (for v2.0) or `v1.x` (for v1.x)
- All PRs are squashed and merged
- Include changeset if changing functionality
- Add tests for new features

### Testing Requirements
- Unit tests in `__tests__` directories
- Integration tests in `integration-tests/*`
- Test both happy path and edge cases

## Key Directories

- `/packages/medusa` - Core Medusa package (v1.x)
- `/packages/core` - Core v2 utilities and frameworks
- `/packages/modules/*` - Individual commerce modules
- `/packages/admin/*` - Admin dashboard
- `/packages/framework/*` - Framework packages
- `/packages/cli/*` - CLI tools
- `/integration-tests/*` - Integration test suites
- `/www/*` - Documentation sites

## Module Development

When creating a new module:
1. Follow the established module structure
2. Implement the module definition interface
3. Create models with proper decorators
4. Implement services extending MedusaService
5. Add proper TypeScript types
6. Include migrations if adding database tables
7. Write comprehensive tests

## API Development

When adding new API routes:
1. Create route handler in appropriate directory
2. Add validators using class-validator
3. Define query configuration for data fetching
4. Implement proper error handling
5. Add middleware if needed
6. Write API integration tests

## Debugging Tips

1. Use the debugger-mcp for Node.js debugging
2. Check module logs in development mode
3. Verify database migrations are run
4. Use workflows for complex multi-step operations
5. Leverage the event system for decoupled communication

## Important Notes

- This is a monorepo using Yarn workspaces and Turbo
- Always run `tsc --noEmit` after changes to check types
- Run `yarn lint --fix` after fixing type errors
- Never commit without running tests
- Follow existing patterns - consistency is key
- Use transactions for data integrity
- Leverage the modular architecture for scalability

## Vennyx Release Workflow

### Important Notes
- **ONLY** work with `.github/workflows/vennyx-release-v2.12.0.yml`
- **DO NOT** use `vennyx-release-v2.11.3.yml` as reference - it does NOT work
- Focus exclusively on the 2.12.0 workflow for all publishing tasks

### Workflow Architecture
The vennyx-release-v2.12.0.yml workflow:
1. Builds all packages first (before any renaming)
2. Updates package.json files to rename @medusajs/* to @vennyx-org/*
3. Updates yarn lockfile to reflect new package names
4. Publishes packages in parallel (8 workers) to GitHub Packages

### Known Issues and Solutions
- **Private packages**: Skip renaming dependencies that reference private packages (@medusajs/toolbox, @medusajs/oas-github-ci)
- **Version mismatch**: Some packages like @medusajs/ui have different versions (4.0.28 vs 2.12.0) - use VERSION_MAP to get actual versions
- **Workspace protocol**: integration-tests/ uses workspace:^ protocol which breaks after renaming - update ALL workspace package.json files

### Local Testing with Act

**CRITICAL RULE: Workflow changes MUST be tested with `act` before pushing. Workflows that fail in `act` should NOT be pushed to GitHub.**

```bash
# IMPORTANT: Use full Linux image and correct architecture
act push \
  -W .github/workflows/vennyx-release-v2.12.0.yml \
  --secret GITHUB_TOKEN=<YOUR_PERSONAL_ACCESS_TOKEN> \
  -P ubuntu-latest=catthehacker/ubuntu:full-latest \
  --container-architecture linux/amd64
```

**Requirements:**
- Personal Access Token (PAT) with `write:packages` scope - NOT the default GITHUB_TOKEN
- Full Linux image (`catthehacker/ubuntu:full-latest`) - default act images are too minimal
- Container architecture must be `linux/amd64` on Apple Silicon Macs

**Getting a PAT:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `write:packages` scope
3. Use this token in the `--secret GITHUB_TOKEN=` parameter

**Workflow Development Process:**
1. Make changes to the workflow file
2. Test with `act` locally
3. If `act` fails, fix the issue and test again
4. Only push to GitHub after `act` test passes

**IMPORTANT: Act Test Monitoring Rule:**
- Act tests take a long time (10-20 minutes) due to yarn install and yarn build
- **DO NOT** check act output repeatedly - this fills up the context window
- Wait **at least 15 minutes** before checking act test results
- Start the test, note the time, then wait before checking output
- Use `BashOutput` tool only ONCE after 15 minutes have passed