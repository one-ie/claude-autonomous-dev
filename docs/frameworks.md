# Framework Support

## Overview

Claude Autonomous Development supports all major modern development frameworks with intelligent auto-detection and framework-specific monitoring capabilities.

## Supported Frameworks

### **Frontend Frameworks**

#### **Vite** ✅
- **Auto-detection**: `vite.config.ts/js` files
- **Default port**: 5173
- **Monitoring**: Development server, HMR, build process
- **Commands**: `claude-auto frameworks` shows Vite detection

#### **Astro** ✅
- **Auto-detection**: `astro.config.mjs/ts/js` files
- **Default port**: 4321
- **Monitoring**: Dev server, SSR/SSG builds, integrations
- **Commands**: `claude-auto frameworks` shows Astro detection

#### **Next.js** ✅
- **Auto-detection**: `next` dependency in package.json
- **Default port**: 3000
- **Monitoring**: Dev server, API routes, builds
- **Commands**: `claude-auto frameworks` shows Next.js detection

#### **React** ✅
- **Auto-detection**: `react` dependency in package.json
- **Monitoring**: Component errors, development warnings
- **Integration**: Works with Vite, Next.js, Create React App

#### **Vue** ✅
- **Auto-detection**: `vue` dependency in package.json
- **Default port**: 8080
- **Monitoring**: Vue dev server, composition API errors

#### **Svelte** ✅
- **Auto-detection**: `svelte` dependency in package.json
- **Default port**: 5173 (with Vite)
- **Monitoring**: Svelte compilation, dev server

### **Backend & Tools**

#### **Convex** ✅
- **Auto-detection**: `convex` dependency or `convex/` directory
- **Default port**: 3210
- **Monitoring**: Development server, function deployment, logs
- **Special features**: Real-time log streaming with `claude-auto logs convex --tail`

#### **TypeScript** ✅
- **Auto-detection**: `typescript` dependency or `.ts` files
- **Monitoring**: Compilation errors, type checking
- **Commands**: `claude-auto status` shows TypeScript health

#### **ESLint** ✅
- **Auto-detection**: `.eslintrc` files or eslint dependency
- **Monitoring**: Lint errors, warnings, fixable issues
- **Commands**: `claude-auto lint fix` for auto-fixing

### **Monorepo Tools**

#### **Turbo** ✅
- **Auto-detection**: `turbo.json` configuration
- **Monitoring**: Multiple workspace processes, build pipelines
- **Commands**: `claude-auto workspaces` shows all workspaces

#### **npm workspaces** ✅
- **Auto-detection**: `workspaces` field in package.json
- **Monitoring**: Individual workspace processes
- **Commands**: `claude-auto workspaces status` for detailed info

## Framework Detection

### **Automatic Detection Process**

1. **Configuration Files**: Looks for framework-specific config files
2. **Dependencies**: Checks package.json for framework dependencies
3. **Directory Structure**: Analyzes project structure for framework patterns
4. **Scripts**: Examines npm scripts for framework commands

### **Detection Commands**

```bash
# See all detected frameworks
claude-auto frameworks

# Detailed framework information
claude-auto scan | jq '.monorepo.frameworks'

# Check specific workspace frameworks
claude-auto workspaces status
```

### **Example Detection Output**

```bash
$ claude-auto frameworks

🛠️ Framework Detection Results:

✅ VITE
   📍 root (.)
      Version: ^4.4.5
      Config: vite.config.ts
      Dev: npm run dev

✅ REACT
   📍 root (.)
      Version: ^18.2.0

✅ CONVEX
   📍 root (.)
      Version: ^1.3.1
      Config: convex.config.ts
```

## Framework-Specific Monitoring

### **Vite Projects**

```bash
# Start monitoring for Vite
claude-auto monitor start --full-autonomous

# Monitoring detects:
🚀 PROCESS STARTED: vite (PID: 12345)
🟢 NETWORK UP: vite:5173
✅ [dev-server] SUCCESS: ready in 1245ms
⚡ [dev-server] INFO: HMR update applied
```

**What's Monitored:**
- Development server startup/crashes
- Hot Module Replacement (HMR) updates
- Build process and bundle analysis
- TypeScript compilation if present

### **Astro Projects**

```bash
# Astro-specific monitoring
claude-auto monitor start --full-autonomous

# Monitoring detects:
🚀 PROCESS STARTED: astro (PID: 12346)
🟢 NETWORK UP: astro:4321
✅ [dev-server] SUCCESS: astro dev server ready
🔄 [dev-server] INFO: Page regenerated: /blog/post-1
```

**What's Monitored:**
- Astro dev server lifecycle
- Static site generation (SSG) builds
- Integration loading and errors
- Page routing and regeneration

