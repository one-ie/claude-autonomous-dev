#!/usr/bin/env node

/**
 * Claude Autonomous Development Engine
 * Core environmental intelligence system
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class AutonomousEngine {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.claudePath = path.join(projectPath, '.claude');
    this.logsPath = path.join(this.claudePath, 'logs');
    this.statusPath = path.join(this.claudePath, 'status');
    this.analysisPath = path.join(this.claudePath, 'analysis');
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.claudePath, this.logsPath, this.statusPath, this.analysisPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Core environmental scanning - the heart of autonomous intelligence
   */
  async scanEnvironment() {
    const timestamp = Date.now();
    const result = {
      timestamp,
      readiness: await this.assessReadiness(),
      processes: await this.scanProcesses(),
      network: await this.checkNetworkHealth(),
      codeQuality: await this.analyzeCodeQuality(),
      git: await this.getGitStatus(),
      system: await this.getSystemMetrics(),
      recent: await this.getRecentActivity()
    };

    // Save snapshot for future reference
    const snapshotPath = path.join(this.statusPath, `snapshot-${timestamp}.json`);
    fs.writeFileSync(snapshotPath, JSON.stringify(result, null, 2));

    return result;
  }

  /**
   * Assess overall development readiness
   */
  async assessReadiness() {
    const checks = [];
    let score = 0;
    const issues = [];

    try {
      // Check TypeScript compilation
      const { stdout: tsOutput } = await execAsync('npx tsc --noEmit --skipLibCheck');
      const tsErrors = (tsOutput.match(/error TS/g) || []).length;
      checks.push({ name: 'TypeScript', score: tsErrors === 0 ? 100 : Math.max(0, 100 - tsErrors * 10) });
      if (tsErrors > 0) issues.push(`${tsErrors} TypeScript error(s)`);
    } catch (error) {
      checks.push({ name: 'TypeScript', score: 0 });
      issues.push('TypeScript compilation failed');
    }

    try {
      // Check linting
      const { stdout: lintOutput } = await execAsync('npm run lint 2>&1 || true');
      const lintErrors = (lintOutput.match(/error/gi) || []).length;
      const lintWarnings = (lintOutput.match(/warning/gi) || []).length;
      checks.push({ name: 'Lint', score: Math.max(0, 100 - lintErrors * 5 - lintWarnings * 2) });
      if (lintErrors > 0) issues.push(`${lintErrors} lint error(s)`);
    } catch (error) {
      checks.push({ name: 'Lint', score: 50 });
    }

    try {
      // Check build status
      const { stdout: buildOutput } = await execAsync('npm run build 2>&1 || true');
      const buildSuccess = !buildOutput.includes('failed') && !buildOutput.includes('error');
      checks.push({ name: 'Build', score: buildSuccess ? 100 : 0 });
      if (!buildSuccess) issues.push('Build failing');
    } catch (error) {
      checks.push({ name: 'Build', score: 0 });
      issues.push('Build system unavailable');
    }

    // Calculate overall score
    score = checks.reduce((sum, check) => sum + check.score, 0) / checks.length;

    return {
      score: Math.round(score),
      level: score >= 90 ? 'ready' : score >= 70 ? 'partial' : 'not-ready',
      checks,
      issues,
      criticalIssues: issues.filter(issue => 
        issue.includes('TypeScript') || issue.includes('Build failing')
      )
    };
  }

  /**
   * Scan running processes relevant to development
   */
  async scanProcesses() {
    const processes = {};

    try {
      // Check for common development servers
      const { stdout } = await execAsync('ps aux | grep -E "(vite|webpack|next|npm.*dev|yarn.*dev|convex)" | grep -v grep');
      const lines = stdout.trim().split('\n').filter(line => line.length > 0);
      
      lines.forEach(line => {
        const parts = line.split(/\s+/);
        const pid = parts[1];
        const command = parts.slice(10).join(' ');
        
        if (command.includes('vite') || command.includes('npm run dev')) {
          processes.devServer = { pid, command, status: 'running' };
        } else if (command.includes('convex')) {
          processes.convex = { pid, command, status: 'running' };
        } else if (command.includes('webpack') || command.includes('next')) {
          processes.bundler = { pid, command, status: 'running' };
        }
      });
    } catch (error) {
      // No matching processes found
    }

    return processes;
  }

  /**
   * Check network health for development endpoints
   */
  async checkNetworkHealth() {
    const endpoints = [
      { name: 'frontend', url: 'http://localhost:3000' },
      { name: 'frontend-alt', url: 'http://localhost:5173' },
      { name: 'convex', url: 'http://localhost:3210' },
      { name: 'api', url: 'http://localhost:8000' }
    ];

    const results = {};

    for (const endpoint of endpoints) {
      try {
        const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" ${endpoint.url} --max-time 2`);
        const statusCode = stdout.trim();
        results[endpoint.name] = {
          url: endpoint.url,
          status: statusCode,
          healthy: statusCode === '200' || statusCode === '404' // 404 can be healthy for SPAs
        };
      } catch (error) {
        results[endpoint.name] = {
          url: endpoint.url,
          status: 'offline',
          healthy: false
        };
      }
    }

    return results;
  }

  /**
   * Analyze code quality metrics
   */
  async analyzeCodeQuality() {
    const metrics = {};

    try {
      // TypeScript check
      const { stdout: tsOutput } = await execAsync('npx tsc --noEmit --skipLibCheck 2>&1 || true');
      const tsErrors = (tsOutput.match(/error TS/g) || []).length;
      metrics.typescript = { errors: tsErrors, clean: tsErrors === 0 };
    } catch (error) {
      metrics.typescript = { errors: -1, clean: false, error: 'Check failed' };
    }

    try {
      // Lint analysis
      const { stdout: lintOutput } = await execAsync('npm run lint 2>&1 || true');
      const lintErrors = (lintOutput.match(/error/gi) || []).length;
      const lintWarnings = (lintOutput.match(/warning/gi) || []).length;
      metrics.lint = { errors: lintErrors, warnings: lintWarnings };
    } catch (error) {
      metrics.lint = { errors: -1, warnings: -1, error: 'Lint check failed' };
    }

    try {
      // Build metrics
      const startTime = Date.now();
      const { stdout: buildOutput } = await execAsync('npm run build 2>&1 || true');
      const buildTime = Date.now() - startTime;
      const success = !buildOutput.includes('failed') && !buildOutput.includes('error');
      
      // Try to get build size
      let buildSize = 'unknown';
      try {
        const { stdout: sizeOutput } = await execAsync('du -sh dist/ build/ .next/ 2>/dev/null | head -1');
        buildSize = sizeOutput.split('\t')[0];
      } catch (e) {
        // Size check failed
      }

      metrics.build = { success, time: buildTime, size: buildSize };
    } catch (error) {
      metrics.build = { success: false, error: 'Build failed' };
    }

    return metrics;
  }

  /**
   * Get Git repository status
   */
  async getGitStatus() {
    try {
      const [branch, status, changes] = await Promise.all([
        execAsync('git branch --show-current').then(r => r.stdout.trim()),
        execAsync('git status --porcelain').then(r => r.stdout.trim()),
        execAsync('git diff --name-only').then(r => r.stdout.trim())
      ]);

      const changedFiles = status ? status.split('\n').length : 0;
      const modifiedFiles = changes ? changes.split('\n').filter(f => f).length : 0;

      return {
        branch,
        changedFiles,
        modifiedFiles,
        clean: changedFiles === 0,
        status: status || 'clean'
      };
    } catch (error) {
      return { error: 'Not a git repository or git unavailable' };
    }
  }

  /**
   * Get system resource metrics
   */
  async getSystemMetrics() {
    const metrics = {};

    try {
      // Memory usage
      const { stdout: memOutput } = await execAsync('free -m 2>/dev/null || vm_stat 2>/dev/null | head -10');
      metrics.memory = memOutput.includes('Mem:') ? 'linux' : 'darwin';
    } catch (error) {
      metrics.memory = 'unavailable';
    }

    try {
      // CPU load
      const { stdout: loadOutput } = await execAsync('uptime');
      const loadMatch = loadOutput.match(/load average[s]*: ([0-9.]+)/);
      metrics.load = loadMatch ? parseFloat(loadMatch[1]) : 'unknown';
    } catch (error) {
      metrics.load = 'unavailable';
    }

    return metrics;
  }

  /**
   * Get recent development activity
   */
  async getRecentActivity(timeframe = '5 minutes ago') {
    const activity = {
      errors: [],
      warnings: [],
      successes: [],
      summary: ''
    };

    try {
      // Scan log files for recent activity
      const logFiles = fs.readdirSync(this.logsPath).filter(f => f.endsWith('.log'));
      
      for (const logFile of logFiles) {
        const logPath = path.join(this.logsPath, logFile);
        const { stdout: recentLogs } = await execAsync(`tail -50 "${logPath}" 2>/dev/null || echo ""`);
        
        const lines = recentLogs.split('\n');
        lines.forEach(line => {
          if (line.match(/error|failed|exception/i)) {
            activity.errors.push({ file: logFile, message: line.trim() });
          } else if (line.match(/warn|warning/i)) {
            activity.warnings.push({ file: logFile, message: line.trim() });
          } else if (line.match(/success|compiled|ready|listening/i)) {
            activity.successes.push({ file: logFile, message: line.trim() });
          }
        });
      }

      activity.summary = `${activity.successes.length} successes, ${activity.warnings.length} warnings, ${activity.errors.length} errors in recent logs`;
    } catch (error) {
      activity.summary = 'Unable to analyze recent activity';
    }

    return activity;
  }

  /**
   * Quick status check - simplified version for CLI
   */
  async quickStatus() {
    const env = await this.scanEnvironment();
    
    return {
      readiness: `${env.readiness.score}% (${env.readiness.level})`,
      devServer: env.processes.devServer ? `Running (PID: ${env.processes.devServer.pid})` : 'Stopped',
      convex: env.processes.convex ? `Running (PID: ${env.processes.convex.pid})` : 'Stopped',
      typescript: env.codeQuality.typescript?.clean ? 'Clean' : `${env.codeQuality.typescript?.errors || '?'} errors`,
      lint: env.codeQuality.lint ? `${env.codeQuality.lint.errors} errors, ${env.codeQuality.lint.warnings} warnings` : 'Unknown',
      build: env.codeQuality.build?.success ? `Successful (${env.codeQuality.build.size}, ${env.codeQuality.build.time}ms)` : 'Failed',
      git: env.git.clean ? 'Clean' : `${env.git.changedFiles} files changed`,
      frontend: env.network.frontend?.healthy || env.network['frontend-alt']?.healthy ? 'Healthy' : 'Offline'
    };
  }

  /**
   * Check if it's safe to start development servers
   */
  async canStart() {
    const processes = await this.scanProcesses();
    return !processes.devServer && !processes.convex;
  }
}

