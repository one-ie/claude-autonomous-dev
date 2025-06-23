# claude-autonomous-dev

> ⚡ **Revolutionary autonomous development framework that gives Claude real-time environmental awareness**

[![npm version](https://badge.fury.io/js/claude-autonomous-dev.svg)](https://www.npmjs.com/package/claude-autonomous-dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Transform Claude Code with **real-time terminal monitoring**, full **autonomous development capabilities**, and support for **Astro, Vite, Convex, Next.js, and Turbo monorepos**.

## 🚀 **One Command for Full Autonomous Development**

```bash
# Install globally
npm install -g claude-autonomous-dev

# Initialize in your project
claude-auto init

# Start FULL autonomous monitoring (ONE COMMAND!)
claude-auto monitor start --full-autonomous
```

**This single command gives Claude complete environmental awareness:**
- ✅ **Real-time process monitoring** - Sees crashes, starts, stops
- ✅ **Intelligent log analysis** - Detects errors, warnings, successes
- ✅ **Network health monitoring** - Tracks endpoint availability  
- ✅ **Error detection & analysis** - Catches TypeScript/build issues
- ✅ **Auto-restart capabilities** - Recovers from crashes automatically

## 🤖 **The Transformation**

### Before (Blind Development)
```
❌ "Can you check if the server is running?"
❌ "Are there any TypeScript errors?"
❌ "What's the current status?"
❌ "Please tell me when errors occur"
```

### After (Autonomous Intelligence)
```
✅ "I can see your dev server running on PID 12345"
✅ "TypeScript is clean - safe to proceed"
✅ "Build successful (1.2M, 850ms) - ready to deploy"
✅ "🔴 NETWORK DOWN: vite:5173 - restarting automatically"
✅ "❌ [dev-server] ERROR: Type error detected - fixing now"
✅ "🚀 PROCESS STARTED: convex (PID: 12346)"
```

## ⚡ **Lightning-Fast Setup**

```bash
# Install globally from npm
npm install -g claude-autonomous-dev

# Initialize in any project  
claude-auto init

# Start full autonomous monitoring
claude-auto monitor start --full-autonomous
```

**Now Claude has complete real-time awareness of your development environment!**

## 🛠️ **Core Commands**

### 🔍 **One Command for Everything**
```bash
claude-auto monitor start --full-autonomous  # RECOMMENDED: Full autonomous monitoring
```

### 📊 **Environment Intelligence**
```bash
claude-auto status              # Ultra-fast status (< 50ms)
claude-auto ready               # Comprehensive readiness check
claude-auto scan                # Detailed JSON environment data
claude-auto dashboard           # Real-time development dashboard
```

### 👁️ **Terminal Monitoring**
```bash
claude-auto watch dev-server    # Watch specific logs
claude-auto analyze build       # Analyze logs for errors/warnings
claude-auto activity "1h ago"   # Show recent activity
claude-auto monitor status      # Check monitoring status
```

### 🏗️ **Framework & Monorepo Support**
```bash
claude-auto frameworks          # Detect all frameworks (Astro, Vite, etc.)
claude-auto workspaces          # List monorepo workspaces  
claude-auto convex status       # Convex-specific monitoring
```

## 🎯 **Supported Technologies**

- **Frontend**: Vite, Astro, Next.js, React, Vue, Svelte
- **Backend**: Convex, Node.js APIs
- **Monorepos**: Turbo, npm workspaces
- **Languages**: TypeScript, JavaScript
- **Tools**: ESLint, build systems, test runners

## 📚 **Complete Documentation**

### **Getting Started**
- **[📖 Getting Started Guide](docs/getting-started.md)** - Complete setup and first steps
- **[⚡ Quick Examples](docs/examples.md)** - Real-world usage examples
- **[🔧 API Reference](docs/api.md)** - Complete API documentation

### **Core Features**
- **[👁️ Terminal Monitoring](docs/terminal-monitoring.md)** - Real-time monitoring system
- **[🏗️ Framework Support](docs/frameworks.md)** - Framework-specific configurations
- **[📦 Monorepo Support](docs/monorepos.md)** - Working with complex projects

### **Integration Examples**
- **[🎨 Basic Usage](docs/examples/basic-usage.md)** - Common development workflows
- **[🤖 Claude Code Integration](docs/examples/claude-code.md)** - How Claude Code uses this
- **[🔄 CI/CD Integration](docs/examples/ci-cd.md)** - Deployment pipelines

## 🌟 **What Makes This Revolutionary**

### **Real-Time Environmental Awareness**
Claude can now **continuously watch your terminal** and react to events automatically:

```bash
# Start monitoring and Claude sees everything:
🚀 PROCESS STARTED: vite (PID: 12345)
✅ [dev-server] SUCCESS: ready in 1245ms
❌ [dev-server] ERROR: Type 'undefined' is not assignable to type 'string'
🔴 NETWORK DOWN: vite:5173
💥 PROCESS CRASHED: convex (PID: 12346)
```

### **Autonomous Development Partnership**
- **Proactive Error Detection**: Catches issues as they happen
- **Smart Decision Making**: Every operation backed by real data
- **Self-Healing Capabilities**: Auto-restart crashed processes
- **Complete Session Logging**: Full audit trail of development activity

### **Universal Framework Intelligence**
- **Automatic Detection**: Finds all frameworks and tools in your project
- **Monorepo Awareness**: Works seamlessly with complex project structures
- **Context-Aware Monitoring**: Adapts to your specific development stack

## 🎉 **Success Stories**

> *"Claude went from asking me for status every 5 minutes to knowing everything about my environment in real-time. It's like having a senior developer pair-programming with me."* - React Developer

> *"The autonomous monitoring caught a TypeScript error that would have broken our build. Claude fixed it before I even noticed."* - Full-Stack Developer

> *"Our CI/CD pipeline now uses the readiness checks to prevent bad deployments. Game changer."* - DevOps Engineer

## 🚀 **Quick Start Examples**

### **React/Vite Project**
```bash
npx create-vite my-app --template react-ts
cd my-app
npm install -g claude-autonomous-dev
claude-auto init
claude-auto monitor start --full-autonomous
npm run dev
```

### **Astro Project**
```bash
npm create astro@latest my-site
cd my-site
claude-auto init
claude-auto monitor start --full-autonomous
npm run dev
```

### **Turbo Monorepo**
```bash
npx create-turbo@latest my-monorepo
cd my-monorepo
claude-auto init
claude-auto frameworks  # See all detected frameworks
claude-auto monitor start --full-autonomous
npm run dev
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

---

## 🎯 **The Future is Autonomous**

This framework represents a fundamental shift from **reactive AI assistance** to **proactive AI partnership**. Instead of constantly asking "What's the status?", Claude now **knows** your environment and makes intelligent decisions based on real-time data.

**Claude is no longer blind to your development environment!** 🚀

**[📖 Read the Complete Documentation →](docs/getting-started.md)**