### **Convex Projects**

```bash
# Enhanced Convex monitoring
claude-auto convex status
claude-auto monitor start --full-autonomous

# Real-time log streaming
claude-auto logs convex --tail

# Monitoring output:
🚀 PROCESS STARTED: convex (PID: 12347)
✅ [convex] SUCCESS: Functions deployed successfully
📝 [convex] INFO: Database updated
⚠️ [convex] WARNING: Rate limit approaching
```

**What's Monitored:**
- Convex development server
- Function deployments and updates
- Database mutations and queries
- Authentication and permissions

### **Monorepo Projects**

```bash
# Detect monorepo structure
claude-auto workspaces

# Start monitoring all workspaces
claude-auto monitor start --full-autonomous

# Example output for Turbo monorepo:
📦 TURBO Monorepo
   3 workspace(s) found:

📁 frontend
   Path: apps/frontend
   Frameworks: vite, react
   Dev: npm run dev

📁 backend
   Path: apps/backend
   Frameworks: node
   Dev: npm start

📁 shared
   Path: packages/shared
   Frameworks: typescript
```

## Configuration

### **Custom Framework Detection**

If your project uses a custom setup, you can help the detection:

```bash
# Force detection scan
claude-auto scan

# Check detected frameworks
claude-auto frameworks

# Manual process monitoring
claude-auto watch dev-server
```

### **Framework-Specific Options**

#### **Vite Configuration**
```javascript
// vite.config.ts
export default {
  server: {
    port: 5173, // Detected automatically
    host: true  // Enables network monitoring
  }
}
```

#### **Astro Configuration**
```javascript
// astro.config.mjs
export default {
  server: {
    port: 4321, // Detected automatically
    host: true  // Enables network monitoring
  }
}
```

#### **Convex Configuration**
```javascript
// convex.config.ts
export default {
  // Config automatically detected
}
```

## Troubleshooting Framework Detection

### **Framework Not Detected**

1. **Check Configuration Files**:
   ```bash
   # Ensure config files exist
   ls vite.config.* astro.config.* next.config.* convex.config.*
   ```

2. **Check Dependencies**:
   ```bash
   # Verify framework is installed
   grep -E "(vite|astro|next|react|vue|svelte|convex)" package.json
   ```

3. **Force Re-detection**:
   ```bash
   # Clear cache and re-scan
   rm -rf .claude/status/*
   claude-auto scan
   ```

### **Wrong Port Detection**

If the monitoring is watching the wrong port:

1. **Check Process Detection**:
   ```bash
   ps aux | grep "vite\|astro\|next"
   ```

2. **Verify Network Endpoints**:
   ```bash
   claude-auto status
   # Check network section for correct ports
   ```

3. **Manual Port Override**:
   ```bash
   # Start with specific port monitoring
   claude-auto watch dev-server
   ```

### **Multiple Framework Conflicts**

For projects with multiple frameworks:

1. **Check Workspace Structure**:
   ```bash
   claude-auto workspaces
   ```

2. **Monitor Specific Workspace**:
   ```bash
   # Focus on specific workspace if needed
   cd apps/frontend
   claude-auto monitor start
   ```

## Adding New Framework Support

The framework is extensible. To add support for a new framework:

1. **Detection Logic**: Add to `detectPackageFrameworks()` in `lib/index.js`
2. **Process Monitoring**: Add patterns to `scanProcesses()`
3. **Port Detection**: Add default port to `extractPort()`
4. **Network Monitoring**: Add endpoint to `checkNetwork()`

Example for adding Nuxt.js support:

```javascript
// In detectPackageFrameworks()
if (dependencies.nuxt) {
  frameworks.nuxt = {
    version: dependencies.nuxt,
    devScript: this.findScript(scripts, ['dev']),
    buildScript: this.findScript(scripts, ['build'])
  };
}
```

## Best Practices

### **Development Workflow**

1. **Always Check Frameworks First**:
   ```bash
   claude-auto frameworks
   ```

2. **Use Full Autonomous Monitoring**:
   ```bash
   claude-auto monitor start --full-autonomous
   ```

3. **Monitor Framework-Specific Logs**:
   ```bash
   claude-auto watch dev-server
   claude-auto logs convex --tail
   ```

### **Multi-Framework Projects**

1. **Understand Your Stack**:
   ```bash
   claude-auto scan | jq '.monorepo.frameworks'
   ```

2. **Monitor All Processes**:
   ```bash
   claude-auto monitor start --full-autonomous
   ```

3. **Use Dashboard for Overview**:
   ```bash
   claude-auto dashboard
   ```

This comprehensive framework support ensures Claude has deep understanding of your development environment regardless of your technology stack.