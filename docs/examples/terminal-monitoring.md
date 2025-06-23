# Terminal Monitoring Examples

## Real-Time Terminal Monitoring System

The claude-autonomous-dev framework now includes real-time terminal monitoring capabilities, implementing the vision from the original docs/auto.md.

### Basic Terminal Monitoring

```bash
# Initialize the monitoring system
claude-auto init

# Start real-time monitoring
claude-auto monitor start

# Output:
# 🤖 Starting autonomous terminal monitoring...
# ✅ Terminal monitoring active - Claude can now see real-time changes
# Press Ctrl+C to stop monitoring
```

### Real-Time Event Detection

When monitoring is active, Claude automatically detects and reports:

#### Process Events
```bash
# When dev server starts
🚀 PROCESS STARTED: vite (PID: 12345)

# When dev server crashes  
💥 PROCESS CRASHED: vite (PID: 12345)

# When Convex comes online
🚀 PROCESS STARTED: convex (PID: 12346)
```

#### Network Events
```bash
# When frontend comes online
🟢 NETWORK UP: vite:5173

# When frontend goes down
🔴 NETWORK DOWN: vite:5173

# When Astro dev server starts
🟢 NETWORK UP: astro:4321
```

#### Log Events
```bash
# TypeScript errors detected
❌ [dev-server] ERROR: Type 'string' is not assignable to type 'number'

# Build warnings
⚠️ [build] WARNING: Unused variable 'debugMode'

# Success messages
✅ [dev-server] SUCCESS: ready in 1245ms
```

### Watching Specific Log Files

```bash
# Watch development server logs
claude-auto watch dev-server

# Watch build logs
claude-auto watch build

# Watch test logs  
claude-auto watch test

# Watch Convex logs
claude-auto watch convex
```

### Log Analysis

```bash
# Analyze recent errors and warnings
claude-auto analyze dev-server

# Output:
# 🔍 Analyzing dev-server.log...
# === LOG ANALYSIS SUMMARY ===
# Timestamp: 2025-06-23 14:30:15
# Log File: .claude/logs/dev-server.log
# 
# Errors Found: 3
# Warnings Found: 7
# Success Messages: 12
# 
# Latest Error:
# Type 'undefined' is not assignable to type 'string'
# 
# Latest Success:
# ready in 1245ms
# 
# Available URLs:
# http://localhost:5173
```

### Recent Activity Tracking

```bash
# Show activity from last hour
claude-auto activity "1 hour ago"

# Show activity from last 30 minutes
claude-auto activity "30 minutes ago"

# Show activity from last 5 minutes
claude-auto activity "5 minutes ago"

# Output:
# 📊 Recent Activity (1 hour ago):
# ================================
# ❌ dev-server: Type error in src/components/Auth.tsx
# ⚠️ build: Warning: Bundle size exceeded 500KB
# ✅ test: All tests passed (23 passed, 0 failed)
# ✅ dev-server: ready in 1245ms
```

### Monitoring Status

```bash
# Check current monitoring status
claude-auto monitor status

# Output:
# 📊 Monitoring Status
# ==================
# Active: Yes
# Log Watchers: dev-server, build, test, convex
# Process Monitor: Running
# Event Listeners: Active
```

### Stop Monitoring

```bash
# Stop all monitoring
claude-auto monitor stop

# Output:
# 🛑 Monitoring stopped
```

## Advanced Use Cases

### 1. Capture Dev Server Output

```bash
# Start dev server with automatic log capture
npm run dev 2>&1 | tee .claude/logs/dev-server.log &

# Start monitoring to watch the captured output
claude-auto monitor start
```

### 2. Integration with Claude Code

When Claude Code needs to understand your development environment:

```bash
# Instead of multiple blind commands:
# - ps aux | grep dev
# - curl localhost:3000  
# - npx tsc --noEmit
# - git status

# Claude can now run:
claude-auto status

# And get comprehensive real-time data:
# 🤖 CLAUDE AUTO STATUS (45ms)
# ==================
# project     : Single package  
# processes   : Vite:5173 (PID: 12345), Convex:3210 (PID: 12346, local)
# network     : Healthy (vite:5173, convex:3210)
# readiness   : 85% (partial)
# typescript  : Clean
# lint        : 3 errors, 12 warnings
# build       : Success (1.2M, 850ms)
# git         : 4 files changed
```

### 3. Real-Time Decision Making

With monitoring active, Claude can make intelligent decisions:

```typescript
// Before any operation, Claude automatically knows:
const env = await claude.scan();

if (env.processes.vite) {
  // Don't start duplicate server
  console.log("✅ Dev server already running - proceeding with development");
} else {
  // Safe to start server
  await claude.captureDevServerOutput();
}

if (env.quality.typescript.errors > 0) {
  // Fix TypeScript first
  console.log("🔧 TypeScript errors detected - fixing before proceeding");
}
```

### 4. Event-Driven Development

```javascript
const claude = new ClaudeAuto();

// Listen for critical events
claude.on('process:crashed', async (event) => {
  console.log(`💥 ${event.process} crashed - attempting restart...`);
  // Auto-restart logic here
});

claude.on('terminal:error', async (event) => {
  if (event.source === 'dev-server' && event.message.includes('TypeScript')) {
    console.log('🔧 TypeScript error detected - running type check...');
    // Auto-fix logic here
  }
});

claude.on('network:down', async (event) => {
  console.log(`🔴 ${event.endpoint} went down - checking health...`);
  // Health check logic here
});

// Start monitoring
await claude.startMonitoring();
```

### 5. Development Dashboard

```bash
# Create a real-time development dashboard
claude-auto monitor start &

# In another terminal, watch for updates
while true; do
  clear
  echo "🤖 DEVELOPMENT DASHBOARD"
  echo "======================="
  claude-auto status
  echo ""
  echo "📝 Recent Activity:"
  claude-auto activity "5 minutes ago"
  sleep 10
done
```

## The Transformation

### Before (Blind Development)
```
❌ "Can you check if the server is running?"
❌ "Are there any TypeScript errors?"  
❌ "What's the current status?"
❌ Claude operates without environmental context
```

### After (Autonomous Awareness)
```
✅ "I can see your dev server running on PID 12345"
✅ "TypeScript is clean - safe to proceed"
✅ "Build successful (1.2M, 850ms) - ready to deploy"
✅ Claude makes informed decisions based on real-time data
```

## Benefits

### For Claude
- **Real-time environment awareness**: No more blind operations
- **Proactive error detection**: Catch issues as they happen
- **Smart decision making**: Every operation backed by live data
- **Continuous learning**: Learn from terminal output patterns

### For Developers  
- **100x more powerful assistant**: Claude understands your environment
- **Fewer interruptions**: No more status requests
- **Autonomous problem solving**: Claude fixes issues proactively
- **Complete development logs**: Full audit trail of development sessions

### For Teams
- **Shared environmental intelligence**: Team debugging with shared context
- **Remote development**: Distributed teams with unified state
- **Knowledge preservation**: Capture expert development patterns

## Getting Started

```bash
# Install globally
npm install -g claude-autonomous-dev@latest

# Initialize in your project
claude-auto init

# Start monitoring
claude-auto monitor start

# Now Claude can see what's happening in real-time! 🎉
```

This transforms Claude from a reactive assistant to a proactive development partner with complete environmental awareness.