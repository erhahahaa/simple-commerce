# Documentation Standards

Standards and guidelines for writing Simple Commerce documentation.

## Writing Principles

### 1. Clarity Over Cleverness

- Use simple, clear language
- Avoid jargon without explanation
- Write for your audience (assume intermediate level)
- When in doubt, be explicit

### 2. Consistency

- Follow established patterns
- Use same terminology throughout
- Keep formatting uniform
- Maintain consistent tone

### 3. Completeness

- Include all necessary information
- Provide examples for complex topics
- Link to related resources
- Explain the "why" not just the "what"

## Formatting Standards

### File Structure

Every document must have:

1. **Title** - H1 heading with clear, descriptive title
2. **Introduction** - 1-2 paragraph overview
3. **Main Content** - Logical sections with H2/H3 headings
4. **Related Documents** - Links to related content
5. **Quick Reference** - Summary table (if applicable)

Example:
```markdown
# Document Title

Brief overview of what this document covers and why it matters.

## Section 1

Content here...

### Subsection

More detailed content...

## Section 2

...

## Related Documents

- [Related Doc](../section/file.md)

## Quick Reference

| Item | Value |
|------|-------|
| Key | Value |
```

### Headings

- **H1 (#)** - Document title only (one per file)
- **H2 (##)** - Main sections
- **H3 (###)** - Subsections
- **H4 (####)** - Rarely used, for detailed breakdowns

```markdown
# Document Title

## Main Section

### Subsection

#### Detailed Point
```

### Code Blocks

Always specify language for syntax highlighting:

```markdown
\`\`\`typescript
const example = "code here";
\`\`\`

\`\`\`bash
npm install package
\`\`\`

\`\`\`json
{"key": "value"}
\`\`\`
```

### Lists

**Ordered lists** - For sequential steps:
```markdown
1. First step
2. Second step
3. Third step
```

**Unordered lists** - For non-sequential items:
```markdown
- Feature A
- Feature B
- Feature C
```

### Tables

Use tables for structured data:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

### Links

**Internal links** (relative paths):
```markdown
[Database Setup](../02-getting-started/04-database-setup.md)
[API Overview](../05-api/01-overview.md)
```

**External links**:
```markdown
[Expo Documentation](https://docs.expo.dev)
[Midtrans](https://midtrans.com)
```

## Writing Style

### Voice and Tone

- **Professional but approachable** - Not too casual, not too formal
- **Direct** - "Click the button" not "You should click the button"
- **Active voice** - "The system validates" not "Validation is performed"
- **Present tense** - "The API returns" not "The API will return"

### Terminology

Be consistent with these terms:

| Use | Don't Use |
|-----|-----------|
| mobile app | mobile application / app |
| backend | back-end / back end |
| frontend | front-end / front end |
| API endpoint | API route / endpoint |
| database | DB / data store |
| user | end user / customer |
| configuration | config (unless code) |
| environment variable | env var / env variable |

### Code Terminology

Use exact names from the codebase:

- `publicProcedure` (not "public procedure")
- `protectedProcedure` (not "protected procedure")
- `appRouter` (not "app router")
- `EXPO_PUBLIC_API_URL` (not "API URL")

### Examples

Always include practical examples:

**Bad:**
```markdown
Use the create method to make a new order.
```

**Good:**
```markdown
Use the `create` method to create a new order:

\`\`\`typescript
const order = await api.order.create.mutate({
  addressId: "addr-123",
  shippingData: {
    courier: "jne",
    service: "REG",
    cost: 15000
  }
});
\`\`\`
```

## Document Types

### 1. Overview Documents

Purpose: High-level introduction

Structure:
- What is it?
- Why does it exist?
- Key concepts
- Relationship to other components

### 2. Tutorial/Guide Documents

Purpose: Step-by-step instructions

Structure:
- Prerequisites
- Step-by-step instructions
- Verification steps
- Common issues

### 3. Reference Documents

Purpose: Detailed technical information

Structure:
- Overview
- Complete specification
- Parameters/options
- Examples
- Edge cases

### 4. API Documents

Purpose: API endpoint documentation

Structure:
- Endpoint description
- Authentication required?
- Request parameters
- Response format
- Example request/response
- Error codes

## File Naming

### Convention

```
NN-descriptive-name.md
```

- `NN` - Two-digit number (01, 02, etc.)
- `descriptive-name` - Kebab-case description
- `.md` - Markdown extension

Examples:
```
01-introduction.md
03-tech-stack.md
04-product-router.md
07-shipping-calculation.md
```

### Images

```
descriptive-name.png/jpg/svg
```

Examples:
```
architecture-diagram.png
checkout-flow.svg
```

### Code Snippets

```
descriptive-name.language
```

Examples:
```
order-create.ts
payment-flow.ts
shipping-calculation.ts
```

## Linking Standards

### Internal Links

Always use relative paths:

```markdown
<!-- Good -->
[Database Setup](../02-getting-started/04-database-setup.md)

<!-- Bad -->
[Database Setup](/docs/02-getting-started/04-database-setup.md)
```

### Cross-References

When referencing another document:

```markdown
For database configuration, see [Database Setup](../02-getting-started/04-database-setup.md).
```

When referencing a section in the same document:

```markdown
See the [Configuration](#configuration) section below.
```

### External Links

Use descriptive link text:

```markdown
<!-- Good -->
Learn more about [Expo Router](https://docs.expo.dev/router/introduction/).

<!-- Bad -->
Learn more [here](https://docs.expo.dev/router/introduction/).
```

## Meta Information

### Document Header (Optional)

For complex documents, include metadata at the top:

```markdown
---
title: "API Authentication"
description: "How authentication works in the Simple Commerce API"
lastUpdated: "2026-01-15"
audience: ["backend-developers", "mobile-developers"]
---

# API Authentication
```

### Status Indicators

Use badges for document status:

```markdown
# Feature Name

![Status: Complete](https://img.shields.io/badge/status-complete-brightgreen)
![Version: 1.0](https://img.shields.io/badge/version-1.0-blue)
```

## Review Checklist

Before submitting documentation:

- [ ] Follows file structure template
- [ ] Uses correct heading hierarchy
- [ ] Code blocks have language specified
- [ ] All links are valid (test them!)
- [ ] Tables are properly formatted
- [ ] Consistent terminology used
- [ ] Examples are practical and correct
- [ ] Related documents section included
- [ ] No spelling or grammar errors
- [ ] Appropriate for target audience
- [ ] Follows naming conventions
- [ ] Images have alt text (if applicable)

## Common Mistakes to Avoid

1. **Broken Links** - Always test internal links
2. **Missing Code Language** - Always specify language in code blocks
3. **Inconsistent Formatting** - Follow templates exactly
4. **Too Much Text** - Use tables, lists, and examples to break up text
5. **Assuming Knowledge** - Define terms, link to concepts
6. **Outdated Content** - Keep docs in sync with code
7. **Missing Examples** - Always include practical examples
8. **Poor Organization** - Use logical heading structure

## Tools and Resources

### Recommended Tools

- **Editor**: VS Code with Markdown extensions
- **Preview**: VS Code Markdown Preview or similar
- **Link Checker**: Use grep to find broken links
- **Grammar**: Grammarly or similar

### Useful Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Markdown](https://docs.github.com/en/get-started/writing-on-github)
- [Technical Writing Guide](https://www.writethedocs.org/guide/)

## Questions?

Refer to:
- [How to Use Docs](./01-how-to-use-docs.md) for navigation
- [Contributing to Docs](./02-contributing-to-docs.md) for workflow
- [Maintaining Docs](./04-maintaining-docs.md) for long-term care
