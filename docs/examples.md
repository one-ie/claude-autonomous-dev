# Usage Examples

## Basic Usage Examples

### Example 1: React Project Setup

```bash
# Create a new React project
npx create-react-app my-app
cd my-app

# Install and initialize Claude framework
npm install -g claude-autonomous-dev
claude-auto init

# Start full autonomous monitoring (ONE COMMAND!)
claude-auto monitor start --full-autonomous
```

Expected output:
```
🤖 Starting autonomous terminal monitoring...
✅ Terminal monitoring active - Claude can now see real-time changes
🚀 PROCESS STARTED: vite (PID: 12345)
✅ [dev-server] SUCCESS: ready in 1245ms
```

### Example 2: Development Workflow

```bash
# Start development with monitoring
claude-auto monitor start --full-autonomous &
npm run dev

# Check what Claude sees
claude-auto status
# Now shows: Dev Server: Running (PID: 12345)

# Make some code changes, monitoring detects automatically
# ❌ [dev-server] ERROR: Type 'string' is not assignable to type 'number'

# Get comprehensive readiness assessment
claude-auto ready
```

### Example 3: Continuous Monitoring

```bash
# Start autonomous monitoring with dashboard
claude-auto monitor start --full-autonomous &
claude-auto dashboard

# Continue development - Claude monitors automatically
# Any TypeScript errors, build failures, or server crashes
# will be detected and logged in real-time

# View recent activity
claude-auto activity "30 minutes ago"
```

## Framework-Specific Examples

### Vite + React Project

```bash
# Initialize monitoring
claude-auto init
claude-auto monitor start --full-autonomous

# Start Vite dev server (automatically detected)
npm run dev

# Monitoring automatically detects:
# 🚀 PROCESS STARTED: vite (PID: 12345)
# 🟢 NETWORK UP: vite:5173
# ✅ [dev-server] SUCCESS: ready in 1245ms

# Real-time TypeScript monitoring
# ❌ [dev-server] ERROR: Property 'name' does not exist on type '{}'
```

### Astro Project

```bash
# Astro-specific monitoring
claude-auto init
claude-auto frameworks
# Output: ✅ ASTRO (astro.config.mjs detected)

claude-auto monitor start --full-autonomous
npm run dev

# Monitoring detects Astro on port 4321
# 🟢 NETWORK UP: astro:4321
# ✅ [dev-server] SUCCESS: astro dev server ready
```

### Next.js Project

```bash
# Next.js monitoring
claude-auto init
claude-auto monitor start --full-autonomous
npm run dev

# Automatically detects Next.js patterns
# 🚀 PROCESS STARTED: next (PID: 12345)
# 🟢 NETWORK UP: next:3000
# ✅ [dev-server] SUCCESS: ready on http://localhost:3000
```

### Convex Project

```bash
# Convex-specific monitoring
claude-auto init
claude-auto convex status
# Check Convex authentication and deployment

claude-auto monitor start --full-autonomous
npx convex dev &

# Watch Convex logs in real-time
claude-auto logs convex --tail

# Monitoring output:
# 🚀 PROCESS STARTED: convex (PID: 12346)
# ✅ [convex] SUCCESS: Convex development server ready
# 📝 [convex] INFO: Functions deployed successfully
```

### Turbo Monorepo

```bash
# Monorepo monitoring
cd my-turbo-monorepo
claude-auto init

# Analyze workspace structure
claude-auto workspaces
# Output:
# 📦 TURBO Monorepo
#    3 workspace(s) found:
# 📁 frontend (Vite, React)
# 📁 backend (Node.js)
# 📁 shared (TypeScript)

claude-auto monitor start --full-autonomous
npm run dev  # Turbo runs all dev scripts

# Monitors all workspaces simultaneously:
# 🚀 PROCESS STARTED: turbo dev (PID: 12345)
# 🟢 NETWORK UP: vite:5173 (frontend)
# 🟢 NETWORK UP: express:3001 (backend)
```

## Daily Development Scenarios

### Scenario 1: Starting Development Session

