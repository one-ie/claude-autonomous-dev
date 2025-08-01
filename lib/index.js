#!/usr/bin/env node

/**
 * Claude Autonomous Development Framework - Lightweight Core
 * Optimized for performance, accuracy, and minimal dependencies
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const EventEmitter = require('events');

const execAsync = promisify(exec);

class ClaudeAuto extends EventEmitter {
  constructor(projectPath = process.cwd()) {
    super();
    this.projectPath = projectPath;
    this.claudePath = path.join(projectPath, '.claude');
    
    // Cache for performance
    this.cache = new Map();
    this.cacheTimeout = 5000; // 5 seconds
    
    // Monorepo and framework detection
    this.workspaces = null;
    this.frameworks = null;
    this.monorepoType = null;
    
    // Terminal monitoring
    this.monitoring = false;
    this.logWatchers = new Map();
    this.processMonitor = null;
    this.lastKnownState = null;
  }

  /**
   * Fast environment scan with intelligent caching
   */
  async scan() {
    const cacheKey = 'env_scan';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const [monorepo, processes, network, quality, git] = await Promise.all([
      this.detectMonorepoStructure(),
      this.scanProcesses(),
      this.checkNetwork(),
      this.checkQuality(),
      this.getGitStatus()
    ]);

    const result = {
      timestamp: Date.now(),
      monorepo,
      processes,
      network,
      quality,
      git,
      readiness: this.calculateReadiness(processes, network, quality, git)
    };

    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * Detect monorepo structure and frameworks
   */
  async detectMonorepoStructure() {
    const cacheKey = 'monorepo_structure';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const structure = {
      type: 'single',
      tool: null,
      workspaces: [],
      frameworks: {},
      rootPackage: null
    };

    try {
      // Check for Turbo monorepo
      if (fs.existsSync(path.join(this.projectPath, 'turbo.json'))) {
        structure.type = 'monorepo';
        structure.tool = 'turbo';
        structure.turboConfig = await this.parseTurboConfig();
      }

      // Check for npm/yarn workspaces
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        structure.rootPackage = packageJson;

        if (packageJson.workspaces) {
          structure.type = 'monorepo';
          if (!structure.tool) structure.tool = 'npm-workspaces';
          structure.workspaces = await this.findWorkspaces(packageJson.workspaces);
        }
      }

      // Detect frameworks in each workspace/package
      structure.frameworks = await this.detectFrameworks(structure);

      this.setCache(cacheKey, structure, 30000); // Cache for 30 seconds
      return structure;
    } catch (error) {
      console.warn('Failed to detect monorepo structure:', error.message);
      return structure;
    }
  }

  async parseTurboConfig() {
    try {
      const turboPath = path.join(this.projectPath, 'turbo.json');
      const turboConfig = JSON.parse(fs.readFileSync(turboPath, 'utf8'));
      return turboConfig;
    } catch (error) {
      return {};
    }
  }

  async findWorkspaces(workspacePatterns) {
    const workspaces = [];
    
    try {
      if (Array.isArray(workspacePatterns)) {
        for (const pattern of workspacePatterns) {
          const { stdout } = await execAsync(`find ${this.projectPath} -path "*/${pattern}/package.json" -type f 2>/dev/null || echo ""`);
          const packagePaths = stdout.trim().split('\n').filter(line => line && line !== '');
          
          for (const packagePath of packagePaths) {
            const workspaceDir = path.dirname(packagePath);
            const relativePath = path.relative(this.projectPath, workspaceDir);
            
            if (relativePath && !relativePath.includes('node_modules')) {
              workspaces.push({
                name: path.basename(workspaceDir),
                path: relativePath,
                fullPath: workspaceDir,
                packageJson: JSON.parse(fs.readFileSync(packagePath, 'utf8'))
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to find workspaces:', error.message);
    }

    return workspaces;
  }

  async detectFrameworks(structure) {
    const frameworks = {
      astro: [],
      vite: [],
      next: [],
      convex: [],
      react: [],
      vue: [],
      svelte: []
    };

    const packagesToCheck = structure.workspaces.length > 0 
      ? structure.workspaces 
      : [{ path: '.', fullPath: this.projectPath, packageJson: structure.rootPackage }];

    for (const pkg of packagesToCheck) {
      const pkgFrameworks = await this.detectPackageFrameworks(pkg);
      
      // Merge frameworks
      Object.keys(pkgFrameworks).forEach(framework => {
        if (pkgFrameworks[framework]) {
          frameworks[framework].push({
            workspace: pkg.name || 'root',
            path: pkg.path,
            ...pkgFrameworks[framework]
          });
        }
      });
    }

    return frameworks;
  }

  async detectPackageFrameworks(pkg) {
    const frameworks = {};
    const packageJson = pkg.packageJson || {};
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const scripts = packageJson.scripts || {};

    // Astro detection
    if (dependencies.astro || fs.existsSync(path.join(pkg.fullPath, 'astro.config.mjs')) || fs.existsSync(path.join(pkg.fullPath, 'astro.config.ts'))) {
      frameworks.astro = {
        version: dependencies.astro,
        devScript: this.findScript(scripts, ['dev', 'start']),
        buildScript: this.findScript(scripts, ['build']),
        configFile: this.findAstroConfig(pkg.fullPath)
      };
    }

    // Vite detection
    if (dependencies.vite || fs.existsSync(path.join(pkg.fullPath, 'vite.config.js')) || fs.existsSync(path.join(pkg.fullPath, 'vite.config.ts'))) {
      frameworks.vite = {
        version: dependencies.vite,
        devScript: this.findScript(scripts, ['dev', 'serve']),
        buildScript: this.findScript(scripts, ['build']),
        configFile: this.findViteConfig(pkg.fullPath)
      };
    }

    // Next.js detection
    if (dependencies.next) {
      frameworks.next = {
        version: dependencies.next,
        devScript: this.findScript(scripts, ['dev']),
        buildScript: this.findScript(scripts, ['build'])
      };
    }

    // Convex detection
    if (dependencies.convex || fs.existsSync(path.join(pkg.fullPath, 'convex'))) {
      frameworks.convex = {
        version: dependencies.convex,
        hasConfig: this.hasConvexConfig(pkg.fullPath),
        configType: this.getConvexConfigType(pkg.fullPath)
      };
    }

    // React detection
    if (dependencies.react) {
      frameworks.react = {
        version: dependencies.react,
        typescript: !!dependencies.typescript
      };
    }

    return frameworks;
  }

  findScript(scripts, names) {
    for (const name of names) {
      if (scripts[name]) return scripts[name];
    }
    return null;
  }

  findAstroConfig(basePath) {
    const configs = ['astro.config.mjs', 'astro.config.ts', 'astro.config.js'];
    for (const config of configs) {
      if (fs.existsSync(path.join(basePath, config))) return config;
    }
    return null;
  }

  findViteConfig(basePath) {
    const configs = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs'];
    for (const config of configs) {
      if (fs.existsSync(path.join(basePath, config))) return config;
    }
    return null;
  }

  hasConvexConfig(basePath) {
    const configs = ['convex.json', 'convex.config.ts', 'convex.config.js'];
    return configs.some(config => fs.existsSync(path.join(basePath, config)));
  }

  getConvexConfigType(basePath) {
    if (fs.existsSync(path.join(basePath, 'convex.config.ts'))) return 'typescript';
    if (fs.existsSync(path.join(basePath, 'convex.config.js'))) return 'javascript';
    if (fs.existsSync(path.join(basePath, 'convex.json'))) return 'json';
    return null;
  }

  /**
   * Enhanced process detection with monorepo support
   */
  async scanProcesses() {
    try {
      // Enhanced command to detect more frameworks and tools
      const { stdout } = await execAsync(`ps aux | grep -E "(npm.*dev|yarn.*dev|pnpm.*dev|turbo.*dev|vite|astro|next|convex|webpack)" | grep -v grep | head -15`);
      
      const processes = {};
      const lines = stdout.trim().split('\n').filter(line => line.length > 0);
      
      for (const line of lines) {
        const parts = line.split(/\s+/);
        const pid = parts[1];
        const command = parts.slice(10).join(' ');
        
        // Turbo detection
        if (command.includes('turbo') && command.includes('dev')) {
          processes.turbo = { pid, status: 'running', type: 'monorepo-dev', command: command.trim() };
        }
        
        // Astro detection
        else if (command.includes('astro') && command.includes('dev')) {
          processes.astro = { pid, status: 'running', port: this.extractPort(command) || '4321', type: 'astro-dev' };
        }
        
        // Enhanced Vite detection
        else if (command.includes('vite') || (command.includes('npm') && command.includes('dev') && !command.includes('next'))) {
          const port = this.extractPort(command) || '5173';
          processes.vite = { pid, status: 'running', port, type: 'vite-dev' };
        }
        
        // Next.js detection
        else if (command.includes('next') || (command.includes('npm') && command.includes('dev') && command.includes('next'))) {
          processes.next = { pid, status: 'running', port: '3000', type: 'next-dev' };
        }
        
        // Convex detection
        else if (command.includes('convex')) {
          const convexType = command.includes('convex dev') ? 'local' : 'cloud';
          processes.convex = { pid, status: 'running', port: '3210', type: convexType };
        }
        
        // Generic dev server fallback
        else if (command.includes('dev') && (command.includes('npm') || command.includes('yarn') || command.includes('pnpm'))) {
          processes.dev = { pid, status: 'running', port: this.extractPort(command) || 'unknown', type: 'generic-dev' };
        }
      }
      
      return processes;
    } catch (error) {
      return {};
    }
  }

  /**
   * Enhanced network health check with framework-aware endpoints
   */
  async checkNetwork() {
    const endpoints = [
      { name: 'astro', port: 4321, framework: 'astro' },
      { name: 'vite', port: 5173, framework: 'vite' },
      { name: 'next', port: 3000, framework: 'next' },
      { name: 'react', port: 3000, framework: 'react' },
      { name: 'convex', port: 3210, framework: 'convex' },
      { name: 'dev-alt', port: 8080, framework: 'generic' },
      { name: 'dev-alt2', port: 4000, framework: 'generic' }
    ];

    const checks = endpoints.map(async endpoint => {
      try {
        const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${endpoint.port} --max-time 1`);
        const statusCode = stdout.trim();
        return [endpoint.name, { 
          port: endpoint.port, 
          status: statusCode, 
          healthy: ['200', '404'].includes(statusCode),
          framework: endpoint.framework
        }];
      } catch {
        return [endpoint.name, { 
          port: endpoint.port, 
          status: 'offline', 
          healthy: false,
          framework: endpoint.framework
        }];
      }
    });

    const results = await Promise.all(checks);
    return Object.fromEntries(results);
  }

  /**
   * Fast code quality assessment
   */
  async checkQuality() {
    const [typescript, lint, build] = await Promise.all([
      this.checkTypeScript(),
      this.checkLint(),
      this.checkBuild()
    ]);

    return { typescript, lint, build };
  }

  async checkTypeScript() {
    try {
      const { stdout, stderr } = await execAsync('npx tsc --noEmit --skipLibCheck 2>&1', { timeout: 10000 });
      const output = stdout + stderr;
      const errors = (output.match(/error TS\d+/g) || []).length;
      return { errors, clean: errors === 0, output: errors > 0 ? output.split('\n').slice(0, 5).join('\n') : null };
    } catch (error) {
      return { errors: -1, clean: false, error: 'TypeScript check failed' };
    }
  }

  async checkLint() {
    try {
      const { stdout, stderr } = await execAsync('npm run lint 2>&1', { timeout: 10000 });
      const output = stdout + stderr;
      const errors = (output.match(/error/gi) || []).length;
      const warnings = (output.match(/warning/gi) || []).length;
      return { errors, warnings, fixable: output.includes('fixable') };
    } catch (error) {
      return { errors: 0, warnings: 0, fixable: false, available: false };
    }
  }

  async checkBuild() {
    const cacheKey = 'build_check';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const startTime = Date.now();
      const { stdout, stderr } = await execAsync('npm run build 2>&1', { timeout: 30000 });
      const output = stdout + stderr;
      const success = !output.toLowerCase().includes('failed') && !output.toLowerCase().includes('error');
      const time = Date.now() - startTime;
      
      const result = { success, time, size: await this.getBuildSize() };
      this.setCache(cacheKey, result, 60000); // Cache for 1 minute
      return result;
    } catch (error) {
      return { success: false, error: 'Build failed or timed out' };
    }
  }

  async getBuildSize() {
    try {
      const dirs = ['dist', 'build', '.next'];
      for (const dir of dirs) {
        if (fs.existsSync(path.join(this.projectPath, dir))) {
          const { stdout } = await execAsync(`du -sh ${dir} 2>/dev/null | cut -f1`);
          return stdout.trim();
        }
      }
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Git status with minimal overhead
   */
  async getGitStatus() {
    try {
      const [branch, status] = await Promise.all([
        execAsync('git branch --show-current 2>/dev/null').then(r => r.stdout.trim()).catch(() => 'unknown'),
        execAsync('git status --porcelain 2>/dev/null').then(r => r.stdout.trim()).catch(() => '')
      ]);

      const changedFiles = status ? status.split('\n').filter(line => line.trim()).length : 0;
      return { branch, changedFiles, clean: changedFiles === 0 };
    } catch {
      return { branch: 'unknown', changedFiles: 0, clean: true, available: false };
    }
  }

  /**
   * Intelligent readiness calculation
   */
  calculateReadiness(processes, network, quality, git) {
    let score = 0;
    const issues = [];

    // TypeScript (40% weight)
    if (quality.typescript.clean) {
      score += 40;
    } else if (quality.typescript.errors > 0) {
      issues.push(`${quality.typescript.errors} TypeScript errors`);
    }

    // Build (30% weight)
    if (quality.build.success) {
      score += 30;
    } else {
      issues.push('Build failing');
    }

    // Lint (20% weight)
    if (quality.lint.errors === 0) {
      score += 20;
    } else if (quality.lint.errors < 10) {
      score += 10;
      if (quality.lint.fixable) issues.push(`${quality.lint.errors} fixable lint errors`);
    } else {
      issues.push(`${quality.lint.errors} lint errors`);
    }

    // Development environment (10% weight)
    const hasRunningDev = Object.keys(processes).length > 0;
    const hasHealthyNetwork = Object.values(network).some(n => n.healthy);
    if (hasRunningDev && hasHealthyNetwork) score += 10;

    const level = score >= 90 ? 'ready' : score >= 70 ? 'partial' : 'not-ready';
    return { score, level, issues, critical: issues.filter(i => i.includes('TypeScript') || i.includes('Build')) };
  }

  /**
   * Enhanced status for CLI display with monorepo support
   */
  async status() {
    const env = await this.scan();
    const status = {};

    // Monorepo information
    if (env.monorepo.type === 'monorepo') {
      status.project = `${env.monorepo.tool} monorepo (${env.monorepo.workspaces.length} workspaces)`;
    } else {
      status.project = 'Single package';
    }

    // Framework detection
    const activeFrameworks = [];
    Object.keys(env.monorepo.frameworks).forEach(framework => {
      if (env.monorepo.frameworks[framework].length > 0) {
        activeFrameworks.push(`${framework}(${env.monorepo.frameworks[framework].length})`);
      }
    });
    if (activeFrameworks.length > 0) {
      status.frameworks = activeFrameworks.join(', ');
    }

    // Process status with enhanced detection
    const processes = [];
    Object.entries(env.processes).forEach(([name, process]) => {
      if (name === 'turbo') {
        processes.push(`Turbo dev (PID: ${process.pid})`);
      } else if (name === 'astro') {
        processes.push(`Astro:${process.port} (PID: ${process.pid})`);
      } else if (name === 'vite') {
        processes.push(`Vite:${process.port} (PID: ${process.pid})`);
      } else if (name === 'next') {
        processes.push(`Next:${process.port} (PID: ${process.pid})`);
      } else if (name === 'convex') {
        processes.push(`Convex:${process.port} (PID: ${process.pid}, ${process.type})`);
      } else {
        processes.push(`${name}:${process.port || '?'} (PID: ${process.pid})`);
      }
    });
    status.processes = processes.length > 0 ? processes.join(', ') : 'None running';

    // Enhanced Convex status
    let convexStatus = 'Not detected';
    if (env.processes.convex) {
      const convexType = env.processes.convex.type || 'unknown';
      convexStatus = `Running (PID: ${env.processes.convex.pid}, ${convexType})`;
    } else {
      // Check if Convex project exists but not running
      try {
        const convexProjectStatus = await this.getConvexStatus();
        if (convexProjectStatus.available) {
          convexStatus = 'Project detected (not running)';
        }
      } catch (error) {
        // Keep default status
      }
    }
    
    // Network health with framework awareness
    const healthyEndpoints = [];
    Object.entries(env.network).forEach(([name, endpoint]) => {
      if (endpoint.healthy) {
        healthyEndpoints.push(`${name}:${endpoint.port}`);
      }
    });
    status.network = healthyEndpoints.length > 0 ? 
      `Healthy (${healthyEndpoints.join(', ')})` : 'All offline';

    // Standard quality checks
    status.readiness = `${env.readiness.score}% (${env.readiness.level})`;
    status.convex = convexStatus;
    status.typescript = env.quality.typescript.clean ? 'Clean' : `${env.quality.typescript.errors} errors`;
    status.lint = `${env.quality.lint.errors} errors, ${env.quality.lint.warnings} warnings`;
    status.build = env.quality.build.success ? 
      `Success (${env.quality.build.size}, ${env.quality.build.time}ms)` : 
      'Failed';
    status.git = env.git.clean ? 'Clean' : `${env.git.changedFiles} files changed`;

    return status;
  }

  /**
   * Check if safe to start development servers
   */
  async canStart() {
    const processes = await this.scanProcesses();
    return Object.keys(processes).length === 0;
  }

  /**
   * Auto-fix common issues
   */
  async autoFix() {
    const fixes = [];
    const quality = await this.checkQuality();

    // Auto-fix lint if possible
    if (quality.lint.fixable && quality.lint.errors > 0) {
      try {
        await execAsync('npm run lint -- --fix');
        fixes.push('Fixed lint errors');
      } catch (error) {
        fixes.push('Attempted lint fix (some errors may remain)');
      }
    }

    return fixes;
  }

  /**
   * Convex-specific functionality
   */
  async getConvexStatus() {
    try {
      // Check if convex config exists (convex.json or convex.config.ts/js)
      const possibleConfigs = ['convex.json', 'convex.config.ts', 'convex.config.js'];
      const hasConvexConfig = possibleConfigs.some(config => 
        fs.existsSync(path.join(this.projectPath, config))
      );
      
      // Also check for convex directory
      const hasConvexDir = fs.existsSync(path.join(this.projectPath, 'convex'));
      
      if (!hasConvexConfig && !hasConvexDir) {
        return { available: false, reason: 'No Convex configuration found' };
      }

      // Get Convex deployment info
      const { stdout: statusOutput } = await execAsync('npx convex status 2>/dev/null || echo "not-authenticated"', { timeout: 5000 });
      
      const status = {
        available: true,
        authenticated: !statusOutput.includes('not-authenticated'),
        deployment: this.extractConvexDeployment(statusOutput),
        localMode: statusOutput.includes('local'),
        cloudMode: statusOutput.includes('prod') || statusOutput.includes('dev')
      };

      return status;
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  async watchConvexLogs(options = {}) {
    const { lines = 20, follow = false, deployment = 'dev' } = options;
    
    try {
      const convexStatus = await this.getConvexStatus();
      if (!convexStatus.available) {
        throw new Error('Convex not available in this project');
      }

      if (!convexStatus.authenticated) {
        throw new Error('Not authenticated with Convex. Run: npx convex login');
      }

      const command = follow 
        ? `npx convex logs --tail`
        : `npx convex logs --lines ${lines}`;

      if (follow) {
        // Return a spawned process for continuous monitoring
        const logProcess = spawn('npx', ['convex', 'logs', '--tail'], {
          stdio: ['pipe', 'pipe', 'pipe'],
          cwd: this.projectPath
        });

        return logProcess;
      } else {
        // Return recent logs
        const { stdout } = await execAsync(command, { timeout: 10000 });
        return this.parseConvexLogs(stdout);
      }
    } catch (error) {
      throw new Error(`Failed to get Convex logs: ${error.message}`);
    }
  }

  parseConvexLogs(logOutput) {
    const lines = logOutput.split('\n').filter(line => line.trim());
    const logs = [];

    for (const line of lines) {
      // Parse Convex log format: timestamp [level] function: message
      const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\s+\[(\w+)\]\s+(.+?):\s+(.+)$/);
      if (match) {
        const [, timestamp, level, functionName, message] = match;
        logs.push({
          timestamp: new Date(timestamp),
          level: level.toLowerCase(),
          function: functionName,
          message: message.trim(),
          raw: line
        });
      } else {
        // Fallback for non-standard log lines
        logs.push({
          timestamp: new Date(),
          level: 'info',
          function: 'system',
          message: line.trim(),
          raw: line
        });
      }
    }

    return logs;
  }

  extractConvexDeployment(statusOutput) {
    const match = statusOutput.match(/deployment:\s*([^\s]+)/i);
    return match ? match[1] : 'unknown';
  }

  async getConvexFunctions() {
    try {
      const { stdout } = await execAsync('npx convex list functions --json 2>/dev/null', { timeout: 5000 });
      return JSON.parse(stdout);
    } catch (error) {
      return [];
    }
  }

  /**
   * Performance-optimized caching
   */
  getCache(key) {
    const entry = this.cache.get(key);
    if (entry) {
      const timeout = entry.timeout || this.cacheTimeout;
      if (Date.now() - entry.timestamp < timeout) {
        return entry.data;
      }
      this.cache.delete(key);
    }
    return null;
  }

  setCache(key, data, timeout = this.cacheTimeout) {
    this.cache.set(key, { data, timestamp: Date.now(), timeout });
    
    // Clean up old cache entries
    if (this.cache.size > 10) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Extract port from command string (enhanced for multiple frameworks)
   */
  extractPort(command) {
    // Look for explicit port specification
    const portMatch = command.match(/(?:--port|port|PORT)[\s=:]+(\d+)/);
    if (portMatch) return portMatch[1];
    
    // Framework-specific default ports
    if (command.includes('astro')) return '4321';
    if (command.includes('vite')) return '5173';
    if (command.includes('next')) return '3000';
    if (command.includes('react') && !command.includes('next')) return '3000';
    if (command.includes('convex')) return '3210';
    if (command.includes('nuxt')) return '3000';
    if (command.includes('svelte')) return '5173';
    if (command.includes('vue')) return '8080';
    
    return 'unknown';
  }

  /**
   * Create complete .claude directory structure for terminal monitoring
   */
  async init() {
    const dirs = [
      this.claudePath, 
      path.join(this.claudePath, 'logs'),
      path.join(this.claudePath, 'scripts'),
      path.join(this.claudePath, 'status'),
      path.join(this.claudePath, 'analysis')
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Create minimal interface script
    const interfaceScript = path.join(this.claudePath, 'claude');
    if (!fs.existsSync(interfaceScript)) {
      const script = `#!/bin/bash
node -e "
const ClaudeAuto = require('${path.join(__dirname, 'index.js')}');
const claude = new ClaudeAuto();

async function run() {
  const cmd = process.argv[2];
  
  switch(cmd) {
    case 'status':
      const status = await claude.status();
      console.log('🤖 CLAUDE AUTO STATUS');
      console.log('====================');
      Object.entries(status).forEach(([k,v]) => console.log(\`\${k}: \${v}\`));
      break;
    case 'scan':
      console.log(JSON.stringify(await claude.scan(), null, 2));
      break;
    case 'ready':
      const env = await claude.scan();
      console.log(env.readiness.level === 'ready' ? '✅ READY' : \`⚠️ \${env.readiness.level.toUpperCase()}: \${env.readiness.issues.join(', ')}\`);
      break;
    case 'fix':
      const fixes = await claude.autoFix();
      console.log(fixes.length ? fixes.join(', ') : 'No fixes needed');
      break;
    default:
      console.log('Usage: ./claude [status|scan|ready|fix]');
  }
}

run().catch(console.error);
" $@`;
      
      fs.writeFileSync(interfaceScript, script);
      fs.chmodSync(interfaceScript, '755');
    }

    // Create monitoring scripts
    await this.createMonitoringScripts();
    
    return true;
  }

  /**
   * REAL-TIME TERMINAL MONITORING SYSTEM
   * Implements the vision from docs/auto.md
   */
  
  /**
   * Start continuous terminal monitoring
   */
  async startMonitoring(options = {}) {
    if (this.monitoring) {
      throw new Error('Monitoring already active');
    }
    
    const {
      interval = 5000,  // Check every 5 seconds
      logFiles = ['dev-server', 'build', 'test', 'convex'],
      watchProcesses = true,
      watchNetwork = true,
      autoRestart = false
    } = options;
    
    this.monitoring = true;
    console.log('🤖 Starting autonomous terminal monitoring...');
    
    try {
      // Start log file monitoring
      for (const logName of logFiles) {
        await this.startLogWatcher(logName);
      }
      
      // Start process monitoring
      if (watchProcesses) {
        this.startProcessMonitoring(interval);
      }
      
      // Start network monitoring
      if (watchNetwork) {
        this.startNetworkMonitoring(interval);
      }
      
      // Capture initial state
      this.lastKnownState = await this.scan();
      
      this.emit('monitoring:started', {
        logFiles,
        interval,
        timestamp: Date.now()
      });
      
      console.log('✅ Terminal monitoring active - Claude can now see real-time changes');
      
    } catch (error) {
      this.monitoring = false;
      throw error;
    }
  }
  
  /**
   * Stop all monitoring
   */
  async stopMonitoring() {
    if (!this.monitoring) {
      return;
    }
    
    this.monitoring = false;
    
    // Stop all log watchers
    for (const [logName, watcher] of this.logWatchers) {
      if (watcher && watcher.kill) {
        watcher.kill();
      }
    }
    this.logWatchers.clear();
    
    // Stop process monitor
    if (this.processMonitor) {
      clearInterval(this.processMonitor);
      this.processMonitor = null;
    }
    
    this.emit('monitoring:stopped', { timestamp: Date.now() });
    console.log('🛑 Terminal monitoring stopped');
  }
  
  /**
   * Start watching a specific log file
   */
  async startLogWatcher(logName) {
    const logPath = path.join(this.claudePath, 'logs', `${logName}.log`);
    
    // Ensure log file exists
    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, '');
    }
    
    // Start tail -f process
    const tailProcess = spawn('tail', ['-f', logPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    tailProcess.stdout.on('data', (data) => {
      const logEntry = {
        source: logName,
        content: data.toString(),
        timestamp: Date.now()
      };
      
      // Analyze log content
      this.analyzeLogEntry(logEntry);
      
      // Emit for real-time processing
      this.emit('log:entry', logEntry);
    });
    
    tailProcess.stderr.on('data', (data) => {
      this.emit('log:error', {
        source: logName,
        error: data.toString(),
        timestamp: Date.now()
      });
    });
    
    tailProcess.on('close', (code) => {
      this.logWatchers.delete(logName);
      this.emit('log:watcher:closed', { source: logName, code });
    });
    
    this.logWatchers.set(logName, tailProcess);
    return tailProcess;
  }
  
  /**
   * Analyze log entries for important events
   */
  analyzeLogEntry(logEntry) {
    const { source, content } = logEntry;
    const lines = content.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const analysis = this.parseLogLine(line);
      
      if (analysis.type === 'error') {
        this.emit('terminal:error', {
          source,
          message: analysis.message,
          line,
          timestamp: Date.now()
        });
      } else if (analysis.type === 'warning') {
        this.emit('terminal:warning', {
          source,
          message: analysis.message,
          line,
          timestamp: Date.now()
        });
      } else if (analysis.type === 'success') {
        this.emit('terminal:success', {
          source,
          message: analysis.message,
          line,
          timestamp: Date.now()
        });
      } else if (analysis.type === 'url') {
        this.emit('terminal:url', {
          source,
          url: analysis.url,
          line,
          timestamp: Date.now()
        });
      }
    }
  }
  
  /**
   * Parse individual log lines for semantic meaning
   */
  parseLogLine(line) {
    const lowerLine = line.toLowerCase();
    
    // Error detection
    if (/error|failed|exception|fatal|crash/i.test(line)) {
      return {
        type: 'error',
        message: line.trim(),
        severity: /fatal|crash/i.test(line) ? 'critical' : 'error'
      };
    }
    
    // Warning detection
    if (/warn|warning|deprecated/i.test(line)) {
      return {
        type: 'warning',
        message: line.trim(),
        severity: 'warning'
      };
    }
    
    // Success detection
    if (/success|compiled|ready|listening|started|built|complete/i.test(line)) {
      return {
        type: 'success',
        message: line.trim()
      };
    }
    
    // URL detection
    const urlMatch = line.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return {
        type: 'url',
        url: urlMatch[0],
        message: line.trim()
      };
    }
    
    return {
      type: 'info',
      message: line.trim()
    };
  }
  
  /**
   * Start continuous process monitoring
   */
  startProcessMonitoring(interval) {
    this.processMonitor = setInterval(async () => {
      try {
        const currentState = await this.scan();
        
        if (this.lastKnownState) {
          // Detect changes in processes
          const changes = this.detectStateChanges(this.lastKnownState, currentState);
          
          if (changes.length > 0) {
            this.emit('state:changed', {
              changes,
              before: this.lastKnownState,
              after: currentState,
              timestamp: Date.now()
            });
            
            // Handle critical changes
            for (const change of changes) {
              if (change.type === 'process:crashed') {
                this.emit('process:crashed', change);
              } else if (change.type === 'process:started') {
                this.emit('process:started', change);
              } else if (change.type === 'network:down') {
                this.emit('network:down', change);
              } else if (change.type === 'network:up') {
                this.emit('network:up', change);
              }
            }
          }
        }
        
        this.lastKnownState = currentState;
        
      } catch (error) {
        this.emit('monitoring:error', {
          message: 'Process monitoring error',
          error: error.message,
          timestamp: Date.now()
        });
      }
    }, interval);
  }
  
  /**
   * Start network endpoint monitoring
   */
  startNetworkMonitoring(interval) {
    // Network monitoring is included in process monitoring
    // This method can be extended for more specific network checks
  }
  
  /**
   * Detect changes between environment states
   */
  detectStateChanges(before, after) {
    const changes = [];
    
    // Check process changes
    const beforeProcesses = Object.keys(before.processes || {});
    const afterProcesses = Object.keys(after.processes || {});
    
    // Processes that stopped
    for (const processName of beforeProcesses) {
      if (!afterProcesses.includes(processName)) {
        changes.push({
          type: 'process:crashed',
          process: processName,
          pid: before.processes[processName].pid
        });
      }
    }
    
    // Processes that started
    for (const processName of afterProcesses) {
      if (!beforeProcesses.includes(processName)) {
        changes.push({
          type: 'process:started',
          process: processName,
          pid: after.processes[processName].pid
        });
      }
    }
    
    // Check network changes
    if (before.network && after.network) {
      for (const [endpoint, beforeStatus] of Object.entries(before.network)) {
        const afterStatus = after.network[endpoint];
        
        if (beforeStatus.healthy && !afterStatus.healthy) {
          changes.push({
            type: 'network:down',
            endpoint,
            port: afterStatus.port
          });
        } else if (!beforeStatus.healthy && afterStatus.healthy) {
          changes.push({
            type: 'network:up',
            endpoint,
            port: afterStatus.port
          });
        }
      }
    }
    
    // Check readiness changes
    if (before.readiness && after.readiness) {
      if (before.readiness.level !== after.readiness.level) {
        changes.push({
          type: 'readiness:changed',
          from: before.readiness.level,
          to: after.readiness.level,
          score: after.readiness.score
        });
      }
    }
    
    return changes;
  }
  
  /**
   * Capture development server output to log file
   */
  async captureDevServerOutput(command = 'npm run dev') {
    const logPath = path.join(this.claudePath, 'logs', 'dev-server.log');
    
    // Start process with output capture
    const devProcess = spawn('bash', ['-c', `${command} 2>&1 | tee ${logPath}`], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: this.projectPath
    });
    
    // Monitor the log file
    await this.startLogWatcher('dev-server');
    
    return devProcess;
  }
  
  /**
   * Create monitoring and analysis scripts
   */
  async createMonitoringScripts() {
    const scriptsDir = path.join(this.claudePath, 'scripts');
    
    // Process checker script
    const processChecker = `#!/bin/bash

# Check development processes
DEV_PID=$(ps aux | grep "vite\|npm.*dev\|yarn.*dev" | grep -v grep | awk '{print $2}' | head -1)
CONVEX_PID=$(ps aux | grep "convex dev" | grep -v grep | awk '{print $2}' | head -1)
ASTRO_PID=$(ps aux | grep "astro.*dev" | grep -v grep | awk '{print $2}' | head -1)

echo "DEV_SERVER_STATUS=\$([ ! -z "\$DEV_PID" ] && echo "RUNNING:\$DEV_PID" || echo "STOPPED")"
echo "CONVEX_STATUS=\$([ ! -z "\$CONVEX_PID" ] && echo "RUNNING:\$CONVEX_PID" || echo "STOPPED")"
echo "ASTRO_STATUS=\$([ ! -z "\$ASTRO_PID" ] && echo "RUNNING:\$ASTRO_PID" || echo "STOPPED")"
echo "TIMESTAMP=\$(date '+%Y-%m-%d %H:%M:%S')"

# Check network endpoints
echo "FRONTEND_URL=\$(curl -s -o /dev/null -w "%{url_effective}" http://localhost:5173 2>/dev/null || echo "OFFLINE")"
echo "ASTRO_URL=\$(curl -s -o /dev/null -w "%{url_effective}" http://localhost:4321 2>/dev/null || echo "OFFLINE")"
echo "CONVEX_URL=\$(curl -s -o /dev/null -w "%{url_effective}" http://localhost:3210 2>/dev/null || echo "OFFLINE")"
`;
    
    fs.writeFileSync(path.join(scriptsDir, 'check-processes.sh'), processChecker);
    fs.chmodSync(path.join(scriptsDir, 'check-processes.sh'), '755');
    
    // Log analyzer script
    const logAnalyzer = `#!/bin/bash

LOGFILE="\$1"
ANALYSIS_DIR=".claude/analysis"
ANALYSIS_FILE="\$ANALYSIS_DIR/\$(basename \$LOGFILE .log)-analysis.txt"

mkdir -p "\$ANALYSIS_DIR"

echo "🔍 Analyzing \$LOGFILE..."

# Extract different types of messages
grep -i "error\|failed\|exception" "\$LOGFILE" > "\$ANALYSIS_FILE.errors" 2>/dev/null || touch "\$ANALYSIS_FILE.errors"
grep -i "warn\|warning" "\$LOGFILE" > "\$ANALYSIS_FILE.warnings" 2>/dev/null || touch "\$ANALYSIS_FILE.warnings"
grep -i "success\|compiled\|ready\|listening" "\$LOGFILE" > "\$ANALYSIS_FILE.success" 2>/dev/null || touch "\$ANALYSIS_FILE.success"
grep -oE "http://[^[:space:]]+" "\$LOGFILE" > "\$ANALYSIS_FILE.urls" 2>/dev/null || touch "\$ANALYSIS_FILE.urls"

# Generate summary
cat << SUMMARY > "\$ANALYSIS_FILE"
=== LOG ANALYSIS SUMMARY ===
Timestamp: \$(date)
Log File: \$LOGFILE

Errors Found: \$(wc -l < "\$ANALYSIS_FILE.errors")
Warnings Found: \$(wc -l < "\$ANALYSIS_FILE.warnings")
Success Messages: \$(wc -l < "\$ANALYSIS_FILE.success")

Latest Error:
\$(tail -1 "\$ANALYSIS_FILE.errors" 2>/dev/null || echo "None")

Latest Success:
\$(tail -1 "\$ANALYSIS_FILE.success" 2>/dev/null || echo "None")

Available URLs:
\$(cat "\$ANALYSIS_FILE.urls" 2>/dev/null || echo "None found")
SUMMARY

cat "\$ANALYSIS_FILE"
`;
    
    fs.writeFileSync(path.join(scriptsDir, 'analyze-logs.sh'), logAnalyzer);
    fs.chmodSync(path.join(scriptsDir, 'analyze-logs.sh'), '755');
  }
  
  /**
   * Get monitoring status
   */
  getMonitoringStatus() {
    return {
      active: this.monitoring,
      logWatchers: Array.from(this.logWatchers.keys()),
      processMonitor: !!this.processMonitor,
      events: this.listenerCount('terminal:error') > 0
    };
  }

}

module.exports = ClaudeAuto;

module.exports = ClaudeAuto;