# Basic Usage Examples

## Getting Started with Claude Autonomous Development

### Example 1: React Project Setup

```bash
# Create a new React project
npx create-react-app my-app
cd my-app

# Install and initialize Claude framework
npm install -g claude-autonomous-dev
claude-auto init

# Check initial status
claude-auto status
```

Expected output:
```
🤖 CLAUDE AUTONOMOUS DEVELOPMENT STATUS
========================================
🎯 Readiness: 75% (Partial)
📡 Dev Server: Stopped
📡 Convex: Stopped  
🔧 TypeScript: Clean
🧹 Lint: 0 errors, 0 warnings
🏗️ Build: Not tested
🌐 Frontend: Offline
📝 Git: Clean
```

### Example 2: Development Workflow

```bash
# Start development server
npm run dev &

# Check what Claude sees
claude-auto status
# Now shows: Dev Server: Running (PID: 12345)

# Make some code changes, then check quality
claude-auto lint
claude-auto typecheck
claude-auto build

# Get comprehensive readiness assessment
claude-auto ready
```

### Example 3: Continuous Monitoring

```bash
# Start autonomous monitoring in background
claude-auto monitor &

# Continue development - Claude monitors automatically
# Any TypeScript errors, build failures, or server crashes
# will be detected and logged in real-time

# View recent activity
claude-auto activity "30 minutes ago"

# Check for any alerts
claude-auto alerts
```

## Daily Development Scenarios

### Scenario 1: Starting Development Session

```bash
# Morning routine - check environment before starting
claude-auto ready

# If not ready, fix issues first
claude-auto lint fix
claude-auto typecheck

# Start development
npm run dev &
claude-auto monitor &

# Confirm everything is working
claude-auto status
```

### Scenario 2: Before Committing Code

```bash
# Pre-commit checks
claude-auto build
claude-auto lint
claude-auto typecheck

# Create snapshot for reference
claude-auto snapshot

# If all good, commit
git add .
git commit -m "Feature: Added user authentication"
```

### Scenario 3: Debugging Issues

```bash
# Something's wrong - check recent activity
claude-auto activity "1 hour ago"

# View specific logs
claude-auto logs dev
claude-auto logs build

# Check for system alerts
claude-auto alerts

# Get comprehensive environment scan
claude-auto scan | jq '.codeQuality'
```

### Scenario 4: Team Collaboration

```bash
# Share environment state with team
claude-auto snapshot
# Share the generated snapshot file

# Replicate team member's environment
# (after receiving their snapshot)
claude-auto status
# Compare with their snapshot data
```

### Scenario 5: Convex Development

```bash
# Check Convex project status
claude-auto convex status

# Watch Convex logs in real-time
claude-auto logs convex --tail

# Get recent Convex logs
claude-auto convex logs

# List Convex functions
claude-auto convex functions

# Full development status including Convex
claude-auto status
# Now shows Convex process and deployment info
```

## Integration with Common Tools

### With TypeScript Projects

```bash
# TypeScript-specific workflow
claude-auto typecheck
# Fix any errors, then
claude-auto build
claude-auto ready
```

### With ESLint

```bash
# Lint workflow with auto-fix
claude-auto lint fix
claude-auto status
# Verify lint errors are resolved
```

### With Testing

```bash
# Add test monitoring (if you have test scripts)
npm test &
claude-auto monitor
# Will detect test failures in real-time
```

### With Docker

```bash
# Monitor Docker-based development
docker-compose up -d
claude-auto status
# Check if services are responding
```

## Advanced Usage Patterns

### Pattern 1: Quality Gates

```bash
# Implement quality gates before major changes
quality_check() {
  claude-auto ready || exit 1
  claude-auto build || exit 1
  echo "✅ Quality gates passed"
}

# Use before important operations
quality_check && git push origin main
```

### Pattern 2: Automated Recovery

```bash
# Auto-recovery script
recover_environment() {
  echo "🔧 Attempting automatic recovery..."
  
  # Fix common issues
  claude-auto lint fix
  npm install  # Update dependencies
  
  # Restart services if needed
  if ! claude-auto can-start; then
    pkill -f "npm run dev"
    sleep 2
    npm run dev &
  fi
  
  claude-auto status
}

# Use when environment becomes unstable
recover_environment
```

### Pattern 3: Development Dashboard

```bash
# Create a development dashboard
dev_dashboard() {
  clear
  echo "🤖 DEVELOPMENT DASHBOARD"
  echo "========================"
  
  claude-auto status
  echo ""
  
  echo "📊 Recent Activity:"
  claude-auto activity "15 minutes ago" | head -10
  echo ""
  
  echo "🚨 Alerts:"
  claude-auto alerts
}

# Run periodically or on demand
dev_dashboard
```

## Common Commands Reference

### Quick Status Checks
```bash
claude-auto status        # Quick overview
claude-auto ready         # Detailed readiness
claude-auto can-start     # Safe to start servers?
```

### Development Actions
```bash
claude-auto build         # Monitor build process
claude-auto lint fix      # Lint with auto-fix
claude-auto typecheck     # TypeScript validation
```

### Convex Integration
```bash
claude-auto convex status    # Check Convex deployment
claude-auto convex logs      # Recent Convex logs
claude-auto convex functions # List functions
claude-auto logs convex --tail # Follow logs real-time
```

### Monitoring and Analysis
```bash
claude-auto monitor       # Real-time monitoring
claude-auto activity      # Recent activity analysis
claude-auto logs          # View development logs
claude-auto alerts        # Check for issues
```

### Maintenance
```bash
claude-auto snapshot      # Create checkpoint
claude-auto doctor        # Verify installation
claude-auto help          # See all commands
```

## Tips for Maximum Effectiveness

### 1. Make it Part of Your Routine
```bash
# Add to your shell profile
alias ready='claude-auto ready'
alias status='claude-auto status'
alias monitor='claude-auto monitor &'
```

### 2. Use with Git Hooks
```bash
# In .git/hooks/pre-commit
#!/bin/bash
claude-auto build && claude-auto lint
```

### 3. Integration with VS Code
```bash
# In VS Code tasks.json
{
  "label": "Claude Status",
  "type": "shell",
  "command": "claude-auto status"
}
```

### 4. Team Standardization
```bash
# Team onboarding script
setup_dev_environment() {
  claude-auto init
  claude-auto ready
  echo "✅ Environment ready for development"
}
```

These examples show how the Claude Autonomous Development Framework transforms from a reactive "Can you check...?" workflow to a proactive, intelligent development partnership.