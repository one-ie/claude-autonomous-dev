# Terminal Monitoring System

## Overview

The claude-autonomous-dev framework provides real-time terminal monitoring capabilities that enable Claude Code to watch development processes continuously and react to events autonomously.

## Quick Start

```bash
# One command for full autonomous monitoring
claude-auto monitor start --full-autonomous

# This starts:
# ✅ Real-time process monitoring 
# ✅ Log file watching (dev-server, build, test, convex)
# ✅ Network health monitoring
# ✅ Error detection and analysis
# ✅ Automatic restart capabilities
```

## Core Features

### 1. Real-Time Process Monitoring

Continuously monitors all development processes:
- **Dev servers** (Vite, Astro, Next.js)
- **Build processes** (TypeScript, bundlers)
- **Test runners** (Jest, Vitest, etc.)
- **Backend services** (Convex, APIs)

### 2. Intelligent Log Analysis

Parses terminal output in real-time:
- **Error Detection**: Catches TypeScript errors, build failures, runtime errors
- **Warning Alerts**: Identifies deprecation warnings, lint issues
- **Success Tracking**: Monitors compilation success, test passes
- **URL Extraction**: Detects when services come online

### 3. Event-Driven Responses

Emits events that Claude can respond to:
- `process:crashed` - When dev server stops unexpectedly
- `terminal:error` - When errors appear in logs
- `network:down` - When endpoints become unavailable
- `state:changed` - When environment state changes

## Commands

### Start Monitoring

```bash
# Full autonomous monitoring (recommended)
claude-auto monitor start --full-autonomous

# Basic monitoring
claude-auto monitor start

# Custom monitoring with options
claude-auto monitor start --interval=3000 --logs=dev-server,build --auto-restart
```

### Watch Specific Logs

```bash
# Watch development server output
claude-auto watch dev-server

# Watch build process
claude-auto watch build

# Watch test results
claude-auto watch test

# Watch Convex logs
claude-auto watch convex
```

### Log Analysis

```bash
# Analyze recent errors and warnings
claude-auto analyze dev-server

# Show recent activity
claude-auto activity "30 minutes ago"

# Live development dashboard
claude-auto dashboard
```

### Monitoring Control

```bash
# Check monitoring status
claude-auto monitor status

# Stop monitoring
claude-auto monitor stop
```

## Event System

### Process Events

```javascript
// Listen for process events
claude.on('process:crashed', (event) => {
  console.log(`💥 ${event.process} crashed (PID: ${event.pid})`);
  // Auto-restart logic
});

claude.on('process:started', (event) => {
  console.log(`🚀 ${event.process} started (PID: ${event.pid})`);
});
```

### Terminal Events

```javascript
// Listen for log events
claude.on('terminal:error', (event) => {
  console.log(`❌ [${event.source}] ${event.message}`);
  // Error handling logic
});

claude.on('terminal:success', (event) => {
  console.log(`✅ [${event.source}] ${event.message}`);
});
```

### Network Events

```javascript
// Listen for network changes
claude.on('network:down', (event) => {
  console.log(`🔴 ${event.endpoint}:${event.port} went down`);
});

claude.on('network:up', (event) => {
  console.log(`🟢 ${event.endpoint}:${event.port} came online`);
});
```

## Configuration

### Log File Setup

The system automatically creates and monitors these log files:

```
.claude/logs/
├── dev-server.log    # Development server output
├── build.log         # Build process output  
├── test.log          # Test runner output
├── convex.log        # Convex service output
└── development.log   # General development events
```

### Monitoring Scripts

Auto-generated monitoring scripts:

```
.claude/scripts/
├── check-processes.sh    # Process health checker
├── analyze-logs.sh       # Log analysis tool
└── autonomous-dev.sh     # Full autonomous monitoring
```

## Integration with Claude Code

### Before Monitoring

```bash
# Claude had to ask for status
Claude: "Can you check if the server is running?"
Developer: Runs ps aux | grep dev
Claude: "Can you check for TypeScript errors?"
Developer: Runs npx tsc --noEmit
```

### With Monitoring Active

```bash
# Claude knows everything automatically
Claude: "I can see your dev server running on PID 12345"
Claude: "TypeScript compilation successful - safe to proceed"
Claude: "❌ Error detected in Auth.tsx - fixing now"
```

## Use Cases

### 1. Autonomous Development

```bash
# Start full monitoring
claude-auto monitor start --full-autonomous

# Claude can now:
# - Detect when servers crash and restart them
# - See TypeScript errors as they occur
# - Monitor build status continuously
# - Track test results in real-time
```

### 2. Team Development

```bash
# Share monitoring state
claude-auto monitor status > team-status.json

# Team members get instant environment context
claude-auto activity "since last standup"
```

### 3. CI/CD Integration

```bash
# Quality gates based on monitoring
if claude-auto ready --score=90; then
  deploy_to_production
else
  echo "Environment not ready for deployment"
fi
```

## Best Practices

### 1. Always Use Full Autonomous Mode

```bash
# This gives Claude maximum awareness
claude-auto monitor start --full-autonomous
```

### 2. Capture Dev Server Output

```bash
# Pipe output to monitoring system
npm run dev 2>&1 | tee .claude/logs/dev-server.log &
claude-auto monitor start
```

### 3. Monitor During Development

```bash
# Keep monitoring active throughout development session
claude-auto monitor start &
# Continue development - Claude sees everything
```

### 4. Use Dashboard for Overview

```bash
# Get real-time development state
claude-auto dashboard
```

## Troubleshooting

### No Log Output

```bash
# Ensure log directory exists
claude-auto init

# Check if processes are writing to logs
ls -la .claude/logs/
```

### Monitoring Not Starting

```bash
# Check system requirements
which tail
which curl
which ps

# Verify permissions
chmod +x .claude/scripts/*.sh
```

### Events Not Firing

```bash
# Check monitoring status
claude-auto monitor status

# Restart monitoring
claude-auto monitor stop
claude-auto monitor start --full-autonomous
```

## Advanced Configuration

### Custom Event Handlers

```javascript
const claude = new ClaudeAuto();

// Custom error handling
claude.on('terminal:error', async (event) => {
  if (event.source === 'dev-server' && event.message.includes('TypeScript')) {
    // Run type check and attempt fix
    await claude.checkQuality();
  }
});

// Auto-restart on crash
claude.on('process:crashed', async (event) => {
  if (event.process === 'vite') {
    console.log('Restarting dev server...');
    await claude.captureDevServerOutput();
  }
});
```

### Performance Tuning

```bash
# Adjust monitoring frequency
claude-auto monitor start --interval=10000  # Check every 10 seconds

# Monitor specific logs only
claude-auto monitor start --logs=dev-server,build

# Disable network monitoring for performance
claude-auto monitor start --no-network
```

This terminal monitoring system transforms Claude from a reactive assistant to a proactive development partner with complete environmental awareness.