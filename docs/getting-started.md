# Getting Started with Claude Autonomous Development

## Installation

```bash
# Install globally from npm
npm install -g claude-autonomous-dev

# Verify installation
claude-auto --version
```

## Quick Setup

```bash
# 1. Navigate to your project
cd your-project

# 2. Initialize autonomous framework
claude-auto init

# 3. Start full autonomous monitoring (ONE COMMAND!)
claude-auto monitor start --full-autonomous
```

## What Happens with Full Autonomous Mode

When you run `claude-auto monitor start --full-autonomous`, the system:

### ✅ **Automatically Detects Your Stack**
- Scans for Vite, Astro, Next.js, Convex, React, Vue, Svelte
- Identifies monorepo structure (Turbo, npm workspaces)
- Finds configuration files and scripts

### ✅ **Starts Real-Time Monitoring**
- Watches all development processes
- Monitors log files continuously
- Tracks network endpoints
- Analyzes code quality in real-time

### ✅ **Enables Claude's Superpowers**
- Process crash detection and auto-restart
- Real-time error identification and fixing
- Build status monitoring
- Network health tracking

## First Steps After Installation

### 1. Initialize Your Project

```bash
# Creates .claude directory structure
claude-auto init

# Output:
# ⚡ Initializing Claude Auto...
# ✅ Initialized successfully!
# 
# Quick start:
#   claude-auto status    # Check environment
#   claude-auto ready     # Check readiness
#   ./.claude/claude status # Local interface
```

### 2. Check Your Environment

```bash
# Get comprehensive status
claude-auto status

# Example output:
# 🤖 CLAUDE AUTO STATUS (45ms)
# ==================
# project     : Single package
# frameworks  : vite(1), react(1)
# processes   : None running
# network     : All offline
# readiness   : 60% (partial)
# typescript  : Clean
# lint        : 5 errors, 12 warnings
# build       : Not tested
# git         : 3 files changed
```

### 3. Start Development with Monitoring

```bash
# Option A: Start monitoring first, then dev server
claude-auto monitor start --full-autonomous &
npm run dev

# Option B: Start dev server with log capture
npm run dev 2>&1 | tee .claude/logs/dev-server.log &
claude-auto monitor start --full-autonomous

# Option C: Let monitoring handle everything
claude-auto monitor start --full-autonomous --auto-start-dev
```

## Framework-Specific Setups

### Vite Projects

```bash
# Monitoring automatically detects Vite on port 5173
claude-auto monitor start --full-autonomous

# Manual log capture if needed
npm run dev 2>&1 | tee .claude/logs/dev-server.log &
```

### Astro Projects

```bash
# Monitoring detects Astro on port 4321
claude-auto monitor start --full-autonomous

# Astro-specific monitoring
claude-auto frameworks
# Output shows: ✅ ASTRO with version and config
```

### Next.js Projects

```bash
# Monitoring detects Next.js on port 3000
claude-auto monitor start --full-autonomous

# Check Next.js detection
claude-auto scan | jq '.monorepo.frameworks.next'
```

### Convex Projects

```bash
# Special Convex monitoring
claude-auto monitor start --full-autonomous
claude-auto convex status

# Watch Convex logs in real-time
claude-auto logs convex --tail
```

### Turbo Monorepos

```bash
# Automatically detects monorepo structure
claude-auto monitor start --full-autonomous

# View workspace analysis
claude-auto workspaces
claude-auto frameworks

# Monitor specific workspace
claude-auto monitor start --workspace=frontend
```

## Verification Steps

### 1. Check Monitoring Status

```bash
claude-auto monitor status

# Expected output:
# 📊 Monitoring Status
# ==================
# Active: Yes
# Log Watchers: dev-server, build, test, convex
# Process Monitor: Running
# Event Listeners: Active
```

### 2. Test Event Detection

```bash
# In another terminal, cause an error
echo "const x: number = 'string';" >> src/test.ts

# Monitoring should detect:
# ❌ [dev-server] ERROR: Type 'string' is not assignable to type 'number'
```

### 3. Verify Dashboard

```bash
# Start real-time dashboard
claude-auto dashboard

# Should show live updates every 5 seconds
```

## Integration with Claude Code

Once monitoring is active, Claude Code gains these capabilities:

### Before
```
❌ Claude: "Can you check if the server is running?"
❌ User: Runs ps aux | grep dev
❌ Claude: "Are there any TypeScript errors?"
❌ User: Runs npx tsc --noEmit
```

### After
```
✅ Claude: "I can see your dev server running on PID 12345"
✅ Claude: "TypeScript is clean - safe to proceed"
✅ Claude: "Build successful (1.2M, 850ms) - ready to deploy"
✅ Claude: "❌ Error detected in Auth.tsx - fixing now"
```

## Common Issues and Solutions

### Issue: Monitoring Not Starting

```bash
# Check system requirements
which tail  # Should exist
which curl  # Should exist
which ps    # Should exist

# Ensure proper permissions
chmod +x .claude/scripts/*.sh

# Restart with verbose output
claude-auto monitor start --full-autonomous --verbose
```

### Issue: No Log Output

```bash
# Ensure log directory exists
ls -la .claude/logs/

# Create if missing
mkdir -p .claude/logs

# Manually create log files
touch .claude/logs/{dev-server,build,test,convex}.log
```

### Issue: Events Not Firing

```bash
# Check if processes are writing to logs
tail -f .claude/logs/dev-server.log

# Restart monitoring
claude-auto monitor stop
claude-auto monitor start --full-autonomous
```

### Issue: High CPU Usage

```bash
# Reduce monitoring frequency
claude-auto monitor start --interval=10000  # 10 seconds

# Monitor fewer log files
claude-auto monitor start --logs=dev-server
```

## Next Steps

1. **[Terminal Monitoring Guide](./terminal-monitoring.md)** - Deep dive into monitoring features
2. **[Framework Support](./frameworks.md)** - Framework-specific configurations
3. **[Monorepo Support](./monorepos.md)** - Working with complex project structures
4. **[API Reference](./api.md)** - Complete API documentation
5. **[Examples](./examples.md)** - Real-world usage examples

## Success Indicators

You know everything is working when:

- ✅ `claude-auto monitor status` shows "Active: Yes"
- ✅ `claude-auto status` completes in under 100ms
- ✅ `claude-auto dashboard` shows live process information
- ✅ Error messages appear in monitoring output when you introduce bugs
- ✅ Claude Code makes intelligent decisions without asking for status

**You're now ready for autonomous development with Claude!** 🚀