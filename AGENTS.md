# Startup Factory Video

This independent repository owns Remotion videos for Deploy Your Startup.

- Run commands through `mise exec -- ./make.sh <verb>`.
- `make.sh lint` checks without writing; render exports to ignored `out/`.
- Animate from `useCurrentFrame()`. Do not use wall-clock time, random values, CSS animations or network requests while rendering.
- Keep fonts and audio local under `public/`; commit source assets.
- Before changing product copy, read https://deploy-your-startup.com and https://deploy-your-startup.com/get-started and compare with website source. Unpublished designs are not public features.
- Preserve ownership positioning: code, repositories and infrastructure in users' own accounts. Do not promise deployment duration or unsupported stacks.
- Inspect representative rendered frames and play the exported video before delivery.
- Never include credentials or personal account data in visuals.

## Test coverage and completion claims

Follow [Testing policy and completion evidence](docs/testing-policy.md).
Integration tests are the default; changed user flows require E2E coverage.
Unit tests are reserved for complex algorithms and never replace these checks.
Use GIVEN / WHEN / THEN, real application interfaces and independent fixtures.
A green pipeline confirms the executed checks, not complete feature coverage.
Record uncovered flows and report skipped provider checks and remaining gaps.
Keep required E2E checks enabled when improving speed.
