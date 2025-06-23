# claude-autonomous-dev

> ⚡ Lightweight autonomous development framework that gives Claude real-time environmental awareness

[![npm version](https://badge.fury.io/js/claude-autonomous-dev.svg)](https://www.npmjs.com/package/claude-autonomous-dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/one-ie/claude-autonomous-dev/workflows/Node.js%20CI/badge.svg)](https://github.com/one-ie/claude-autonomous-dev/actions)

Transform Claude from a **reactive assistant** to a **proactive development partner** with real-time environmental intelligence. **Now with full terminal monitoring, Astro, Vite, Convex, and Turbo monorepo support!**

## 🤖 **For Claude Code Users**

**Transform Claude from reactive to proactive development partner:**

```bash
# 1. Install globally
npm install -g claude-autonomous-dev

# 2. Initialize in your project (run this once)
claude-auto init

# 3. Now Claude can intelligently check your environment
claude-auto status
```

### **How It Works with Claude Code**

**Claude Code can run terminal commands and see their output.** This package makes that **100x more powerful**:

**Before (Multiple blind commands):**
```
Claude: "Let me check your environment..."
→ Runs: ps aux | grep dev
→ Runs: curl localhost:3000  
→ Runs: npx tsc --noEmit
→ Runs: git status
→ Analyzes 4 separate outputs, may miss things
```

**After (Single intelligent command):**
```
Claude: "Let me check your environment..."
→ Runs: claude-auto status
→ Gets comprehensive structured data instantly
→ "I can see Vite on 5173, TypeScript clean, 3 files changed, ready to proceed"
```

### **What Claude Gains**
- ✅ **Instant Environment Intel**: Complete development state in one command
- ✅ **Real-Time Terminal Monitoring**: Watch dev servers, builds, tests continuously
- ✅ **Proactive Problem Detection**: "I see TypeScript errors, fixing those first"
- ✅ **Framework Awareness**: "Detected Astro + Convex setup, adjusting workflow"
- ✅ **Process Monitoring**: "Dev server running on PID 12345, safe to proceed"
- ✅ **Auto-Fix Capabilities**: Can run `claude-auto fix` to resolve common issues
- ✅ **Event-Driven Responses**: React to crashes, errors, warnings in real-time
- ✅ **Log Analysis**: Stream and analyze logs from all development processes

### **In Practice**
**NEW**: Claude **CAN** now watch your terminal continuously with `claude-auto monitor start`! This provides real-time awareness of crashes, errors, and state changes. Even without continuous monitoring, Claude gets **vastly more intelligent and actionable information** from fewer commands.

**Result**: Claude makes **informed decisions** instead of guessing, leading to faster and more accurate development assistance.

## 🚀 The Revolution

### Before (Blind Development)
- ❌ "Can you check if the server is running?"
- ❌ "Are there any TypeScript errors?"
- ❌ "What's the current status?"
- ❌ "Please tell me when errors occur"

### After (Autonomous Intelligence) 
- ✅ "I can see your dev server running on PID 12345"
- ✅ "TypeScript is clean - safe to proceed"
- ✅ "Build successful (1.2M, 850ms) - ready to deploy"
- ✅ **"🔴 NETWORK DOWN: vite:5173 - restarting automatically"**
- ✅ **"❌ [dev-server] ERROR: Type error detected - fixing now"**
- ✅ **"🚀 PROCESS STARTED: convex (PID: 12346)"**

## ⚡ Lightning-Fast Setup

```bash
# Install globally from npm
npm install -g claude-autonomous-dev

# Initialize in any project  
claude-auto init

# Check what Claude sees
claude-auto status
```

> 🎉 **Now available on npm!** Install globally and use in any project instantly.

**Output:**
```
🤖 CLAUDE AUTO STATUS (45ms)
==================
project     : turbo monorepo (3 workspaces)
frameworks  : astro(1), vite(2), convex(1), react(3)
processes   : Turbo dev (PID: 12345), Astro:4321 (PID: 12346), Convex:3210 (PID: 12347, cloud)
network     : Healthy (astro:4321, vite:5173, convex:3210)
readiness   : 90% (ready)
typescript  : Clean
lint        : 0 errors, 2 warnings
build       : Success (1.2M, 850ms)
git         : 3 files changed
```

## 🛠️ Core Commands

### 🔍 Environment Intelligence
```bash
claude-auto status      # Ultra-fast status (< 50ms)
claude-auto ready       # Comprehensive readiness check
claude-auto scan        # Detailed JSON environment data
claude-auto can-start   # Safe to start servers?
```

### 🔧 Development Tools  
```bash
claude-auto build       # Build monitoring with metrics
claude-auto lint [fix]  # Lint checking with auto-fix
claude-auto fix         # Auto-fix common issues
```

### 👁️ Terminal Monitoring (NEW!)
```bash
claude-auto monitor start      # Start real-time terminal monitoring  
claude-auto monitor stop       # Stop monitoring
claude-auto watch [source]     # Watch specific log (dev-server, build, test)
claude-auto analyze [source]   # Analyze logs for errors/warnings
claude-auto activity [time]    # Show recent activity (default: 1 hour ago)
```

### 🏗️ Monorepo & Framework Support
```bash
claude-auto frameworks          # Detect all frameworks (Astro, Vite, etc.)
claude-auto workspaces          # List monorepo workspaces  
claude-auto workspaces status   # Detailed workspace info
cauto ws                        # Short alias for workspaces
```

### ⚡ Quick Shortcuts
```bash
cauto s                 # Short alias for status
cauto r                 # Short alias for ready  
cauto init && cauto s   # Setup and check
```

## 📊 Live Dashboard Example

```bash
$ claude-auto status

🤖 CLAUDE AUTONOMOUS DEVELOPMENT STATUS
========================================

🎯 Readiness: 85% (Ready)
📡 Dev Server: Running (PID: 65497) ✅
📡 Backend: Running (PID: 65496) ✅  
🔧 TypeScript: Clean (0 errors) ✅
🧹 Lint: 5 warnings (auto-fixable) ⚠️
🏗️ Build: Successful (1.2M, 3.1s) ✅
🌐 Frontend: Healthy (http://localhost:3000) ✅
📝 Git: 4 files changed, ready to commit
```

## 🧠 How It Works

### 1. Environmental Scanning
The framework continuously monitors:
- Running processes and their PIDs
- Network endpoints and health status
- Code quality metrics (TypeScript, linting, build status)
- Git repository state
- System resources and performance

### 2. Intelligent Decision Making
Claude can now:
- Avoid starting duplicate servers
- Fix code issues before implementing features
- Choose optimal development workflows
- Predict and prevent common errors

### 3. Autonomous Task Execution
The system enables:
- Self-directed task completion
- Continuous quality validation
- Proactive error correction
- Complete development session logging

## 📁 Project Structure

```
your-project/
├── .claude/                    # Autonomous framework files
│   ├── core/
│   │   ├── autonomous-engine.js    # Core environmental intelligence
│   │   └── claude-interface.sh     # Command interface
│   ├── logs/                   # Development session logs
│   ├── status/                 # Environment state snapshots
│   ├── analysis/              # Intelligent log analysis
│   └── config/                # Framework configuration
├── package.json
└── your-code/
```

## 🎭 Use Cases

### Individual Development
- **Faster iterations**: No more status requests or manual checks
- **Better decisions**: Every operation informed by real data
- **Error prevention**: Catch issues before they break your flow

### Team Collaboration
- **Shared context**: Environmental snapshots for debugging
- **Remote development**: Distributed teams with unified intelligence
- **Knowledge transfer**: Capture expert workflows for replication

### CI/CD Integration
- **Smart build gates**: Quality-based deployment decisions  
- **Intelligent testing**: Optimize test execution based on code state
- **Predictive monitoring**: Anticipate issues before they occur

## 🚀 Advanced Features

### Custom Monitoring
```javascript
// Add custom health checks
claude.addHealthCheck('database', async () => {
  return await checkDatabaseConnection();
});
```

### Workflow Automation
```bash
# Define development workflows
claude-auto workflow create "feature-development" \
  --steps="typecheck,lint-fix,test,build" \
  --conditions="servers-running,git-clean"
```

### Team Integration
```bash
# Share environment state with team
claude-auto share-snapshot
claude-auto sync-team-state
```

## 📖 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration Options](docs/configuration.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Why This Matters

This framework represents a paradigm shift from **reactive AI assistance** to **proactive AI partnership**. Instead of constantly asking "What's the status?", Claude now **knows** your environment and makes intelligent decisions based on real data.

**The future of software development is autonomous, intelligent, and aware. Start building it today.** 🤖✨

---

## 🎉 **Version 1.3.0: Revolutionary Terminal Monitoring**

### **NEW: Real-Time Terminal Awareness**

Claude can now **continuously watch your terminal** and react to events in real-time:

```bash
# Start continuous monitoring
claude-auto monitor start

# Claude now sees everything:
🚀 PROCESS STARTED: vite (PID: 12345)
✅ [dev-server] SUCCESS: ready in 1245ms
❌ [dev-server] ERROR: Type 'undefined' is not assignable to type 'string'
🔴 NETWORK DOWN: vite:5173
💥 PROCESS CRASHED: convex (PID: 12346)
```

### **What This Means for Claude Code**

Before: *"Can you check if the server crashed?"*
**Now**: *Claude automatically knows and can restart it*

Before: *"Are there any new errors?"*
**Now**: *Claude sees errors as they happen and can fix them immediately*

Before: *"What's the current development state?"*
**Now**: *Claude has continuous real-time awareness*

### **The Complete Autonomous Vision Realized**

This implementation fulfills the original vision from `docs/auto.md`:
- ✅ **Real-time terminal monitoring** with log capture
- ✅ **Continuous process health checking** 
- ✅ **Intelligent log analysis** and event detection
- ✅ **Development dashboard** with live updates
- ✅ **Event-driven autonomous responses**

**Claude is no longer blind to your development environment!** 🚀