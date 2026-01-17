---
allowed-tools: Bash(npx localtunnel*), WebFetch
description: Generate a shareable preview URL using localtunnel
---

## Task

Generate a shareable preview link for the local dev server.

1. First, fetch the tunnel password (user's IP) from https://loca.lt/mytunnelpassword
2. Start localtunnel on port 5173: `npx localtunnel --port 5173`
3. Provide the user with:
   - The tunnel URL
   - The password (their IP address) that visitors need to enter

**Important**: Remind the user that:
- Their Vite dev server must be running (`npm run dev`) in another terminal
- Anyone accessing the link will need to enter the IP address as the password

$ARGUMENTS
