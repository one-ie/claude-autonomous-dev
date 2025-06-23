# API Reference

## ClaudeAuto Class

The main class providing autonomous development capabilities.

### Constructor

```javascript
const claude = new ClaudeAuto(projectPath)
```

**Parameters:**
- `projectPath` (string, optional) - Path to project directory. Defaults to `process.cwd()`

### Core Methods

#### Environment Scanning

##### `scan()`
Comprehensive environment analysis.

```javascript
const env = await claude.scan();
// Returns: {
//   timestamp: number,
//   monorepo: {...},
//   processes: {...},
//   network: {...},
//   quality: {...},
//   git: {...},
//   readiness: {...}
// }
```

##### `status()`
Human-readable status for CLI display.

```javascript
const status = await claude.status();
// Returns: {
//   project: "turbo monorepo (3 workspaces)",
//   frameworks: "astro(1), vite(2), convex(1)",
//   processes: "Turbo dev (PID: 12345), Astro:4321 (PID: 12346)",
//   network: "Healthy (astro:4321, vite:5173)",
//   readiness: "90% (ready)",
//   typescript: "Clean",
//   lint: "0 errors, 2 warnings",
//   build: "Success (1.2M, 850ms)",
//   git: "3 files changed"
// }
```

##### `ready()`
Check development readiness.

```javascript
const env = await claude.scan();
const isReady = env.readiness.level === 'ready';
```

#### Process Management

##### `canStart()`
Check if safe to start development servers.

```javascript
const canStart = await claude.canStart();
// Returns: true if no conflicting processes
```

##### `scanProcesses()`
Detect running development processes.

```javascript
const processes = await claude.scanProcesses();
// Returns: {
//   vite: { pid: 12345, status: 'running', port: '5173', type: 'vite-dev' },
//   convex: { pid: 12346, status: 'running', port: '3210', type: 'local' }
// }
```

#### Quality Checks

##### `checkQuality()`
Comprehensive code quality assessment.

```javascript
const quality = await claude.checkQuality();
// Returns: {
//   typescript: { errors: 0, clean: true },
//   lint: { errors: 5, warnings: 12, fixable: true },
//   build: { success: true, time: 2660, size: "1.2M" }
// }
```

##### `checkTypeScript()`
TypeScript compilation check.

```javascript
const ts = await claude.checkTypeScript();
// Returns: { errors: 0, clean: true, output: null }
```

##### `checkLint()`
Linting analysis.

```javascript
const lint = await claude.checkLint();
// Returns: { errors: 5, warnings: 12, fixable: true }
```

##### `checkBuild()`
Build process validation.

```javascript
const build = await claude.checkBuild();
// Returns: { success: true, time: 2660, size: "1.2M" }
```

#### Auto-Fix

##### `autoFix()`
Attempt to fix common issues automatically.

```javascript
const fixes = await claude.autoFix();
// Returns: ["Fixed lint errors", "Updated dependencies"]
```

## Terminal Monitoring API

### Starting Monitoring

##### `startMonitoring(options)`
Start real-time terminal monitoring.

```javascript
await claude.startMonitoring({
  interval: 5000,  // Check every 5 seconds
  logFiles: ['dev-server', 'build', 'test', 'convex'],
  watchProcesses: true,
  watchNetwork: true,
  autoRestart: false
});
```

**Options:**
- `interval` (number) - Monitoring frequency in milliseconds
- `logFiles` (string[]) - Log files to monitor
- `watchProcesses` (boolean) - Enable process monitoring
- `watchNetwork` (boolean) - Enable network monitoring
- `autoRestart` (boolean) - Auto-restart crashed processes

##### `stopMonitoring()`
Stop all monitoring activities.

```javascript
await claude.stopMonitoring();
```

##### `getMonitoringStatus()`
Get current monitoring state.

```javascript
const status = claude.getMonitoringStatus();
// Returns: {
//   active: true,
//   logWatchers: ['dev-server', 'build'],
//   processMonitor: true,
//   events: true
// }
```

### Log Management

##### `startLogWatcher(logName)`
Watch a specific log file.

```javascript
const watcher = await claude.startLogWatcher('dev-server');
// Returns: ChildProcess for tail -f
```

##### `analyzeLogEntry(logEntry)`
Analyze log content for important events.

```javascript
claude.analyzeLogEntry({
  source: 'dev-server',
  content: 'Error: Type string is not assignable to number',
  timestamp: Date.now()
});
// Emits appropriate events based on content
```

##### `parseLogLine(line)`
Parse individual log lines for semantic meaning.

```javascript
const analysis = claude.parseLogLine('Error: Build failed');
// Returns: {
//   type: 'error',
//   message: 'Error: Build failed',
//   severity: 'error'
// }
```

### Process Monitoring

##### `captureDevServerOutput(command)`
Start dev server with output capture.

