#!/bin/bash

# Check development processes
DEV_PID=$(ps aux | grep "vite|npm.*dev|yarn.*dev" | grep -v grep | awk '{print $2}' | head -1)
CONVEX_PID=$(ps aux | grep "convex dev" | grep -v grep | awk '{print $2}' | head -1)
ASTRO_PID=$(ps aux | grep "astro.*dev" | grep -v grep | awk '{print $2}' | head -1)

echo "DEV_SERVER_STATUS=$([ ! -z "$DEV_PID" ] && echo "RUNNING:$DEV_PID" || echo "STOPPED")"
echo "CONVEX_STATUS=$([ ! -z "$CONVEX_PID" ] && echo "RUNNING:$CONVEX_PID" || echo "STOPPED")"
echo "ASTRO_STATUS=$([ ! -z "$ASTRO_PID" ] && echo "RUNNING:$ASTRO_PID" || echo "STOPPED")"
echo "TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')"

# Check network endpoints
echo "FRONTEND_URL=$(curl -s -o /dev/null -w "%{url_effective}" http://localhost:5173 2>/dev/null || echo "OFFLINE")"
echo "ASTRO_URL=$(curl -s -o /dev/null -w "%{url_effective}" http://localhost:4321 2>/dev/null || echo "OFFLINE")"
echo "CONVEX_URL=$(curl -s -o /dev/null -w "%{url_effective}" http://localhost:3210 2>/dev/null || echo "OFFLINE")"
