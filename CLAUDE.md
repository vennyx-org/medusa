@AGENTS.md

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
