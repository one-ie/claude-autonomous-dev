#!/usr/bin/env node

/**
 * Claude Autonomous Development - Lightweight CLI
 * Optimized for speed, accuracy, and minimal overhead
 */

const ClaudeAuto = require('../lib/index.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Performance optimization: only load what we need
const claude = new ClaudeAuto();

/**
 * Ultra-fast command dispatcher
 */
async function main() {
  const [,, command, ...args] = process.argv;
  
  try {
    switch (command) {
      case 'init':
        await initCommand();
        break;
      case 'status':
      case 's':
        await statusCommand();
        break;
      case 'scan':
        await scanCommand();
        break;
      case 'ready':
      case 'r':
        await readyCommand();
        break;
      case 'fix':
        await fixCommand();
        break;
      case 'build':
        await buildCommand();
        break;
      case 'lint':
        await lintCommand(args[0]);
        break;
      case 'can-start':
        await canStartCommand();
        break;
      case 'convex':
        await convexCommand(args);
        break;
      case 'logs':
        await logsCommand(args);
        break;
      case 'workspaces':
      case 'ws':
        await workspacesCommand(args);
        break;
      case 'frameworks':
        await frameworksCommand();
        break;
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
      case 'version':
      case '--version':
      case '-v':
        showVersion();
        break;
      default:
        if (!command) {
          showQuickHelp();
        } else {
          console.error(chalk.red(`Unknown command: ${command}`));
          console.log(chalk.yellow('Use "claude-auto help" for available commands'));
          process.exit(1);
        }
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Lightning-fast init
 */
async function initCommand() {
  console.log(chalk.blue('⚡ Initializing Claude Auto...'));
  
  await claude.init();
  
  console.log(chalk.green('✅ Initialized successfully!'));
  console.log(chalk.yellow('\nQuick start:'));
  console.log('  claude-auto status    # Check environment');
  console.log('  claude-auto ready     # Check readiness');
  console.log('  ./.claude/claude status # Local interface');
}

/**
 * Fast status display
 */
async function statusCommand() {
  const startTime = Date.now();
  const status = await claude.status();
  const scanTime = Date.now() - startTime;
  
  console.log(chalk.blue('🤖 CLAUDE AUTO STATUS') + chalk.gray(` (${scanTime}ms)`));
  console.log(chalk.blue('=================='));
  
  const formatStatus = (key, value) => {
    const label = key.padEnd(12);
    if (value.includes('Clean') || value.includes('Success') || value.includes('Healthy') || value.includes('Running')) {
      return chalk.green(`${label}: ${value}`);
    } else if (value.includes('error') || value.includes('Failed') || value.includes('Offline')) {
      return chalk.red(`${label}: ${value}`);
    } else {
      return chalk.yellow(`${label}: ${value}`);
    }
  };
  
  Object.entries(status).forEach(([key, value]) => {
    console.log(formatStatus(key, value));
  });
}

/**
 * JSON scan output
 */
async function scanCommand() {
  const result = await claude.scan();
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Quick readiness check
 */
async function readyCommand() {
  const env = await claude.scan();
  const { readiness } = env;
  
  if (readiness.level === 'ready') {
    console.log(chalk.green('✅ READY FOR DEVELOPMENT'));
  } else {
    console.log(chalk.yellow(`⚠️ ${readiness.level.toUpperCase()}`));
    if (readiness.issues.length > 0) {
      readiness.issues.forEach(issue => console.log(chalk.gray(`  • ${issue}`)));
    }
  }
  
  if (readiness.critical.length > 0) {
    console.log(chalk.red('\n🚨 Critical issues:'));
    readiness.critical.forEach(issue => console.log(chalk.red(`  • ${issue}`)));
  }
}

/**
 * Auto-fix command
 */
async function fixCommand() {
  console.log(chalk.blue('🔧 Auto-fixing issues...'));
  const fixes = await claude.autoFix();
  
  if (fixes.length > 0) {
    fixes.forEach(fix => console.log(chalk.green(`✅ ${fix}`)));
  } else {
    console.log(chalk.green('✅ No fixes needed'));
  }
}

/**
 * Build monitoring
 */
async function buildCommand() {
  console.log(chalk.blue('🏗️ Checking build...'));
  const quality = await claude.checkQuality();
  
  if (quality.build.success) {
    console.log(chalk.green(`✅ Build successful (${quality.build.size}, ${quality.build.time}ms)`));
  } else {
    console.log(chalk.red('❌ Build failed'));
    if (quality.build.error) {
      console.log(chalk.gray(quality.build.error));
    }
  }
}

/**
 * Lint command with optional fix
 */
async function lintCommand(fix) {
  if (fix === 'fix') {
    await fixCommand();
  } else {
    console.log(chalk.blue('🧹 Checking lint...'));
    const quality = await claude.checkQuality();
    
    const { lint } = quality;
    if (lint.errors === 0 && lint.warnings === 0) {
      console.log(chalk.green('✅ No lint issues'));
    } else {
      console.log(chalk.yellow(`⚠️ ${lint.errors} errors, ${lint.warnings} warnings`));
      if (lint.fixable) {
        console.log(chalk.blue('💡 Run "claude-auto fix" to auto-fix'));
      }
    }
  }
}

/**
 * Check if safe to start servers
 */
async function canStartCommand() {
  const canStart = await claude.canStart();
  console.log(canStart ? 'true' : 'false');
  process.exit(canStart ? 0 : 1);
}

/**
 * Convex-specific commands
 */
async function convexCommand(args) {
  const [subcommand = 'status'] = args;
  
  switch (subcommand) {
    case 'status':
      await convexStatusCommand();
      break;
    case 'logs':
      await convexLogsCommand(args.slice(1));
      break;
    case 'functions':
      await convexFunctionsCommand();
      break;
    default:
      console.log(chalk.yellow('Convex commands:'));
      console.log('  convex status     Check Convex deployment status');
      console.log('  convex logs       Show recent Convex logs');
      console.log('  convex functions  List Convex functions');
  }
}

/**
 * Logs command (supports both general and Convex logs)
 */
async function logsCommand(args) {
  const [source = 'convex', ...options] = args;
  
  if (source === 'convex') {
    await convexLogsCommand(options);
  } else {
    console.log(chalk.blue('📝 Available log sources:'));
    console.log('  claude-auto logs convex    # Convex deployment logs');
    console.log('  claude-auto logs convex --tail  # Follow Convex logs');
  }
}

/**
 * Convex status command
 */
async function convexStatusCommand() {
  console.log(chalk.blue('🔍 Checking Convex status...'));
  
  try {
    const status = await claude.getConvexStatus();
    
    if (!status.available) {
      console.log(chalk.red('❌ Convex not available'));
      console.log(chalk.gray(`   Reason: ${status.reason || status.error || 'Unknown'}`));
      return;
    }
    
    console.log(chalk.green('✅ Convex project detected'));
    console.log(chalk.blue('📊 Status:'));
    console.log(`   Authenticated: ${status.authenticated ? chalk.green('Yes') : chalk.red('No')}`);
    console.log(`   Deployment: ${chalk.yellow(status.deployment)}`);
    console.log(`   Mode: ${status.localMode ? chalk.blue('Local') : status.cloudMode ? chalk.green('Cloud') : chalk.gray('Unknown')}`);
    
    if (!status.authenticated) {
      console.log(chalk.yellow('\n💡 Run "npx convex login" to authenticate'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to check Convex status:'), error.message);
  }
}

/**
 * Convex logs command
 */
async function convexLogsCommand(options) {
  const follow = options.includes('--tail') || options.includes('-f');
  const linesArg = options.find(arg => arg.startsWith('--lines='));
  const lines = linesArg ? parseInt(linesArg.split('=')[1]) : 20;
  
  try {
    if (follow) {
      console.log(chalk.blue('👁️ Following Convex logs (Ctrl+C to stop)...'));
      console.log(chalk.gray('====================================='));
      
      const logProcess = await claude.watchConvexLogs({ follow: true });
      
      logProcess.stdout.on('data', (data) => {
        const logs = claude.parseConvexLogs(data.toString());
        logs.forEach(log => {
          const time = log.timestamp.toTimeString().split(' ')[0];
          const levelColor = log.level === 'error' ? chalk.red : 
                           log.level === 'warn' ? chalk.yellow : 
                           log.level === 'info' ? chalk.blue : chalk.gray;
          
          console.log(`${chalk.gray(time)} ${levelColor(`[${log.level.toUpperCase()}]`)} ${chalk.cyan(log.function)}: ${log.message}`);
        });
      });
      
      logProcess.stderr.on('data', (data) => {
        console.error(chalk.red('Error:'), data.toString());
      });
      
      logProcess.on('close', (code) => {
        console.log(chalk.blue('\n👁️ Stopped watching logs'));
      });
      
    } else {
      console.log(chalk.blue(`📝 Recent Convex logs (${lines} lines):`));
      console.log(chalk.gray('============================'));
      
      const logs = await claude.watchConvexLogs({ lines });
      
      if (logs.length === 0) {
        console.log(chalk.gray('No recent logs found'));
        return;
      }
      
      logs.forEach(log => {
        const time = log.timestamp.toTimeString().split(' ')[0];
        const levelColor = log.level === 'error' ? chalk.red : 
                         log.level === 'warn' ? chalk.yellow : 
                         log.level === 'info' ? chalk.blue : chalk.gray;
        
        console.log(`${chalk.gray(time)} ${levelColor(`[${log.level.toUpperCase()}]`)} ${chalk.cyan(log.function)}: ${log.message}`);
      });
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to get Convex logs:'), error.message);
    
    if (error.message.includes('not authenticated')) {
      console.log(chalk.yellow('💡 Run "npx convex login" to authenticate'));
    }
  }
}

/**
 * Convex functions command
 */
async function convexFunctionsCommand() {
  console.log(chalk.blue('🔍 Listing Convex functions...'));
  
  try {
    const functions = await claude.getConvexFunctions();
    
    if (functions.length === 0) {
      console.log(chalk.gray('No functions found or unable to list functions'));
      return;
    }
    
    console.log(chalk.blue(`📋 Found ${functions.length} function(s):`));
    functions.forEach(func => {
      console.log(`  ${chalk.green('•')} ${chalk.cyan(func.name)} ${chalk.gray(`(${func.type})`)}`);
    });
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to list functions:'), error.message);
  }
}

/**
 * Workspaces command for monorepo management
 */
async function workspacesCommand(args) {
  const [subcommand = 'list'] = args;
  
  try {
    const env = await claude.scan();
    
    if (env.monorepo.type !== 'monorepo') {
      console.log(chalk.yellow('📦 This is not a monorepo project'));
      console.log(chalk.gray('   Single package detected'));
      return;
    }
    
    switch (subcommand) {
      case 'list':
      case 'ls':
        await listWorkspaces(env.monorepo);
        break;
      case 'status':
        await workspaceStatus(env.monorepo);
        break;
      default:
        console.log(chalk.yellow('Workspace commands:'));
        console.log('  workspaces list    List all workspaces');
        console.log('  workspaces status  Show workspace status');
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to analyze workspaces:'), error.message);
  }
}

async function listWorkspaces(monorepo) {
  console.log(chalk.blue(`📦 ${monorepo.tool.toUpperCase()} Monorepo`));
  console.log(chalk.blue(`   ${monorepo.workspaces.length} workspace(s) found:`));
  console.log('');
  
  monorepo.workspaces.forEach(workspace => {
    console.log(`${chalk.green('📁')} ${chalk.cyan(workspace.name)}`);
    console.log(`   Path: ${chalk.gray(workspace.path)}`);
    
    // Show frameworks in this workspace
    const workspaceFrameworks = [];
    Object.keys(monorepo.frameworks).forEach(framework => {
      const frameworkWorkspaces = monorepo.frameworks[framework].filter(f => f.workspace === workspace.name);
      if (frameworkWorkspaces.length > 0) {
        workspaceFrameworks.push(framework);
      }
    });
    
    if (workspaceFrameworks.length > 0) {
      console.log(`   Frameworks: ${chalk.yellow(workspaceFrameworks.join(', '))}`);
    }
    
    // Show scripts
    const scripts = workspace.packageJson.scripts || {};
    const devScript = scripts.dev || scripts.start || scripts.serve;
    if (devScript) {
      console.log(`   Dev: ${chalk.gray(devScript)}`);
    }
    
    console.log('');
  });
}

async function workspaceStatus(monorepo) {
  console.log(chalk.blue(`📊 Workspace Status (${monorepo.tool})`));
  console.log(chalk.blue('================================'));
  console.log('');
  
  for (const workspace of monorepo.workspaces) {
    console.log(`${chalk.cyan(workspace.name)} ${chalk.gray(`(${workspace.path})`)}`);
    
    // Check if this workspace has running processes
    // This would require enhanced process detection per workspace
    console.log(`   Status: ${chalk.gray('Available for development')}`);
    
    // Show package info
    const pkg = workspace.packageJson;
    if (pkg.version) {
      console.log(`   Version: ${chalk.yellow(pkg.version)}`);
    }
    
    // Framework-specific info
    Object.keys(monorepo.frameworks).forEach(framework => {
      const frameworkData = monorepo.frameworks[framework].find(f => f.workspace === workspace.name);
      if (frameworkData) {
        console.log(`   ${framework}: ${chalk.green(frameworkData.version || 'detected')}`);
      }
    });
    
    console.log('');
  }
}

/**
 * Frameworks command
 */
async function frameworksCommand() {
  console.log(chalk.blue('🔍 Detecting frameworks...'));
  
  try {
    const env = await claude.scan();
    const { frameworks } = env.monorepo;
    
    console.log(chalk.blue('🛠️ Framework Detection Results:'));
    console.log('');
    
    let foundAny = false;
    
    Object.keys(frameworks).forEach(framework => {
      if (frameworks[framework].length > 0) {
        foundAny = true;
        console.log(`${chalk.green('✅')} ${chalk.cyan(framework.toUpperCase())}`);
        
        frameworks[framework].forEach(instance => {
          console.log(`   📍 ${chalk.yellow(instance.workspace || 'root')} ${chalk.gray(`(${instance.path})`)}`);
          if (instance.version) {
            console.log(`      Version: ${chalk.gray(instance.version)}`);
          }
          if (instance.configFile) {
            console.log(`      Config: ${chalk.gray(instance.configFile)}`);
          }
          if (instance.devScript) {
            console.log(`      Dev: ${chalk.gray(instance.devScript)}`);
          }
        });
        console.log('');
      }
    });
    
    if (!foundAny) {
      console.log(chalk.gray('No supported frameworks detected'));
      console.log(chalk.gray('Supported: Astro, Vite, Next.js, Convex, React, Vue, Svelte'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to detect frameworks:'), error.message);
  }
}

/**
 * Quick help for no command
 */
function showQuickHelp() {
  console.log(chalk.blue('Claude Auto - Autonomous Development Framework'));
  console.log('');
  console.log(chalk.yellow('Quick commands:'));
  console.log('  claude-auto init      Initialize in project');
  console.log('  claude-auto status    Check environment');
  console.log('  claude-auto ready     Check readiness');
  console.log('  claude-auto fix       Auto-fix issues');
  console.log('');
  console.log('Use "claude-auto help" for all commands');
}

/**
 * Full help
 */
function showHelp() {
  console.log(chalk.blue('Claude Auto - Autonomous Development Framework'));
  console.log(chalk.gray('Supports: Astro • Vite • Next.js • Convex • Turbo Monorepos'));
  console.log('');
  console.log(chalk.yellow('Setup:'));
  console.log('  init              Initialize framework in current project');
  console.log('');
  console.log(chalk.yellow('Environment:'));
  console.log('  status, s         Quick environment status (enhanced for monorepos)');
  console.log('  scan              Detailed JSON environment scan');
  console.log('  ready, r          Check development readiness');
  console.log('  can-start         Check if safe to start servers');
  console.log('');
  console.log(chalk.yellow('Monorepo & Frameworks:'));
  console.log('  workspaces, ws    List and manage monorepo workspaces');
  console.log('  frameworks        Detect all frameworks in project');
  console.log('  workspaces status Show detailed workspace information');
  console.log('');
  console.log(chalk.yellow('Development:'));
  console.log('  build             Check build status');
  console.log('  lint [fix]        Check/fix linting');
  console.log('  fix               Auto-fix common issues');
  console.log('');
  console.log(chalk.yellow('Convex Integration:'));
  console.log('  convex status     Check Convex deployment status');
  console.log('  convex logs       Show recent Convex logs');
  console.log('  convex functions  List Convex functions');
  console.log('  logs convex --tail Follow Convex logs in real-time');
  console.log('');
  console.log(chalk.yellow('Info:'));
  console.log('  help              Show this help');
  console.log('  version           Show version');
  console.log('');
  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  claude-auto frameworks           # Detect all frameworks'));
  console.log(chalk.gray('  claude-auto workspaces           # List monorepo workspaces'));
  console.log(chalk.gray('  claude-auto status               # Enhanced status with frameworks'));
  console.log(chalk.gray('  claude-auto convex logs --tail   # Watch Convex logs'));
}

/**
 * Show version
 */
function showVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`${pkg.name} v${pkg.version}`);
}

// Run CLI
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Fatal error:'), error.message);
    process.exit(1);
  });
}