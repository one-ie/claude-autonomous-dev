# Monorepo Support

## Overview

Claude Autonomous Development provides comprehensive support for monorepo architectures, with intelligent workspace detection and coordinated monitoring across multiple packages.

## Supported Monorepo Tools

### **Turbo** ✅
- **Auto-detection**: `turbo.json` configuration file
- **Features**: Pipeline monitoring, workspace dependency tracking
- **Commands**: Full workspace analysis and monitoring

### **npm workspaces** ✅
- **Auto-detection**: `workspaces` field in root package.json
- **Features**: Package dependency management, script coordination
- **Commands**: Individual workspace monitoring

### **Yarn workspaces** ✅
- **Auto-detection**: `workspaces` field with yarn.lock
- **Features**: Yarn-specific workspace patterns
- **Commands**: Workspace-aware process monitoring

## Monorepo Detection

### **Automatic Detection Process**

```bash
# Check if project is a monorepo
claude-auto scan | jq '.monorepo.type'

# See detected workspaces
claude-auto workspaces

# View all frameworks across workspaces
claude-auto frameworks
```

### **Detection Results**

```bash
$ claude-auto workspaces

📦 TURBO Monorepo
   3 workspace(s) found:

📁 frontend
   Path: apps/frontend
   Frameworks: vite, react
   Dev: npm run dev

📁 backend
   Path: apps/backend  
   Frameworks: node, typescript
   Dev: npm start

📁 shared
   Path: packages/shared
   Frameworks: typescript
   Build: npm run build
```

## Workspace Management

### **List All Workspaces**

```bash
# Basic workspace listing
claude-auto workspaces

# Detailed workspace status
claude-auto workspaces status

# Short alias
claude-auto ws
```

### **Workspace Analysis**

```bash
# Comprehensive workspace analysis
claude-auto scan | jq '.monorepo'

# Example output:
{
  "type": "monorepo",
  "tool": "turbo", 
  "workspaces": [
    {
      "name": "frontend",
      "path": "apps/frontend",
      "packageJson": {...},
      "frameworks": ["vite", "react"]
    }
  ],
  "frameworks": {
    "vite": [{
      "workspace": "frontend",
      "path": "apps/frontend",
      "version": "^4.4.5"
    }]
  }
}
```

## Monitoring Across Workspaces

### **Full Monorepo Monitoring**

```bash
# Monitor all workspaces simultaneously
claude-auto monitor start --full-autonomous

# Monitoring output shows workspace context:
🚀 PROCESS STARTED: turbo dev (PID: 12345)
🟢 NETWORK UP: vite:5173 (frontend workspace)
🟢 NETWORK UP: express:3001 (backend workspace)
✅ [frontend] SUCCESS: Vite dev server ready
✅ [backend] SUCCESS: Express server listening
```

### **Workspace-Specific Monitoring**

```bash
# Monitor specific workspace
cd apps/frontend
claude-auto monitor start

# Or monitor from root with workspace context
claude-auto monitor start --workspace=frontend
```

## Turbo Monorepo Support

### **Turbo Configuration Detection**

The system automatically detects and analyzes `turbo.json`:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### **Turbo Process Monitoring**

```bash
# Turbo dev command monitoring
npm run dev  # Starts turbo dev pipeline

# Monitoring detects:
🚀 PROCESS STARTED: turbo dev (PID: 12345)
📊 [turbo] INFO: Starting development pipeline
✅ [frontend] SUCCESS: Vite ready on port 5173
✅ [backend] SUCCESS: Express ready on port 3001
🔄 [shared] INFO: TypeScript compilation complete
```

### **Turbo Build Monitoring**

```bash
# Monitor Turbo build process
claude-auto build

# Or start monitoring and run build
claude-auto monitor start --full-autonomous &
npm run build

# Monitoring output:
🏗️ [turbo] INFO: Building 3 packages
✅ [shared] SUCCESS: Build complete (542ms)
✅ [frontend] SUCCESS: Build complete (1.2s)
✅ [backend] SUCCESS: Build complete (896ms)
📊 [turbo] SUCCESS: Pipeline complete (1.8s total)
```

## Framework Detection Across Workspaces

### **Multi-Framework Analysis**

```bash
# See all frameworks across all workspaces
claude-auto frameworks

# Example output for complex monorepo:
🛠️ Framework Detection Results:

✅ VITE
   📍 frontend (apps/frontend)
      Version: ^4.4.5
      Config: vite.config.ts
      Dev: npm run dev

✅ ASTRO  
   📍 docs (apps/docs)
      Version: ^3.0.0
      Config: astro.config.mjs
      Dev: npm run dev

✅ CONVEX
   📍 backend (apps/backend)
      Version: ^1.3.1
      Config: convex.config.ts

✅ REACT
   📍 frontend (apps/frontend)
      Version: ^18.2.0
   📍 admin (apps/admin) 
      Version: ^18.2.0

✅ TYPESCRIPT
   📍 shared (packages/shared)
      Version: ^5.1.6
```

### **Workspace Dependencies**

The system tracks dependencies between workspaces:

```bash
# Check workspace dependency graph
claude-auto scan | jq '.monorepo.workspaces[].packageJson.dependencies'

# Monitor build order compliance
claude-auto build  # Respects dependency order
```

## Development Workflows

### **Starting Development**

