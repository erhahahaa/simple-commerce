# Maintaining Documentation

Guidelines for long-term documentation maintenance and quality assurance.

## Overview

Documentation requires ongoing care to remain accurate and useful. This guide covers processes for keeping documentation healthy over time.

## Regular Maintenance Tasks

### Weekly Tasks

- [ ] Review and merge documentation PRs
- [ ] Check for broken links
- [ ] Review user feedback/questions about docs
- [ ] Update changelog with recent changes

### Monthly Tasks

- [ ] Full link audit across all docs
- [ ] Review and update outdated content
- [ ] Check consistency across related documents
- [ ] Verify code examples still work
- [ ] Update [Changelog](../changelog.md)

### Quarterly Tasks

- [ ] Comprehensive documentation review
- [ ] User feedback analysis
- [ ] Documentation structure evaluation
- [ ] Archive or remove obsolete content
- [ ] Update navigation if needed

## Documentation Lifecycle

### 1. Creation

When a feature is added:

1. Create documentation alongside code
2. Follow [Documentation Standards](./03-documentation-standards.md)
3. Add to appropriate section
4. Update navigation.json
5. Cross-reference related docs

### 2. Maintenance

As features evolve:

1. Update relevant documentation
2. Check cross-references
3. Update code examples
4. Update [Changelog](../changelog.md)

### 3. Deprecation

When features are deprecated:

1. Mark as deprecated in documentation
2. Add deprecation notice
3. Suggest alternatives
4. Schedule for removal

Example:
```markdown
# Old Feature Name

> ⚠️ **Deprecated**: This feature is deprecated as of v2.0. 
> Use [New Feature](../section/new-feature.md) instead.
```

### 4. Removal

When features are removed:

1. Move document to archive/ or delete
2. Update all links pointing to it
3. Add redirect or removal notice
4. Update navigation.json

## Quality Assurance

### Automated Checks

Implement these checks in CI/CD:

```bash
#!/bin/bash
# docs-check.sh

echo "Checking documentation..."

# Check for broken links
echo "Checking links..."
# Add link checker command here

# Check for TODO/FIXME markers
echo "Checking for TODO markers..."
grep -r "TODO\|FIXME\|XXX" docs/ || true

# Check for outdated dates
echo "Checking last updated dates..."
# Add date checker if using frontmatter

echo "Documentation check complete!"
```

### Manual Review Process

**Quarterly Documentation Review:**

1. **Create review checklist** for each section
2. **Assign reviewers** to each section
3. **Review content** for accuracy
4. **Test all examples**
5. **Check all links**
6. **Update outdated information**
7. **Submit changes** via PR

### Review Checklist Template

```markdown
## Section Review: [Section Name]

Date: [YYYY-MM-DD]
Reviewer: [Name]

### Files Reviewed
- [ ] file-01.md
- [ ] file-02.md
- [ ] file-03.md

### Checks Performed
- [ ] Content is accurate
- [ ] Code examples work
- [ ] Links are valid
- [ ] Formatting is correct
- [ ] Cross-references updated
- [ ] No outdated information

### Issues Found
- Issue 1: [Description]
- Issue 2: [Description]

### Actions Taken
- Fixed broken link in file-01.md
- Updated code example in file-02.md
- etc.
```

## Handling Feedback

### User Feedback Channels

1. **GitHub Issues** - Documentation issues labeled `docs`
2. **Pull Requests** - Documentation improvements
3. **Team Chat** - Informal feedback
4. **Analytics** - If using documentation site

### Processing Feedback

1. **Triage** - Categorize as bug, improvement, or question
2. **Prioritize** - Urgent fixes vs. nice-to-have
3. **Assign** - To appropriate team member
4. **Implement** - Make changes
5. **Notify** - Update reporter if applicable

### Common Feedback Types

