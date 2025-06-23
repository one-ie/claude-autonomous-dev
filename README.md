# claude-autonomous-dev

> ⚡ Lightweight autonomous development framework that gives Claude real-time environmental awareness

[![npm version](https://badge.fury.io/js/claude-autonomous-dev.svg)](https://www.npmjs.com/package/claude-autonomous-dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/one-ie/claude-autonomous-dev/workflows/Node.js%20CI/badge.svg)](https://github.com/one-ie/claude-autonomous-dev/actions)

Transform Claude from a **reactive assistant** to a **proactive development partner** with real-time environmental intelligence. **Now with full Astro, Vite, Convex, and Turbo monorepo support!**

## 🚀 The Revolution

### Before (Blind Development)
- ❌ "Can you check if the server is running?"
- ❌ "Are there any TypeScript errors?"
- ❌ "What's the current status?"

### After (Autonomous Intelligence)
- ✅ "I can see your dev server running on PID 12345"
- ✅ "TypeScript is clean - safe to proceed"
- ✅ "Build successful (1.2M, 850ms) - ready to deploy"

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