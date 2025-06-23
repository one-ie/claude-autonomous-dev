#!/usr/bin/env node

/**
 * Simple test suite for Claude Autonomous Development Framework
 */

const ClaudeAuto = require('../lib/index.js');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running Claude Auto Tests\n');

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
    process.exit(this.failed > 0 ? 1 : 0);
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }
}

const test = new TestRunner();

// Test: ClaudeAuto instance creation
test.test('ClaudeAuto instance creation', async () => {
  const claude = new ClaudeAuto();
  test.assert(claude instanceof ClaudeAuto, 'Should create ClaudeAuto instance');
  test.assert(typeof claude.scan === 'function', 'Should have scan method');
  test.assert(typeof claude.status === 'function', 'Should have status method');
});

// Test: Environment scanning
test.test('Environment scanning', async () => {
  const claude = new ClaudeAuto();
  const env = await claude.scan();
  
  test.assert(typeof env === 'object', 'Should return object');
  test.assert(typeof env.timestamp === 'number', 'Should have timestamp');
  test.assert(typeof env.processes === 'object', 'Should have processes');
  test.assert(typeof env.network === 'object', 'Should have network');
  test.assert(typeof env.quality === 'object', 'Should have quality');
  test.assert(typeof env.readiness === 'object', 'Should have readiness');
});

// Test: Status command
test.test('Status generation', async () => {
  const claude = new ClaudeAuto();
  const status = await claude.status();
  
  test.assert(typeof status === 'object', 'Should return status object');
  test.assert(typeof status.readiness === 'string', 'Should have readiness string');
  test.assert(typeof status.typescript === 'string', 'Should have typescript status');
  test.assert(typeof status.git === 'string', 'Should have git status');
});

// Test: Can start check
test.test('Can start check', async () => {
  const claude = new ClaudeAuto();
  const canStart = await claude.canStart();
  
  test.assert(typeof canStart === 'boolean', 'Should return boolean');
});

// Test: Process scanning
test.test('Process scanning', async () => {
  const claude = new ClaudeAuto();
  const processes = await claude.scanProcesses();
  
  test.assert(typeof processes === 'object', 'Should return processes object');
});

// Test: Quality checking
test.test('Quality checking', async () => {
  const claude = new ClaudeAuto();
  const quality = await claude.checkQuality();
  
  test.assert(typeof quality === 'object', 'Should return quality object');
  test.assert(typeof quality.typescript === 'object', 'Should have typescript check');
  test.assert(typeof quality.lint === 'object', 'Should have lint check');
  test.assert(typeof quality.build === 'object', 'Should have build check');
});

// Test: Initialization
test.test('Framework initialization', async () => {
  const tempDir = path.join(__dirname, '..', 'test-temp');
  const claude = new ClaudeAuto(tempDir);
  
  // Clean up if exists
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  const result = await claude.init();
  test.assert(result === true, 'Should initialize successfully');
  
  const claudeDir = path.join(tempDir, '.claude');
  test.assert(fs.existsSync(claudeDir), 'Should create .claude directory');
  
  const interfaceScript = path.join(claudeDir, 'claude');
  test.assert(fs.existsSync(interfaceScript), 'Should create interface script');
  
  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
});

// Test: Caching system
test.test('Caching system', async () => {
  const claude = new ClaudeAuto();
  
  // Test cache set/get
  claude.setCache('test', { data: 'value' });
  const cached = claude.getCache('test');
  test.assert(cached.data === 'value', 'Should cache and retrieve data');
  
  // Test cache expiration with longer timeout to ensure it works
  claude.setCache('expire', { data: 'value' }, 10); // 10ms timeout
  await new Promise(resolve => setTimeout(resolve, 15)); // Wait 15ms
  const expired = claude.getCache('expire');
  test.assert(expired === null, 'Should expire cached data');
});

// Test: Readiness calculation
test.test('Readiness calculation', async () => {
  const claude = new ClaudeAuto();
  
  const mockData = {
    processes: {},
    network: { dev: { healthy: true } },
    quality: {
      typescript: { clean: true, errors: 0 },
      lint: { errors: 0, warnings: 0 },
      build: { success: true }
    },
    git: { clean: true }
  };
  
  const readiness = claude.calculateReadiness(
    mockData.processes,
    mockData.network,
    mockData.quality,
    mockData.git
  );
  
  test.assert(typeof readiness === 'object', 'Should return readiness object');
  test.assert(typeof readiness.score === 'number', 'Should have numeric score');
  test.assert(typeof readiness.level === 'string', 'Should have level string');
  test.assert(Array.isArray(readiness.issues), 'Should have issues array');
});

// Test: Port extraction
test.test('Port extraction', async () => {
  const claude = new ClaudeAuto();
  
  test.assert(claude.extractPort('vite') === '5173', 'Should extract vite port');
  test.assert(claude.extractPort('next') === '3000', 'Should extract next port');
  test.assert(claude.extractPort('--port 8080') === '8080', 'Should extract custom port');
});

// Test: Auto-fix functionality
test.test('Auto-fix functionality', async () => {
  const claude = new ClaudeAuto();
  const fixes = await claude.autoFix();
  
  test.assert(Array.isArray(fixes), 'Should return fixes array');
});

// Run tests
if (require.main === module) {
  test.run();
}