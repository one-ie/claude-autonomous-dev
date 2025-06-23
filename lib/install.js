#!/usr/bin/env node

/**
 * Installation and setup utilities for Claude Autonomous Development Framework
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);

class FrameworkInstaller {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.claudeDir = path.join(projectPath, '.claude');
    this.packageRoot = path.dirname(__dirname); // Parent of lib/
  }

  /**
   * Install framework in current project
   */
  async install() {
    console.log('🚀 Installing Claude Autonomous Development Framework...');
    
    try {
      // Create directory structure
      await this.createDirectories();
      
      // Install core files
      await this.installCoreFiles();
      
      // Initialize log files
      await this.initializeLogFiles();
      
      // Update .gitignore
      await this.updateGitignore();
      
      // Validate installation
      await this.validateInstallation();
      
      console.log('✅ Installation completed successfully!');
      this.printNextSteps();
      
    } catch (error) {
      console.error('❌ Installation failed:', error.message);
      throw error;
    }
  }

  /**
   * Create required directory structure
   */
  async createDirectories() {
    const dirs = [
      this.claudeDir,
      path.join(this.claudeDir, 'core'),
      path.join(this.claudeDir, 'logs'),
      path.join(this.claudeDir, 'status'),
      path.join(this.claudeDir, 'analysis'),
      path.join(this.claudeDir, 'config')
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${path.relative(this.projectPath, dir)}`);
      }
    }
  }

  /**
   * Install core framework files
   */
  async installCoreFiles() {
    const files = [
      {
        source: path.join(this.packageRoot, 'templates', 'autonomous-engine.js'),
        dest: path.join(this.claudeDir, 'core', 'autonomous-engine.js'),
        executable: false
      },
      {
        source: path.join(this.packageRoot, 'templates', 'claude-interface.sh'),
        dest: path.join(this.claudeDir, 'claude'),
        executable: true
      }
    ];

    for (const file of files) {
      if (fs.existsSync(file.source)) {
        fs.copyFileSync(file.source, file.dest);
        
        if (file.executable) {
          fs.chmodSync(file.dest, '755');
        }
        
        console.log(`✅ Installed: ${path.relative(this.projectPath, file.dest)}`);
      } else {
        console.warn(`⚠️ Source file not found: ${file.source}`);
      }
    }
  }

  /**
   * Initialize log files
   */
  async initializeLogFiles() {
    const logFiles = [
      'dev-server.log',
      'build.log',
      'lint.log',
      'typecheck.log',
      'monitor.log',
      'claude-interface.log'
    ];

    const logsDir = path.join(this.claudeDir, 'logs');
    
    for (const logFile of logFiles) {
      const logPath = path.join(logsDir, logFile);
      if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, `# ${logFile} - Created ${new Date().toISOString()}\n`);
      }
    }
    
    console.log('✅ Initialized log files');
  }

  /**
   * Update .gitignore to exclude logs and temporary files
   */
  async updateGitignore() {
    const gitignorePath = path.join(this.projectPath, '.gitignore');
    
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      
      if (!gitignoreContent.includes('.claude/logs/')) {
        const additions = [
          '',
          '# Claude Autonomous Development Framework',
          '.claude/logs/',
          '.claude/status/',
          '.claude/analysis/',
          '.claude/tmp/',
          ''
        ].join('\n');
        
        fs.appendFileSync(gitignorePath, additions);
        console.log('✅ Updated .gitignore');
      }
    } else {
      // Create .gitignore if it doesn't exist
      const gitignoreContent = [
        '# Claude Autonomous Development Framework',
        '.claude/logs/',
        '.claude/status/',
        '.claude/analysis/',
        '.claude/tmp/',
        '',
        '# Dependencies',
        'node_modules/',
        '',
        '# Build outputs',
        'dist/',
        'build/',
        '.next/',
        ''
      ].join('\n');
      
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ Created .gitignore');
    }
  }

  /**
   * Validate installation
   */
  async validateInstallation() {
    const requiredFiles = [
      path.join(this.claudeDir, 'claude'),
      path.join(this.claudeDir, 'core', 'autonomous-engine.js')
    ];

    let valid = true;
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        console.error(`❌ Missing required file: ${path.relative(this.projectPath, file)}`);
        valid = false;
      }
    }

    if (!valid) {
      throw new Error('Installation validation failed');
    }

    // Test basic functionality
    try {
      const claudeScript = path.join(this.claudeDir, 'claude');
      const { stdout } = await execAsync(`${claudeScript} help`);
      
      if (stdout.includes('Claude Autonomous Development Interface')) {
        console.log('✅ Basic functionality test passed');
      } else {
        throw new Error('Functionality test failed');
      }
    } catch (error) {
      console.warn('⚠️ Basic functionality test failed - manual verification required');
    }
  }

  /**
   * Print next steps for user
   */
  printNextSteps() {
    console.log('\n🎉 Installation Complete!\n');
    console.log('📋 Next Steps:');
    console.log('  1. Test the installation:');
    console.log('     ./.claude/claude status');
    console.log('');
    console.log('  2. Check development readiness:');
    console.log('     ./.claude/claude ready');
    console.log('');
    console.log('  3. Start monitoring (optional):');
    console.log('     ./.claude/claude monitor &');
    console.log('');
    console.log('  4. See all available commands:');
    console.log('     ./.claude/claude help');
    console.log('');
    console.log('📚 Documentation:');
    console.log('  • Basic Usage: examples/basic-usage.md');
    console.log('  • Configuration: docs/configuration.md');
    console.log('  • Troubleshooting: docs/troubleshooting.md');
  }

  /**
   * Create default configuration file
   */
  async createDefaultConfig() {
    const configPath = path.join(this.claudeDir, 'config', 'default.json');
    
    if (!fs.existsSync(configPath)) {
      const defaultConfig = {
        framework: {
          name: 'claude-autonomous-dev',
          version: '1.0.0',
          initialized: new Date().toISOString()
        },
        monitoring: {
          interval: 10,
          logRetention: '7d',
          alertThresholds: {
            typescript: 0,
            lint: 50,
            build: 0
          }
        },
        endpoints: {
          frontend: ['http://localhost:3000', 'http://localhost:5173'],
          backend: ['http://localhost:8000', 'http://localhost:3210']
        },
        scripts: {
          dev: 'npm run dev',
          build: 'npm run build',
          lint: 'npm run lint',
          typecheck: 'npx tsc --noEmit'
        }
      };
      
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      console.log('✅ Created default configuration');
    }
  }

  /**
   * Detect project type and customize installation
   */
  async detectProjectType() {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const projectType = {
        framework: 'unknown',
        hasTypeScript: false,
        hasLinting: false,
        buildTool: 'unknown'
      };

      // Detect framework
      if (dependencies.react) projectType.framework = 'react';
      else if (dependencies.vue) projectType.framework = 'vue';
      else if (dependencies.next) projectType.framework = 'next';
      else if (dependencies.nuxt) projectType.framework = 'nuxt';
      else if (dependencies.svelte) projectType.framework = 'svelte';

      // Detect TypeScript
      projectType.hasTypeScript = !!(dependencies.typescript || fs.existsSync(path.join(this.projectPath, 'tsconfig.json')));

      // Detect linting
      projectType.hasLinting = !!(dependencies.eslint || dependencies['@typescript-eslint/parser']);

      // Detect build tool
      if (dependencies.vite) projectType.buildTool = 'vite';
      else if (dependencies.webpack) projectType.buildTool = 'webpack';
      else if (dependencies.parcel) projectType.buildTool = 'parcel';

      console.log(`📋 Detected project: ${projectType.framework} with ${projectType.buildTool}`);
      
      return projectType;
    }
    
    return null;
  }
}

module.exports = FrameworkInstaller;

// CLI execution
if (require.main === module) {
  const installer = new FrameworkInstaller();
  installer.install().catch(error => {
    console.error('Installation failed:', error.message);
    process.exit(1);
  });
}