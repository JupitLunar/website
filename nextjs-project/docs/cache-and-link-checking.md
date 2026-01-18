# Cache Management & Link Checking Guide

## Overview

This document describes the cache management system and automated link checking setup for the MomAI Agent website.

---

## 🔄 Cache Management

### Manual Cache Purge API

**Endpoint**: `/api/cache/purge`  
**Method**: `POST`  
**Authentication**: Requires `REVALIDATION_SECRET` environment variable

### Usage Examples

#### Purge a single page
```bash
curl -X POST "https://www.momaiagent.com/api/cache/purge?secret=YOUR_SECRET&path=/foods/salmon"
```

#### Purge multiple pages
```bash
curl -X POST "https://www.momaiagent.com/api/cache/purge?secret=YOUR_SECRET&paths=/foods/egg,/foods/salmon,/foods/carrot"
```

#### Purge by tag
```bash
# Purge all insight articles
curl -X POST "https://www.momaiagent.com/api/cache/purge?secret=YOUR_SECRET&tag=insights"

# Purge all food pages
curl -X POST "https://www.momaiagent.com/api/cache/purge?secret=YOUR_SECRET&tag=foods"
```

#### Purge multiple tags
```bash
curl -X POST "https://www.momaiagent.com/api/cache/purge?secret=YOUR_SECRET&tags=foods,insights,topics"
```

### Available Cache Tags

- `insights` - All insight article pages
- `foods` - All food database pages
- `topics` - All topic pages

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Cache purged successfully",
  "purged": {
    "paths": ["/foods/salmon", "/foods/egg"],
    "tags": ["insights"],
    "timestamp": "2026-01-18T23:53:55.254Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid secret"
}
```

### When to Purge Cache

1. **After Database Updates**: When you update source URLs in `kb_sources`
2. **Content Changes**: After modifying article or food content
3. **Bug Fixes**: After fixing broken links or other content issues
4. **Deployment**: After deploying changes that affect cached pages

### Security

- The `REVALIDATION_SECRET` must be kept secure
- Never commit the secret to version control
- Use environment variables in production
- Rotate the secret periodically

---

## 🔍 Automated Link Checking

### GitHub Actions Workflow

**File**: `.github/workflows/link-check.yml`  
**Schedule**: Every Monday at 9 AM UTC  
**Manual Trigger**: Available via GitHub Actions UI

### What It Does

1. **Builds the site** in production mode
2. **Runs the audit scout** to check all links
3. **Uploads audit report** as an artifact
4. **Creates GitHub issue** if broken links are found
5. **Updates existing issue** if one is already open
6. **Optional**: Sends Slack notification

### Viewing Results

#### Via GitHub Actions
1. Go to your repository on GitHub
2. Click "Actions" tab
3. Click on the latest "Weekly Link Check" workflow run
4. Download the `audit-report` artifact to see full details

#### Via GitHub Issues
- If broken links are found, an issue is automatically created
- Issue includes:
  - Total number of broken links
  - List of all broken URLs
  - Link to full audit report
  - Suggested actions

### Manual Trigger

To run the link check manually:
1. Go to GitHub Actions
2. Select "Weekly Link Check" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Configuration

#### Change Schedule
Edit `.github/workflows/link-check.yml`:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
```

Common schedules:
- Daily: `'0 9 * * *'`
- Weekly (Monday): `'0 9 * * 1'`
- Monthly (1st): `'0 9 1 * *'`

#### Enable Slack Notifications
1. Create a Slack webhook URL
2. Add `SLACK_WEBHOOK_URL` to GitHub Secrets
3. Uncomment the Slack notification step in the workflow

---

## 📊 Local Link Checking

### Run Audit Locally

```bash
# Start development server
cd nextjs-project
npm run dev

# In another terminal, run audit
node ../.agent/skills/website-audit/scripts/audit-scout.js
```

### View Results

The audit creates `audit-report.json` with:
- Total pages scanned
- Number of broken links
- Console errors
- Page load errors
- Detailed list of all issues

### Audit Configuration

Edit `audit-scout.js` to customize:
- **Max pages**: Change `maxPages` variable
- **Timeout**: Adjust link check timeout
- **Start URL**: Modify `startUrl` for different environments

---

## 🛠️ Troubleshooting

### Cache Not Clearing

**Problem**: Changes not appearing after cache purge

**Solutions**:
1. Verify you're using the correct secret
2. Check that the path/tag is correct
3. Try purging by tag instead of path
4. Restart the Next.js server
5. Clear browser cache

### Link Check Failing

**Problem**: Workflow fails even though links work

**Solutions**:
1. Check if it's a timeout issue (increase timeout)
2. Verify the site is accessible from GitHub Actions
3. Check if the link requires authentication
4. Review the audit report artifact for details

### Too Many False Positives

**Problem**: Audit reports valid links as broken

**Solutions**:
1. Increase timeout for slow government sites
2. Add retry logic for intermittent failures
3. Whitelist known-slow domains
4. Update audit script to handle specific cases

---

## 📝 Best Practices

### Cache Strategy

1. **Use tags for bulk operations**: Purge by tag when updating multiple pages
2. **Purge specific paths for single updates**: More efficient for individual changes
3. **Document cache dependencies**: Keep track of what affects what
4. **Monitor cache hit rates**: Ensure caching is effective

### Link Maintenance

1. **Fix broken links immediately**: Don't let them accumulate
2. **Update source URLs proactively**: Check for URL changes quarterly
3. **Monitor external dependencies**: Track changes to CDC, AAP, etc.
4. **Keep audit reports**: Historical data helps identify patterns

### Automation

1. **Review weekly reports**: Don't ignore automated issues
2. **Triage quickly**: Distinguish between real issues and false positives
3. **Update workflows as needed**: Adjust frequency and notifications
4. **Keep secrets secure**: Rotate regularly, never commit

---

## 🔗 Related Documentation

- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Documentation](https://playwright.dev/)

---

## 📞 Support

For issues or questions:
1. Check this documentation first
2. Review audit reports for details
3. Check GitHub Issues for similar problems
4. Create a new issue with full context

---

**Last Updated**: 2026-01-18  
**Version**: 1.0.0
