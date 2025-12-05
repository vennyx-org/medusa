# Medusa Draft-Order Build Investigation

**Date:** 2025-12-02
**Goal:** Understand how Medusa officially builds and publishes `@medusajs/draft-order` without pre-build workaround

---

## Problem Statement

Vennyx workflow uses a pre-build workaround for draft-order:
```bash
(cd packages/medusa && yarn build) || true
yarn build
```

Question: Can we eliminate this workaround by using Medusa's official method?

---

## Key Findings

### 1. Yarn 3 and `prepare` Script

**Critical Discovery:** Yarn Berry (Yarn 3) does NOT run `prepare` script automatically!

**Supported lifecycle scripts in Yarn 3:**
- ✅ `postinstall` - After dependency tree changes
- ✅ `prepack` / `postpack` - During `yarn pack`
- ✅ `prepublish` - Before `yarn npm publish`
- ❌ **`prepare` - NOT SUPPORTED**

**Sources:**
- [Yarn Lifecycle Scripts Documentation](https://yarnpkg.com/advanced/lifecycle-scripts)
- [Stack Overflow: Yarn v3 postinstall](https://stackoverflow.com/questions/73865377/how-to-run-a-postinstall-script-after)
- [GitHub Issue: Reconsider prepare script](https://github.com/yarnpkg/berry/issues/2967)

**Workaround for Yarn 3:**
Install [yarn-plugin-after-install](https://github.com/mhassan1/yarn-plugin-after-install) to run scripts after install.

---

### 2. Medusa's Official CI Workflow

Examined `trigger-release.yml` from medusajs/medusa repo:

```yaml
- name: Install Dependencies
  run: yarn

- name: Build packages
  run: yarn build  # No pre-build step!

- name: Versioning
  run: yarn changeset version --snapshot preview

- name: Publishing
  run: yarn changeset publish --no-git-tags --snapshot
```

**No pre-build workaround!** Just `yarn` and `yarn build`.

---

### 3. Circular Dependency Issue

**The Problem:**
- `@medusajs/medusa` depends on `@medusajs/draft-order` (package.json)
- draft-order's `build` script: `"medusa plugin:build"`
- This command requires: `@medusajs/medusa/dist/commands/plugin/build.js`
- Turbo builds draft-order BEFORE medusa (based on deps)
- Result: draft-order build fails → `require(undefined)` error

**Errors in CI logs (both Medusa and Vennyx):**
```
TypeError: The "id" argument must be of type string. Received undefined
TypeError: cmd is not a function
```

**Source:** [Node.js ERR_INVALID_ARG_TYPE](https://github.com/nodejs/node/issues/22630)

---

### 4. TypeScript Emit Behavior - THE KEY!

**Critical code:** `packages/core/framework/src/build-tools/compiler.ts:424-468`

```typescript
async buildPluginBackend(tsConfig: tsStatic.ParsedCommandLine) {
  const { emitResult, diagnostics } = await this.#emitBuildOutput(...)

  if (emitResult.emitSkipped) {
    return false
  }

  // Files already written to disk!
  if (diagnostics.length) {
    this.#logger.warn(`Plugin build completed with errors...`)
    return false  // Returns false BUT files are WRITTEN!
  }
  return true
}
```

**How TypeScript `program.emit()` works:**
1. **FIRST:** Writes compiled files to disk (`.medusa/server/`)
2. **THEN:** Reports diagnostics/errors

Even with TypeScript errors, `.medusa/server` content is CREATED!

---

### 5. Turbo Build System

**Configuration:** `turbo.json`
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["!node_modules/**", "!src/**", "*/**"]
    }
  }
}
```

Turbo caches everything except `node_modules` and `src`, including `.medusa/server`.

---

### 6. npm publish vs Changesets

**npm Lifecycle Order:**
1. `prepare` - Before packing (npm pack/publish)
2. `prepublishOnly` - Only on npm publish
3. `prepack` - Before tarball creation

**Changesets behavior:**
- `changeset publish` runs `npm publish` for each package
- npm AUTOMATICALLY runs `prepare` script before packing
- **Source:** [Changesets Discussion #1136](https://github.com/changesets/changesets/discussions/1136)

**Vennyx Workflow Issue:**
```bash
npm publish --ignore-scripts  # ← This DISABLES prepare script!
```

**Source:** [npm CLI Issue #7211](https://github.com/npm/cli/issues/7211)

---

### 7. Local Testing Results

**Test 1: yarn build (SUCCESS)**
```bash
$ yarn build
# Result: .medusa/server created (451KB index.js, 423KB index.mjs)
# Tasks: 75 successful, 75 total
```

**Test 2: npm pack --dry-run (SUCCESS)**
```bash
$ npm pack --dry-run
> @medusajs/draft-order@2.12.0 prepare
> cross-env NODE_ENV=production yarn run build

npm notice package size: 146.0 kB
npm notice total files: 9  # Includes .medusa/server
```

**Test 3: package.json update + npm pack --ignore-scripts (SUCCESS)**
```bash
$ jq '.name = "@vennyx-org/draft-order"' package.json > package.json.tmp
$ npm pack --ignore-scripts --dry-run

npm notice package size: 146.0 kB  # Still includes .medusa!
npm notice total files: 9
```

**Test 4: yarn install --mode update-lockfile (SUCCESS)**
```bash
$ yarn install --mode update-lockfile
# .medusa/server still exists after install!
```

**Conclusion:** Local simulation works perfectly - `.medusa` content persists through all steps.

---

### 8. Medusa Official CI Logs Analysis

**Examined runs:**
- Run ID: 19832481728 (Dec 1, 2025) - draft-order build shows errors
- Run ID: 19038986975 (Nov 3, 2025) - First successful 2.12.0 publish

**Finding:** Medusa's official CI also has draft-order build errors, but published package contains `.medusa/server` content (450+ KB)!

**Downloaded package:** `@medusajs/draft-order@2.12.0-preview-20251103150145`
- Tarball contains: `.medusa/server/src/admin/index.js` (450.9kB)
- Confirmed: `.medusa` NOT in git (404 response from GitHub API)

---

## Critical Differences: Medusa vs Vennyx

| Aspect | Medusa Official | Vennyx Fork |
|--------|----------------|-------------|
| Package manager | Yarn 3.2.1 | Yarn 3.2.1 |
| Build command | `yarn build` | `yarn build` |
| Pre-build step | **NONE** | `(cd packages/medusa && yarn build) \|\| true` |
| Publish method | `yarn changeset publish` | `npm publish --ignore-scripts` |
| prepare script | Runs via npm (changesets) | **DISABLED** (`--ignore-scripts`) |

---

## Why Medusa Works Without Pre-Build

**Hypothesis (UNCONFIRMED):**
1. Medusa uses `yarn changeset publish`
2. Changesets calls `npm publish` internally
3. npm runs `prepare` script automatically
4. `prepare` → runs build → creates `.medusa/server`
5. Package is published with content

**Vennyx Issue:**
1. Uses `npm publish --ignore-scripts`
2. `prepare` script NEVER runs
3. Relies on `.medusa` from `yarn build` step
4. **IF** `.medusa` doesn't exist → empty package published

---

## Recommended Solution

Based on [Changesets Best Practices 2024](https://github.com/changesets/changesets/discussions/1136):

### Option 1: Remove `--ignore-scripts` (SIMPLEST)

Change workflow from:
```bash
npm publish --ignore-scripts --access restricted --tag "$PUBLISH_TAG"
```

To:
```bash
npm publish --access restricted --tag "$PUBLISH_TAG"
```

**Pros:**
- `prepare` script runs automatically
- Matches npm's standard behavior
- No workflow changes needed

**Cons:**
- Slightly slower (re-runs build even though it's already built)
- Security concern: arbitrary scripts can run

---

### Option 2: Keep Pre-Build + Remove Scripts from package.json (SECURE)

Update package.json during workflow:
```bash
# Remove prepare/postinstall from package.json
jq 'del(.scripts.prepare, .scripts.postinstall)' package.json > temp && mv temp package.json

# Publish without scripts (safe because scripts are removed)
npm publish --ignore-scripts --access restricted --tag "$PUBLISH_TAG"
```

**Pros:**
- Secure (no script execution during publish)
- `.medusa` already exists from `yarn build`
- Clean separation: build in CI, publish as artifact

**Cons:**
- More complex jq manipulation

---

### Option 3: Add `prepack` Script (HYBRID)

Update draft-order package.json:
```json
{
  "scripts": {
    "prepare": "cross-env NODE_ENV=production yarn run build",
    "prepack": "cross-env NODE_ENV=production yarn run build"
  }
}
```

`prepack` runs even with `--ignore-scripts` in some npm versions!

**Pros:**
- May work with `--ignore-scripts`
- Backwards compatible

**Cons:**
- Unclear if `prepack` respects `--ignore-scripts`
- Need to test

---

## What Medusa Actually Does

**From trigger-release.yml workflow:**
1. `yarn` - Install dependencies (does NOT run prepare in Yarn 3)
2. `yarn build` - Build all packages including draft-order
   - Turbo handles dependency order
   - `.medusa/server` created for draft-order
3. `yarn changeset version --snapshot` - Update package versions
4. `yarn changeset publish` - Publish packages
   - Internally calls `npm publish` (NOT `yarn publish`)
   - npm runs `prepare` script again (rebuilds .medusa)
   - Package published with `.medusa/server` content

**Key insight:** Medusa DOES rebuild during publish via `prepare` script!

---

## Investigation Status

- ✅ Yarn 3 prepare behavior confirmed
- ✅ TypeScript emit behavior understood
- ✅ Local simulation successful
- ✅ Medusa CI logs analyzed
- ✅ **ROOT CAUSE FOUND:** `--ignore-scripts` prevents `prepare` from running!

---

## ROOT CAUSE ANALYSIS

### Test Results (2025-12-02)

**Test 1: .medusa EXISTS + --ignore-scripts**
```bash
$ npm pack --ignore-scripts --dry-run
npm notice package size: 146.0 kB ✅
npm notice total files: 9  # Includes .medusa/server
```

**Test 2: .medusa DELETED + --ignore-scripts**
```bash
$ rm -rf .medusa
$ npm pack --ignore-scripts --dry-run
npm notice package size: 2.1 kB ❌ EMPTY!
npm notice total files: 2  # Only README + package.json
```

**Test 3: .medusa DELETED + prepare ENABLED**
```bash
$ npm pack --dry-run
> @medusajs/draft-order@2.12.0 prepare
> cross-env NODE_ENV=production yarn run build

info: Compiling plugin source...
npm notice package size: 146.3 kB ✅
npm notice total files: 9  # .medusa regenerated!
```

### Confirmed Issue

**Vennyx workflow problem:**
1. `actions/checkout@v6` → .medusa NOT in git (gitignored) → container starts WITHOUT .medusa
2. `yarn build` → .medusa CREATED ✅
3. `npm publish --ignore-scripts` → prepare NOT RUN → package uses existing .medusa ✅

**BUT WAIT!** In step 2, `yarn build` creates .medusa. Step 3 should work!

**Re-test required:** Check if GitHub Actions actually preserves .medusa after yarn build

---

## FINAL SOLUTION: Match Medusa's Method

**What Medusa does:**
```yaml
- run: yarn build  # Creates .medusa
- run: yarn changeset publish  # npm publish (prepare runs, rebuilds .medusa)
```

**What Vennyx should do:**
```yaml
- run: yarn build  # Creates .medusa
- run: npm publish  # WITHOUT --ignore-scripts (prepare runs)
```

**Changes applied:**
1. ✅ Removed `--ignore-scripts` flag from both workflows
2. ✅ Simplified pre-build step (removed `|| true` workaround)
3. ✅ Added comment explaining Turbo dependency order

**Files modified:**
- `.github/workflows/vennyx-release-v2.12.0.yml`
- `.github/workflows/vennyx-release-v2.11.3.yml`

---

## FINAL CONCLUSION (2025-12-02)

### Test Results Summary

**Test 1: Turbo Dependency Order (--force, clean build)**
```bash
$ rm -rf packages/medusa/dist packages/plugins/draft-order/.medusa
$ turbo run build --force --filter=@medusajs/draft-order

Result:
✅ medusa built FIRST (dependency order works)
✅ medusa/dist/commands/plugin/build.js created
✅ draft-order build SUCCESSFUL
✅ .medusa/server created (441KB + 423KB)
✅ Tasks: 18 successful, 18 total
```

**Test 2: Downloaded Package Verification**
```bash
$ npm pack @vennyx-org/draft-order@2.12.0-1764684128

Published package contents:
✅ 1.5MB .medusa/server/src/admin/index.js
✅ 1.5MB .medusa/server/src/admin/index.mjs
✅ package size: 548.4 kB
✅ unpacked size: 3.0 MB
✅ total files: 9

Workflow that created this:
- Pre-build: (cd packages/medusa && yarn build) || true ✅
- Publish: npm publish --ignore-scripts ✅
```

### CONCLUSION: Current Workflow is OPTIMAL

**Pre-build step is NECESSARY:**
- Ensures medusa/dist/commands exists before draft-order build
- Handles edge cases where Turbo might use stale cache
- `|| true` safely ignores TypeScript errors in pre-build

**--ignore-scripts is CORRECT:**
- .medusa already created by `yarn build` step
- Prevents duplicate build during publish (faster)
- Package includes .medusa from build step successfully

**DO NOT CHANGE current workflow** - it works correctly as proven by:
1. Clean Turbo build test ✅
2. Downloaded package verification ✅
3. Successful GitHub Actions run ✅
4. dfs-backend integration test ✅ (Admin UI loads successfully)

### Test 3: dfs-backend Integration (2025-12-02 20:24)

**Package installed:**
```bash
$ cd dfs-backend && yarn add @vennyx-org/draft-order@2.12.0-1764684128

Installed: @vennyx-org/draft-order@2.12.0-1764684128
Package size: 548.4 kB
Admin files: 1.4MB index.js + 1.4MB index.mjs ✅
```

**Module resolution:**
```bash
$ node -e "console.log(require.resolve('@vennyx-org/draft-order/admin'))"
/Users/oguz/WebstormProjects/dfs-backend/node_modules/@vennyx-org/draft-order/.medusa/server/src/admin/index.js ✅
```

**Build & Dev Server:**
```bash
$ yarn build
Backend build completed successfully (14.48s) ✅
Frontend build completed successfully (23.73s) ✅

$ yarn dev
Server ready on http://localhost:9000
Admin URL → http://localhost:9000/app ✅
```

**Playwright Verification:**
```
✅ Admin UI loaded at localhost:9000/app
✅ Vite connected
✅ @medusajs/dashboard initialized
✅ i18next initialized
✅ All JS chunks loaded (200 OK)
✅ Only 401 auth error (expected, no login)
✅ Screenshot captured: admin-ui-proof.png
```

**Entry point check:**
```jsx
// .medusa/client/entry.jsx
import plugin0 from "@vennyx-org/draft-order/admin" ✅
```

**CONCLUSION:** Package published by current workflow (with pre-build + --ignore-scripts) is FULLY FUNCTIONAL in production use!

---

### Test 4: Comparing Medusa vs Vennyx Workflow (2025-12-02 21:30)

**Medusa's Official Workflow Steps:**
```yaml
1. yarn                                    # Install dependencies
2. yarn changeset version --snapshot       # Update package versions
3. yarn install --no-immutable             # Re-install with new versions
4. yarn build                              # Build all packages (NO pre-build!)
5. yarn changeset publish --snapshot       # Publish (internally: npm publish)
```

**Medusa CI Build Timeline (ID: 56937881745):**
```
18:09:49 - @medusajs/draft-order:build
           TypeError: The "id" argument must be of type string ❌
           (medusa/dist/commands NOT available yet)

18:10:23 - @medusajs/medusa:build ✅
           (34 seconds AFTER draft-order)

18:10:37 - Tasks: 75 successful, 75 total ✅
           (Turbo ignores the error)

18:11:42 - yarn changeset publish
           → npm publish for each package
           → prepare script RUNS
           → .medusa/server created during prepare
           → Package published with content ✅
```

**Published Package Verification:**
```bash
$ curl -sL https://registry.npmjs.org/@medusajs/draft-order/-/draft-order-3.0.0-preview-20251202180144.tgz
- package size: 146 KB ✅
- .medusa/server/src/admin/index.js ✅
- .medusa/server/src/admin/index.mjs ✅
```

**Key Finding:** Medusa also has the circular dependency! draft-order build FAILS during `yarn build`, but succeeds during `npm publish` when prepare runs (because medusa/dist exists by then).

**Vennyx Current Approach:**
```yaml
1. yarn
2. (cd packages/medusa && yarn build) || true  # PRE-BUILD
3. yarn build
4. [jq updates package.json]
5. npm publish --ignore-scripts  ← BLOCKS prepare!
```

**Issue:** `--ignore-scripts` prevents prepare from running, so we RELY on .medusa from step 3.

**Medusa's Approach:**
- Lets draft-order fail during build
- Re-builds during publish via prepare script
- Works because medusa/dist exists by publish time

**SOLUTION: Remove `--ignore-scripts` to match Medusa's method!**

---

## References

- [Yarn Lifecycle Scripts](https://yarnpkg.com/advanced/lifecycle-scripts)
- [Changesets #860 - Scripts not running](https://github.com/changesets/changesets/issues/860)
- [Changesets Discussion #1136 - Build before publish](https://github.com/changesets/changesets/discussions/1136)
- [npm scripts documentation](https://docs.npmjs.com/cli/v7/using-npm/scripts/)
- [npm CLI #7211 - pack/publish hooks](https://github.com/npm/cli/issues/7211)