```javascript
const process = await claude.captureDevServerOutput('npm run dev');
// Starts process and monitors output
```

## Event System

The ClaudeAuto class extends EventEmitter and emits the following events:

### Monitoring Events

```javascript
claude.on('monitoring:started', (data) => {
  // { logFiles, interval, timestamp }
});

claude.on('monitoring:stopped', (data) => {
  // { timestamp }
});

claude.on('monitoring:error', (data) => {
  // { message, error, timestamp }
});
```

### Process Events

```javascript
claude.on('process:crashed', (event) => {
  // { type: 'process:crashed', process, pid }
});

claude.on('process:started', (event) => {
  // { type: 'process:started', process, pid }
});
```

### Terminal Events

```javascript
claude.on('terminal:error', (event) => {
  // { source, message, line, timestamp }
});

claude.on('terminal:warning', (event) => {
  // { source, message, line, timestamp }
});

claude.on('terminal:success', (event) => {
  // { source, message, line, timestamp }
});

claude.on('terminal:url', (event) => {
  // { source, url, line, timestamp }
});
```

### Network Events

```javascript
claude.on('network:down', (event) => {
  // { type: 'network:down', endpoint, port }
});

claude.on('network:up', (event) => {
  // { type: 'network:up', endpoint, port }
});
```

### State Change Events

```javascript
claude.on('state:changed', (event) => {
  // { changes, before, after, timestamp }
});
```

### Log Events

```javascript
claude.on('log:entry', (logEntry) => {
  // { source, content, timestamp }
});

claude.on('log:error', (error) => {
  // { source, error, timestamp }
});

claude.on('log:watcher:closed', (data) => {
  // { source, code }
});
```

## Framework Detection API

### Monorepo Analysis

##### `detectMonorepoStructure()`
Analyze monorepo structure and frameworks.

```javascript
const structure = await claude.detectMonorepoStructure();
// Returns: {
//   type: 'monorepo',
//   tool: 'turbo',
//   workspaces: [...],
//   frameworks: {...},
//   rootPackage: {...}
// }
```

##### `findWorkspaces(patterns)`
Find workspace packages from patterns.

```javascript
const workspaces = await claude.findWorkspaces(['apps/*', 'packages/*']);
// Returns array of workspace objects
```

##### `detectFrameworks(structure)`
Detect frameworks across all workspaces.

```javascript
const frameworks = await claude.detectFrameworks(structure);
// Returns: {
//   astro: [...],
//   vite: [...],
//   next: [...],
//   convex: [...],
//   react: [...],
//   vue: [...],
//   svelte: [...]
// }
```

## Convex Integration API

##### `getConvexStatus()`
Check Convex project status.

```javascript
const status = await claude.getConvexStatus();
// Returns: {
//   available: true,
//   authenticated: true,
//   deployment: 'dev',
//   localMode: true,
//   cloudMode: false
// }
```

##### `watchConvexLogs(options)`
Stream Convex logs.

```javascript
// Get recent logs
const logs = await claude.watchConvexLogs({ lines: 20 });

// Follow logs continuously
const logProcess = await claude.watchConvexLogs({ follow: true });
```

##### `parseConvexLogs(logOutput)`
Parse Convex log format.

```javascript
const logs = claude.parseConvexLogs(rawOutput);
// Returns array of structured log objects
```

## Utility Methods

##### `init()`
Initialize .claude directory structure.

```javascript
await claude.init();
// Creates directories and monitoring scripts
```

##### `extractPort(command)`
Extract port from command string.

```javascript
const port = claude.extractPort('npm run dev --port=3000');
// Returns: '3000'
```

##### `calculateReadiness(processes, network, quality, git)`
Calculate development readiness score.

```javascript
const readiness = claude.calculateReadiness(processes, network, quality, git);
// Returns: {
//   score: 85,
//   level: 'partial',
//   issues: ['3 lint errors'],
//   critical: []
// }
```

## Cache Management

##### `getCache(key)`
Retrieve cached data.

```javascript
const cached = claude.getCache('env_scan');
// Returns cached data or null
```

##### `setCache(key, data, timeout)`
Store data in cache.

```javascript
claude.setCache('build_result', buildData, 60000); // Cache for 1 minute
```

## Error Handling

All async methods can throw errors. Use try-catch blocks:

```javascript
try {
  const env = await claude.scan();
} catch (error) {
  console.error('Environment scan failed:', error.message);
}
```

## TypeScript Support

The package includes TypeScript definitions. Import like this:

```typescript
import ClaudeAuto from 'claude-autonomous-dev';

const claude = new ClaudeAuto();
```

## CLI Integration

All API methods are accessible via CLI commands:

```bash
# API: claude.scan()
claude-auto scan

# API: claude.startMonitoring()
claude-auto monitor start

# API: claude.getConvexStatus()
claude-auto convex status
```

This API provides complete programmatic access to all autonomous development capabilities.