```bash
# 1. Check monorepo structure
claude-auto workspaces

# 2. Start full monitoring
claude-auto monitor start --full-autonomous

# 3. Start development pipeline
npm run dev  # Turbo starts all dev servers

# 4. Optional: Start dashboard for overview
claude-auto dashboard
```

### **Managing Individual Workspaces**

```bash
# Work on specific workspace
cd apps/frontend

# Check workspace-specific status
claude-auto status

# Start workspace monitoring
claude-auto monitor start

# Return to root for full monitoring
cd ../..
claude-auto monitor start --full-autonomous
```

### **Build Pipeline Monitoring**

```bash
# Monitor full build pipeline
claude-auto monitor start --full-autonomous &
npm run build

# Check individual workspace builds
claude-auto workspaces status

# Monitor specific build
cd packages/shared
claude-auto build
```

## Advanced Monorepo Features

### **Cross-Workspace Communication**

Monitor communication between workspaces:

```bash
# Watch for workspace changes
claude-auto activity "30 minutes ago"

# Example output shows workspace interactions:
✅ shared: TypeScript compilation complete
🔄 frontend: Hot reload triggered by shared package update  
🔄 backend: API types updated from shared package
```

### **Dependency Change Detection**

```bash
# Monitor package.json changes across workspaces
claude-auto monitor start --full-autonomous

# Detects changes like:
📦 [frontend] INFO: Added dependency: @types/node@^20.0.0
🔄 [shared] INFO: Updated dependency: typescript@^5.1.6
⚠️ [backend] WARNING: Peer dependency mismatch detected
```

### **Build Cache Monitoring**

For Turbo projects with build caching:

```bash
# Monitor cache hits/misses
🚀 [turbo] INFO: Cache hit for shared:build (1.2s saved)
⚡ [turbo] INFO: Cache miss for frontend:build (rebuilding)
📊 [turbo] INFO: 2/3 tasks cached (66% cache hit rate)
```

## Configuration

### **Workspace-Specific Configuration**

Each workspace can have its own monitoring configuration:

```bash
# Configure monitoring per workspace
cd apps/frontend
claude-auto init  # Creates workspace-specific .claude directory

# Root-level monitoring still works
cd ../..
claude-auto monitor start --full-autonomous
```

### **Turbo Integration**

For optimal Turbo integration, ensure your `turbo.json` includes:

```json
{
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    }
  }
}
```

### **Package.json Workspace Configuration**

For npm workspaces, ensure proper configuration:

```json
{
  "name": "my-monorepo",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build"
  }
}
```

## Troubleshooting Monorepos

### **Workspace Detection Issues**

If workspaces aren't detected:

1. **Check Configuration**:
   ```bash
   # Verify workspace configuration
   cat package.json | jq '.workspaces'
   ls turbo.json
   ```

2. **Force Re-detection**:
   ```bash
   # Clear cache and re-scan
   rm -rf .claude/status/*
   claude-auto scan
   ```

3. **Manual Workspace Discovery**:
   ```bash
   # List all package.json files
   find . -name "package.json" -not -path "*/node_modules/*"
   ```

### **Process Monitoring Issues**

If processes aren't properly detected across workspaces:

1. **Check Process Names**:
   ```bash
   ps aux | grep -E "(npm|yarn|turbo|dev)"
   ```

2. **Verify Port Binding**:
   ```bash
   # Check which ports are in use
   lsof -i :3000,3001,4321,5173
   ```

3. **Individual Workspace Testing**:
   ```bash
   # Test each workspace individually
   cd apps/frontend
   claude-auto status
   ```

### **Build Pipeline Issues**

For build pipeline problems:

1. **Check Dependency Order**:
   ```bash
   # Verify build dependencies
   claude-auto workspaces status
   ```

2. **Monitor Build Process**:
   ```bash
   # Watch build in real-time
   claude-auto monitor start --full-autonomous &
   npm run build
   ```

3. **Check Individual Builds**:
   ```bash
   # Test each workspace build
   cd packages/shared && npm run build
   cd apps/frontend && npm run build
   ```

## Best Practices

### **Development Setup**

1. **Always Start with Structure Analysis**:
   ```bash
   claude-auto workspaces
   claude-auto frameworks
   ```

2. **Use Full Autonomous Monitoring**:
   ```bash
   claude-auto monitor start --full-autonomous
   ```

3. **Monitor from Root Directory**:
   ```bash
   # Monitor entire monorepo from root
   cd /path/to/monorepo-root
   claude-auto monitor start --full-autonomous
   ```

### **Build and Deployment**

1. **Pre-deployment Checks**:
   ```bash
   claude-auto ready  # Check all workspaces
   claude-auto workspaces status
   ```

2. **Monitor Build Pipeline**:
   ```bash
   claude-auto monitor start --full-autonomous &
   npm run build
   ```

3. **Verify Cross-Workspace Dependencies**:
   ```bash
   claude-auto activity "since last build"
   ```

### **Team Collaboration**

1. **Share Workspace Status**:
   ```bash
   claude-auto workspaces status > team-workspace-status.json
   ```

2. **Monitor Team Development**:
   ```bash
   claude-auto activity "since standup"
   ```

3. **Document Workspace Structure**:
   ```bash
   claude-auto frameworks > project-frameworks.md
   ```

This comprehensive monorepo support ensures Claude has full visibility into complex project structures and can provide intelligent assistance across all workspaces simultaneously.