```bash
# Morning routine - autonomous environment check
claude-auto ready

# If not ready, monitoring helps fix issues
claude-auto monitor start --full-autonomous
claude-auto analyze dev-server  # Check for overnight issues

# Start development
npm run dev &
# Monitoring automatically detects and tracks everything
```

### Scenario 2: Before Committing Code

```bash
# Pre-commit checks with monitoring active
claude-auto status
# Shows: readiness: 90% (ready), typescript: Clean, build: Success

# Create snapshot for reference
claude-auto activity "since last commit"

# If all good, commit
git add .
git commit -m "Feature: Added user authentication"
```

### Scenario 3: Debugging Issues

```bash
# Something's wrong - check recent activity
claude-auto activity "1 hour ago"

# View specific log analysis
claude-auto analyze dev-server
claude-auto analyze build

# Real-time dashboard for current state
claude-auto dashboard
```

### Scenario 4: Team Collaboration

```bash
# Share environment state with team
claude-auto monitor status > team-status.json
claude-auto activity "since standup" > team-activity.log

# Team member can see exact state:
# Active: Yes
# Log Watchers: dev-server, build, test, convex
# Process Monitor: Running
# Recent Activity: 3 TypeScript errors, 1 build warning
```

## Integration Examples

### With Claude Code

```typescript
// Claude Code can now make intelligent decisions
const env = await claudeAuto.scan();

if (env.processes.vite) {
  // Don't start duplicate server
  console.log("✅ Dev server already running - proceeding with development");
} else {
  // Safe to start server
  await startDevServer();
}

if (env.quality.typescript.errors > 0) {
  // Fix TypeScript first
  console.log("🔧 TypeScript errors detected - fixing before proceeding");
  await fixTypeScriptErrors();
}
```

### Event-Driven Development

```javascript
const claude = new ClaudeAuto();

// Listen for critical events
claude.on('process:crashed', async (event) => {
  console.log(`💥 ${event.process} crashed - attempting restart...`);
  
  if (event.process === 'vite') {
    // Auto-restart dev server
    await claude.captureDevServerOutput();
  }
});

claude.on('terminal:error', async (event) => {
  if (event.source === 'dev-server' && event.message.includes('TypeScript')) {
    console.log('🔧 TypeScript error detected - running type check...');
    const quality = await claude.checkQuality();
    if (quality.typescript.errors > 0) {
      // Attempt auto-fix
      await claude.autoFix();
    }
  }
});

claude.on('network:down', async (event) => {
  console.log(`🔴 ${event.endpoint} went down - checking health...`);
  // Health check and potential restart logic
});

// Start monitoring with event handlers
await claude.startMonitoring({
  interval: 3000,
  autoRestart: true
});
```

### CI/CD Integration

```bash
#!/bin/bash
# ci-build.sh

# Start monitoring for CI/CD
claude-auto init
claude-auto monitor start --full-autonomous &

# Build with monitoring
npm run build

# Check if build succeeded
if claude-auto ready --score=90; then
  echo "✅ Build ready for deployment"
  deploy_to_production
else
  echo "❌ Build not ready - issues detected"
  claude-auto activity "since build start"
  exit 1
fi
```

### Custom Monitoring Script

```bash
#!/bin/bash
# dev-setup.sh

echo "🚀 Starting autonomous development environment..."

# Initialize if needed
if [ ! -d ".claude" ]; then
  claude-auto init
fi

# Start full monitoring
claude-auto monitor start --full-autonomous &
MONITORING_PID=$!

# Start development servers
npm run dev &
DEV_PID=$!

# Start dashboard in background
claude-auto dashboard &
DASHBOARD_PID=$!

echo "✅ Development environment ready!"
echo "Monitoring PID: $MONITORING_PID"
echo "Dev Server PID: $DEV_PID"
echo "Dashboard PID: $DASHBOARD_PID"

# Cleanup on exit
trap "kill $MONITORING_PID $DEV_PID $DASHBOARD_PID 2>/dev/null" EXIT

# Keep script running
wait
```

## Advanced Use Cases

### Pattern 1: Quality Gates

