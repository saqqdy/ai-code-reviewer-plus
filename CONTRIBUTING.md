# Contributing to AI Code Reviewer

Thanks for your interest! Here's how to get started.

## Development Setup

```bash
pnpm install          # Install dependencies
pnpm run lint         # Lint check
pnpm run typecheck    # TypeScript check
pnpm run test         # Run tests
pnpm run build        # Build (ESM + CJS)
pnpm run docs:dev     # Start docs server
```

## Making Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes with tests
4. Ensure all checks pass: `pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build`
5. Commit with conventional commits: `feat: add new rule`
6. Push and create a Pull Request

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `test:` tests
- `refactor:` code refactor
- `chore:` build/tooling

## Adding Rules

To add a new review rule:

1. Add rule definition to `src/analyzers/index.ts` RULES array
2. Add tests in `src/analyzers/index.test.ts`
3. Document in `docs/api/` and `docs/zh/api/`

## Project Structure

```
src/
  analyzers/     # Rule engine (pattern-based + AI via Skill)
  collectors/    # Git data collection (diff, project detection)
  utils/         # Formatting, configuration
  types.ts       # Core type definitions
  errors.ts      # Error classes
  cli.ts         # CLI entry
  index.ts       # API entry
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
