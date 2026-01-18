---
name: clean-project
description: Guide for cleaning up the project structure, removing unused files, and organizing documentation. Use when the user asks to "clean the project", "remove unused files", or "organize the codebase".
---

# Clean Project Skill

This skill provides a systematic approach to cleaning up the project, removing unused files, and organizing the structure.

## Workflow

### 1. Analysis & Backup

Before deleting anything, ensure the current state is committed to git.
Run `git status` to ensure the working directory is clean. If not, ask the user to commit or stash changes.

### 2. Root Directory Cleanup

The project root often accumulates documentation and temporary files.

- **Markdown Files**: Move non-essential markdown files (guides, plans, notes) to a `docs/` or `documentation/` directory. Keep only `README.md` and essential configuration files.
- **Temporary Scripts**: Look for ad-hoc scripts like `test-api.js`, `temp.js`, etc. Move them to `scripts/temp/` or delete them if no longer needed.
- **Logs**: Remove `*.log` files, error dumps, or `npm-debug.log`.

### 3. Identify & Remove Unused Files

#### Heuristics for Unused Files:
- **Orphaned Components**: Search for components in `src/components` that are never imported in the codebase.
- **Old Configs**: Check for configuration files of libraries no longer in `package.json`.
- **Empty Directories**: Remove empty directories.
- **Unused Assets**: Check `public/` or `assets/` for images/files not referenced in the code.

#### Tools (if available):
- If `knip` or `depcheck` is available, run them to find unused exports and dependencies.
- Use `ts-prune` if it is a TypeScript project.

### 4. Test File Organization

- **Unit Tests**: Ensure all `*.test.ts`, `*.spec.ts` files are located in `__tests__` directories or co-located with their source files (depending on project convention).
- **Provisional/Ad-hoc Tests**: "No test file sitting there" means removing temporary test scripts that are often created in the root or source folders for quick checks. Move them to `tests/temp` or delete them.
- **E2E Tests**: Move end-to-end tests to `e2e/` or `cypress/`.

### 5. Script Directory Organization

If `scripts/` contains many files (e.g., > 20):
- Group related scripts into subdirectories (e.g., `scripts/db/`, `scripts/deploy/`, `scripts/analysis/`, `scripts/maintenance/`).
- Update `package.json` scripts to point to the new locations.
- Ensure all scripts have execute permissions if required.

### 6. Codebase Structure Check

- **Standardization**: Ensure structure follows the framework's conventions (e.g., Next.js `src/app`, `src/components`, `src/lib`).
- **Consistency**: Check for mixed naming conventions (kebab-case vs camelCase) and unify them (ask user before renaming as it breaks imports).
- **Dead Code**: Look for commented-out blocks of code that look like historical artifacts and suggest removing them.

### 7. Deep Dead Code Detection (Special Focus)

Go beyond surface-level cleanup by systematically identifying functional dead code.

#### Categories of Dead Code:
1.  **Unused Exports**: Functions, constants, or types that are exported but never imported.
    -   *Action*: Use tools like `npx knip` (no install needed usually) to find these.
2.  **Unreferenced Components**: UI components in `src/components` not imported by any page or layout.
3.  **Commented-Out Blocks**: Large chunks of code commented out.
    -   *Action*: Delete them. Git has the history.
4.  **Zombie Utilities**: Helper files for features that no longer exist.
5.  **Unused Dependencies**: Packages in `package.json` that are not imported in the code.

#### Detection Strategy:
-   **Search**: Grep for the component name. If 0 results (other than definition), it's dead.
-   **Visual Scan**: Scroll through files to find grayed-out (unused) imports and huge comment blocks.

## Execution Procedure

When executing a cleanup:

1.  **Safety First**: Always verify `git status` is clean.
2.  **Proposal**: Create a plan listing the specific files to be moved or deleted.
3.  **Confirmation**: Ask the user for confirmation before executing bulk deletions.
4.  **Action**:
    -   Use `mv` to reorganize.
    -   Use `rm` to delete.
    -   Update references if files are moved (use IDE tools or `sed` with caution).
5.  **Verification**: Run the build (`npm run build`) and tests (`npm test`) to ensure the cleanup didn't break the application.

## Common Targets for Cleanup

- `unused_*.{js,ts,tsx}`
- `temp_*`
- `old_*`
- `*.bak`
- `*.tmp`
- `copy of *`
- `TODO.md` (consolidate into a project management tool or issue tracker if possible)