```bash
# Implement quality gates before major changes
quality_check() {
  claude-auto ready --score=90 || {
    echo "❌ Environment not ready for changes"
    claude-auto analyze dev-server
    exit 1
  }
  
  claude-auto monitor start --full-autonomous &
  echo "✅ Quality gates passed - monitoring active"
}

# Use before important operations
quality_check && implement_feature
```

### Pattern 2: Automated Recovery

```bash
# Auto-recovery script
recover_environment() {
  echo "🔧 Attempting automatic recovery..."
  
  # Stop any monitoring
  claude-auto monitor stop
  
  # Fix common issues
  claude-auto autoFix
  npm install  # Update dependencies
  
  # Restart services if needed
  if ! claude-auto can-start; then
    pkill -f "npm run dev"
    sleep 2
  fi
  
  # Restart monitoring
  claude-auto monitor start --full-autonomous &
  
  # Start dev server with monitoring
  npm run dev 2>&1 | tee .claude/logs/dev-server.log &
  
  # Verify recovery
  sleep 5
  claude-auto status
}

# Use when environment becomes unstable
recover_environment
```

### Pattern 3: Development Dashboard

```bash
# Create a comprehensive development dashboard
dev_dashboard() {
  while true; do
    clear
    echo "🤖 DEVELOPMENT DASHBOARD"
    echo "========================"
    
    claude-auto status
    echo ""
    
    echo "📊 Recent Activity:"
    claude-auto activity "15 minutes ago" | head -10
    echo ""
    
    echo "🔍 Monitoring Status:"
    claude-auto monitor status
    echo ""
    
    echo "🌐 Network Health:"
    curl -s -o /dev/null -w "Frontend: %{http_code}" http://localhost:5173 2>/dev/null || echo "Frontend: DOWN"
    curl -s -o /dev/null -w " | Convex: %{http_code}" http://localhost:3210 2>/dev/null || echo " | Convex: DOWN"
    echo ""
    
    sleep 10
  done
}

# Run dashboard
dev_dashboard
```

## Common Commands Reference

### Quick Status Checks
```bash
claude-auto status        # Quick overview
claude-auto ready         # Detailed readiness
claude-auto can-start     # Safe to start servers?
claude-auto monitor status # Monitoring state
```

### Development Actions
```bash
claude-auto monitor start --full-autonomous  # Full monitoring
claude-auto build         # Monitor build process
claude-auto analyze dev-server  # Log analysis
claude-auto activity "1h"  # Recent activity
```

### Framework Detection
```bash
claude-auto frameworks     # Detect all frameworks
claude-auto workspaces     # List monorepo workspaces
claude-auto convex status  # Convex-specific status
```

### Monitoring and Analysis
```bash
claude-auto watch dev-server    # Watch specific logs
claude-auto dashboard          # Real-time dashboard
claude-auto activity "30m"     # Show recent activity
```

## Tips for Maximum Effectiveness

### 1. Make it Part of Your Routine
```bash
# Add to your shell profile
alias ready='claude-auto ready'
alias status='claude-auto status'
alias monitor='claude-auto monitor start --full-autonomous &'
alias dashboard='claude-auto dashboard'
```

### 2. Use with Git Hooks
```bash
# In .git/hooks/pre-commit
#!/bin/bash
claude-auto ready --score=80 && claude-auto analyze dev-server
```

### 3. Integration with VS Code
```json
// In VS Code tasks.json
{
  "label": "Start Autonomous Monitoring",
  "type": "shell", 
  "command": "claude-auto monitor start --full-autonomous",
  "group": "build",
  "presentation": {
    "panel": "new"
  }
}
```

### 4. Team Standardization
```bash
# Team onboarding script
setup_dev_environment() {
  npm install -g claude-autonomous-dev
  claude-auto init
  claude-auto monitor start --full-autonomous &
  npm run dev
  echo "✅ Autonomous development environment ready!"
}
```

These examples show how the Claude Autonomous Development Framework transforms from a reactive "Can you check...?" workflow to a proactive, intelligent development partnership with complete environmental awareness.