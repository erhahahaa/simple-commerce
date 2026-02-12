# Contributing to Documentation

This guide explains how to contribute to the Simple Commerce documentation.

## Quick Start

1. **Find the relevant section** - Navigate to the appropriate folder
2. **Edit the file** - Make your changes following standards
3. **Update related files** - Check for cross-references
4. **Test links** - Verify all internal links work
5. **Submit changes** - Follow the project's PR process

## Documentation Standards

Before contributing, review:
- [Documentation Standards](./03-documentation-standards.md)
- This file for workflow guidelines

## When to Update Documentation

### Required Updates

Update documentation when you:
- Add a new feature
- Change existing functionality
- Modify API endpoints
- Update database schema
- Change configuration options
- Add new environment variables
- Fix a bug that affects user workflow

### Good to Update

Consider updating when you:
- Clarify existing documentation
- Add more examples
- Improve explanations
- Fix typos or formatting
- Add cross-references

## How to Make Changes

### 1. Small Changes (Typos, Minor Fixes)

```bash
# Edit directly in the relevant file
vim docs/05-api/04-product-router.md

# Commit with descriptive message
git add docs/05-api/04-product-router.md
git commit -m "docs: fix typo in product router documentation"
```

### 2. Major Changes (New Sections, Reorganization)

```bash
# Create a new branch
git checkout -b docs/update-api-docs

# Make your changes
# ... edit files ...

# Test documentation build (if applicable)
# npm run docs:build

# Commit with detailed message
git add .
git commit -m "docs: add comprehensive API authentication guide

- Add OAuth flow documentation
- Include code examples
- Update cross-references"
```

### 3. Adding New Documents

When adding a new document:

```bash
# 1. Determine the correct section
cd docs/05-api/

# 2. Choose the next number
ls -la
# If last file is 10-wishlist-router.md, create 11-new-feature-router.md

# 3. Create from template
cp ../assets/templates/doc-template.md 11-new-feature-router.md

# 4. Edit the new file
vim 11-new-feature-router.md

# 5. Update navigation.json
vim ../navigation.json

# 6. Update index/README in section
vim README.md
```

## Document Template

Use this template for new documents:

```markdown
# Document Title

One-paragraph description of what this document covers.

## Overview

Brief overview of the topic.

## Main Content Section

### Subsection 1

Detailed explanation...

**Example:**
\`\`\`typescript
// Code example here
\`\`\`

### Subsection 2

More content...

## Related Documents

- [Related Doc](../section/file.md)
- [Another Doc](../section/file2.md)

## Quick Reference

| Item | Description |
|------|-------------|
| Key | Value |
```

## Review Checklist

Before submitting documentation changes:

- [ ] Content is accurate and up-to-date
- [ ] Code examples work and are properly formatted
- [ ] All internal links are valid
- [ ] Follows [documentation standards](./03-documentation-standards.md)
- [ ] Includes related documents section
- [ ] No typos or grammatical errors
- [ ] Appropriate for target audience
- [ ] Cross-references updated (if needed)

## File Organization

### Where to Add Content

| Content Type | Location |
|--------------|----------|
| Project overview | `01-overview/` |
| Setup instructions | `02-getting-started/` |
| Architecture diagrams | `03-architecture/` |
| Database schema | `04-database/` |
| API endpoints | `05-api/` |
| Screen documentation | `06-mobile-screens/` |
| Integration guides | `07-integrations/` |
| Configuration | `08-configuration/` |
| Development workflow | `09-development/` |
| Deployment | `10-deployment/` |
| How-to guides | `11-guides/` |
| Code examples | `assets/code-snippets/` |
| Images/diagrams | `assets/images/`, `assets/diagrams/` |

### Numbering Convention

- Use two-digit numbers: `01-`, `02-`, etc.
- Leave gaps for future additions: `01`, `03`, `05` (allows inserting `02`, `04`)
- Renumber if inserting changes the logical flow

## Updating Cross-References

When moving or renaming files:

1. **Update all links to the file:**
   ```bash
   grep -r "old-file-name" docs/
   ```

2. **Update navigation.json:**
   ```json
   {
     "path": "section/new-file-name.md"
   }
   ```

3. **Update section index files**

4. **Update main README.md** (if listed)

## Commit Message Format

Use conventional commits for documentation:

```
docs: brief description of change

Optional longer explanation:
- Detail 1
- Detail 2
```

Examples:
```
docs: add Midtrans webhook setup guide

docs: update database schema for orders
- Add payment_status field
- Update order_status enum values

docs: fix broken links in API reference
```

## Review Process

1. **Self-review** - Check against the review checklist
2. **Peer review** - Have another team member review
3. **Technical review** - Ensure technical accuracy
4. **Merge** - Submit PR and merge when approved

## Questions?

- See [Documentation Standards](./03-documentation-standards.md) for formatting
- Check [Maintaining Docs](./04-maintaining-docs.md) for long-term maintenance
- Ask in team chat for unclear situations