| Type | Action | Priority |
|------|--------|----------|
| Broken link | Fix immediately | High |
| Unclear explanation | Rewrite section | Medium |
| Missing information | Add content | Medium |
| Outdated example | Update code | High |
| Typo | Fix quickly | Low |
| Feature request | Evaluate and schedule | Low |

## Versioning Documentation

### When to Version

Version documentation when:
- Major project versions are released
- Breaking changes occur
- Long-term support versions exist

### Versioning Strategy

**Option 1: Folder-based**
```
docs/
├── v1/
│   └── ...
├── v2/
│   └── ...
└── current/ -> symlink to latest
```

**Option 2: Tag-based** (Git tags)
- Maintain single documentation
- Use tags for historical versions
- Users check out specific tag for old docs

### Version Indicators

Add version badges to documents:

```markdown
---
version: "2.0"
applicable: ["2.0+", "1.x (with modifications)"]
---

# Document Title

![Version](https://img.shields.io/badge/version-2.0-blue)
```

## Archiving Content

### When to Archive

- Feature is deprecated
- Content is outdated but historically relevant
- Major reorganization

### Archive Process

1. **Create archive directory:**
   ```
   docs/archive/
   └── 2026-01-old-section/
   ```

2. **Move files:**
   ```bash
   mv docs/05-old-feature/ docs/archive/2026-01-old-feature/
   ```

3. **Update navigation:**
   - Remove from main navigation
   - Add to archive index

4. **Add redirects/notices:**
   ```markdown
   # Old Feature
   
   > This documentation has been archived. 
   > See [New Feature](../current/new-feature.md) for current information.
   ```

## Metrics and Analytics

### Track These Metrics

- **Page views** (if using doc site)
- **Time on page**
- **Search queries** - What users are looking for
- **Common questions** - FAQ candidates
- **Error reports** - Broken links, unclear sections

### Using Metrics

1. **Identify gaps** - High search volume = missing content
2. **Prioritize updates** - Most viewed pages need most care
3. **Improve UX** - Low time on page = might be confusing
4. **Create FAQs** - Common questions become FAQ entries

## Documentation Team

### Roles and Responsibilities

**Documentation Lead:**
- Overall documentation strategy
- Review major changes
- Coordinate quarterly reviews

**Section Owners:**
- Own specific sections (API, Database, etc.)
- Keep content up to date
- Review related changes

**Contributors:**
- Submit improvements
- Fix typos and small issues
- Update code examples

### Communication

- **Documentation channel** in team chat
- **Weekly standup** discussion points
- **Quarterly review** meetings
- **Annual documentation** strategy review

## Emergency Procedures

### Critical Documentation Bug

1. **Immediate fix** - Don't wait for PR process
2. **Communicate** - Notify team in chat
3. **Follow up** - Create PR for proper review
4. **Document** - Add to changelog

### Major Restructuring

1. **Plan** - Create proposal document
2. **Review** - Get team approval
3. **Branch** - Work in feature branch
4. **Test** - Verify all links work
5. **Migrate** - Gradual transition if possible
6. **Announce** - Notify team of changes
7. **Monitor** - Watch for issues

## Best Practices

### Keep It Simple

- Don't over-engineer documentation
- Start simple, add complexity only when needed
- Regular docs > perfect docs that never get written

### Stay Current

- Update docs with code changes
- Schedule regular review time
- Make documentation updates part of Definition of Done

### Encourage Contributions

- Make contributing easy
- Recognize contributors
- Respond quickly to PRs
- Thank people for feedback

### Use Tools Wisely

- Automate what you can (link checking, formatting)
- Don't let tools get in the way
- Choose tools team will actually use

## Resources

- [How to Use Docs](./01-how-to-use-docs.md)
- [Contributing to Docs](./02-contributing-to-docs.md)
- [Documentation Standards](./03-documentation-standards.md)
- [Changelog](../changelog.md)

## Questions?

- **Urgent fixes?** - Just do it, communicate after
- **Major changes?** - Discuss with Documentation Lead
- **Unclear standards?** - Check existing examples or ask