module.exports = AutonomousEngine;

// CLI execution
if (require.main === module) {
  const engine = new AutonomousEngine();
  const command = process.argv[2];

  switch (command) {
    case 'scan':
      engine.scanEnvironment().then(result => console.log(JSON.stringify(result, null, 2)));
      break;
    case 'status':
      engine.quickStatus().then(status => {
        console.log('🤖 CLAUDE AUTONOMOUS DEVELOPMENT STATUS');
        console.log('========================================');
        console.log(`🎯 Readiness: ${status.readiness}`);
        console.log(`📡 Dev Server: ${status.devServer}`);
        console.log(`📡 Convex: ${status.convex}`);
        console.log(`🔧 TypeScript: ${status.typescript}`);
        console.log(`🧹 Lint: ${status.lint}`);
        console.log(`🏗️ Build: ${status.build}`);
        console.log(`🌐 Frontend: ${status.frontend}`);
        console.log(`📝 Git: ${status.git}`);
      });
      break;
    case 'ready':
      engine.assessReadiness().then(readiness => {
        if (readiness.level === 'ready') {
          console.log('✅ READY FOR DEVELOPMENT - All systems operational');
        } else {
          console.log(`⚠️ ${readiness.level.toUpperCase()} - ${readiness.issues.join(', ')}`);
        }
      });
      break;
    case 'can-start':
      engine.canStart().then(canStart => console.log(canStart));
      break;
    default:
      console.log('Usage: node autonomous-engine.js [scan|status|ready|can-start]');
  }
}