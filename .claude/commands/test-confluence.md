---
allowed-tools: Bash(cat:*), Read
description: Test and debug Confluence integration connection
---

## Task

Test and debug the Confluence integration to verify credentials and configuration.

### Usage
- `/test-confluence` - Run all connection tests
- `/test-confluence list` - List pages under the configured parent
- `/test-confluence create-test` - Create a test page (for verification)

### Steps

1. **Check Configuration**
   Read the environment configuration and report which variables are set:
   - `VITE_CONFLUENCE_BASE_URL` - Base URL (required)
   - `VITE_CONFLUENCE_SPACE_KEY` - Space key (required)
   - `VITE_CONFLUENCE_API_TOKEN` - API token (required, show as masked)
   - `VITE_CONFLUENCE_USER_EMAIL` - User email (required)
   - `VITE_CONFLUENCE_PARENT_PAGE_ID` - Parent page ID (optional)

2. **Verify Connection**
   Using the ConfluenceClient from `src/planning/utils/confluenceClient.ts`:
   - Call `verifyConnection()` to test credentials
   - Report success/failure with the space name if successful

3. **List Parent Configuration** (if parent page ID is configured)
   - Fetch the parent page details using `getPageById()`
   - List child pages under the parent using `getChildPages()`
   - Show the page hierarchy

4. **Report Results**
   Display a summary:
   ```
   Confluence Connection Test
   ==========================

   Configuration:
   - Base URL: https://company.atlassian.net/wiki
   - Space Key: SPECS
   - User Email: user@company.com
   - API Token: ****configured****
   - Parent Page ID: 123456789 (optional)

   Connection: SUCCESS
   - Space Name: "Specifications"

   Parent Page: "Spec Documents"
   - Child Pages:
     - Features (3 children)
     - Navigation (1 child)
     - Tools (2 children)

   Ready for spec releases!
   ```

### If Arguments Include "create-test"

Create a test page to verify write access:
1. Find or create a "Test" category page
2. Create a page titled "Test Page - {timestamp}"
3. Delete the page after verification (if possible)
4. Report success/failure

### Error Handling

Common issues and solutions:
- **401 Unauthorized**: Check API token and email match an active Atlassian account
- **404 Not Found**: Verify space key exists and parent page ID is correct
- **403 Forbidden**: User may not have write permissions to the space

### How to Find Parent Page ID

1. Navigate to the desired parent page in Confluence
2. Click "..." menu > "Page Information"
3. The page ID is in the URL: `/pages/viewinfo.action?pageId=123456789`

$ARGUMENTS
