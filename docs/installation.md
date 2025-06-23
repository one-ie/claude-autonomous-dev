# Installation Guide

## Quick Install

```bash
# Install globally via npm
npm install -g claude-autonomous-dev

# Initialize in your project
cd your-project
claude-auto init

# Start using
claude-auto status
```

## Manual Installation

If you prefer to install manually or want to customize the framework:

### 1. Clone or Download

```bash
# Option A: Clone the repository
git clone https://github.com/one-network/claude-autonomous-dev.git
cd claude-autonomous-dev
npm install

# Option B: Download the package files directly
mkdir claude-autonomous-dev
# Copy package contents to this directory
```

### 2. Link Globally (Optional)

```bash
npm link
# Now you can use 'claude-auto' from anywhere
```

### 3. Initialize in Your Project

```bash
cd /path/to/your/project
claude-auto init
```

## Project Requirements

### Supported Project Types
- **Node.js projects** with npm/yarn
- **TypeScript projects** with tsc
- **React applications** (Create React App, Vite, Next.js)
- **Vue.js applications** 
- **Any project** with package.json and build scripts

### Required Dependencies
The framework works with any project that has:
- `package.json` with build/dev scripts
- Node.js runtime (v14+)
- Optional: TypeScript, ESLint for enhanced monitoring

### Recommended Scripts in package.json
```json
{
  "scripts": {
    "dev": "your-dev-server-command",
    "build": "your-build-command", 
    "lint": "your-lint-command",
    "typecheck": "tsc --noEmit"
  }
}
```

## Verification

After installation, verify everything is working:

```bash
# Check if framework is properly installed
claude-auto doctor

# Test basic functionality
claude-auto status

# Verify readiness assessment
claude-auto ready
```

Expected output:
```
🤖 CLAUDE AUTONOMOUS DEVELOPMENT STATUS
========================================
🎯 Readiness: 85% (Ready)
📡 Dev Server: Stopped
📡 Convex: Stopped  
🔧 TypeScript: Clean
🧹 Lint: 0 errors, 3 warnings
🏗️ Build: Successful
🌐 Frontend: Offline
📝 Git: Clean
```

## Troubleshooting Installation

### Permission Issues
```bash
# If you get permission errors during global install:
sudo npm install -g claude-autonomous-dev
# Or use a Node version manager like nvm
```

### Framework Not Initialized
```bash
# If commands fail with "not initialized":
claude-auto init
# Then try commands again
```

### Missing Dependencies
```bash
# If autonomous engine fails to run:
cd .claude/core
npm install
# Or reinstall the framework:
npm uninstall -g claude-autonomous-dev
npm install -g claude-autonomous-dev
```

### Path Issues
```bash
# If 'claude-auto' command not found:
npm list -g --depth=0 | grep claude-autonomous-dev
# Check your PATH includes npm global bin directory:
npm config get prefix
```

## Next Steps

After successful installation:

1. **Read the [Quick Start Guide](../README.md#quick-start)**
2. **Review [Configuration Options](configuration.md)**
3. **Set up your first [Development Workflow](../examples/workflows.md)**
4. **Integrate with your [CI/CD Pipeline](../examples/cicd.md)**

## Uninstallation

To remove the framework:

```bash
# Remove global package
npm uninstall -g claude-autonomous-dev

# Remove from your project
rm -rf .claude
# Remove from .gitignore if desired
```