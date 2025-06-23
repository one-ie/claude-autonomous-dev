# Configuration Guide

## Default Configuration

The Claude Autonomous Development Framework works out of the box with zero configuration for most projects. However, you can customize behavior for specific needs.

## Configuration Files

### .claude/config.json

Create a configuration file in your project's `.claude/` directory:

```json
{
  "framework": {
    "name": "claude-autonomous-dev",
    "version": "1.0.0"
  },
  "monitoring": {
    "interval": 10,
    "logRetention": "7d",
    "alertThresholds": {
      "typescript": 0,
      "lint": 50,
      "build": 0
    }
  },
  "endpoints": {
    "frontend": ["http://localhost:3000", "http://localhost:5173"],
    "backend": ["http://localhost:8000", "http://localhost:3210"],
    "custom": []
  },
  "scripts": {
    "dev": "npm run dev",
    "build": "npm run build",
    "lint": "npm run lint",
    "typecheck": "npx tsc --noEmit"
  },
  "notifications": {
    "enabled": true,
    "channels": ["console", "log"],
    "errorLevel": "warning"
  }
}
```

## Environment Variables

You can also configure behavior using environment variables:

### Core Settings
```bash
CLAUDE_AUTO_LOG_LEVEL=info        # debug, info, warning, error
CLAUDE_AUTO_MONITORING_INTERVAL=10 # seconds between checks
CLAUDE_AUTO_LOG_RETENTION=7       # days to keep logs
```

### Custom Endpoints
```bash
CLAUDE_AUTO_FRONTEND_URL=http://localhost:8080
CLAUDE_AUTO_BACKEND_URL=http://localhost:9000
CLAUDE_AUTO_CUSTOM_ENDPOINTS=http://localhost:4000,http://localhost:6000
```

### Build and Quality Settings
```bash
CLAUDE_AUTO_LINT_AUTOFIX=true     # automatically fix linting issues
CLAUDE_AUTO_TYPESCRIPT_STRICT=true # strict TypeScript checking
CLAUDE_AUTO_BUILD_TIMEOUT=300     # build timeout in seconds
```

## Project-Specific Customization

### package.json Integration

The framework reads your `package.json` for optimal configuration:

```json
{
  "claudeAuto": {
    "monitoring": {
      "processes": ["dev", "build", "test"],
      "endpoints": ["http://localhost:3000"],
      "healthChecks": {
        "database": "npm run db:check",
        "cache": "npm run cache:ping"
      }
    },
    "quality": {
      "typescript": {
        "enabled": true,
        "strict": true,
        "configFile": "tsconfig.json"
      },
      "linting": {
        "enabled": true,
        "autoFix": true,
        "configFile": ".eslintrc.js"
      }
    },
    "notifications": {
      "webhook": "https://hooks.slack.com/your-webhook",
      "email": "dev@yourcompany.com"
    }
  }
}
```

## Advanced Configuration

### Custom Health Checks

Add custom health checks for your specific stack:

```javascript
// .claude/config/health-checks.js
module.exports = {
  database: async () => {
    // Check database connection
    return { status: 'healthy', response_time: '45ms' };
  },
  
  redis: async () => {
    // Check Redis connection
    return { status: 'healthy', memory: '256MB' };
  },
  
  api: async () => {
    // Check API endpoints
    return { status: 'healthy', version: 'v1.2.3' };
  }
};
```

### Custom Monitoring Scripts

Create custom monitoring logic:

```bash
# .claude/scripts/custom-monitor.sh
#!/bin/bash

# Custom monitoring logic for your project
check_docker_containers() {
    docker ps --format "table {{.Names}}\t{{.Status}}"
}

check_disk_space() {
    df -h | grep -E "(/$|/home)"
}

# Run custom checks
check_docker_containers
check_disk_space
```

### Integration with CI/CD

Configure for different environments:

```json
{
  "environments": {
    "development": {
      "monitoring": { "interval": 10 },
      "endpoints": ["http://localhost:3000"],
      "strictMode": false
    },
    "staging": {
      "monitoring": { "interval": 30 },
      "endpoints": ["https://staging.yourapp.com"],
      "strictMode": true
    },
    "production": {
      "monitoring": { "interval": 60 },
      "endpoints": ["https://yourapp.com"],
      "strictMode": true,
      "alerts": {
        "slack": true,
        "pagerduty": true
      }
    }
  }
}
```

## Framework Behavior Customization

### Readiness Assessment

Customize what constitutes "ready" for your project:

```json
{
  "readiness": {
    "criteria": {
      "typescript": { "weight": 30, "required": true },
      "lint": { "weight": 20, "threshold": 5 },
      "build": { "weight": 40, "required": true },
      "tests": { "weight": 10, "threshold": 95 }
    },
    "minimumScore": 80
  }
}
```

### Intelligent Decision Making

Configure how Claude makes autonomous decisions:

```json
{
  "autonomy": {
    "autoFix": {
      "lint": true,
      "format": true,
      "imports": false
    },
    "autoRestart": {
      "onCrash": true,
      "onError": false,
      "cooldown": 30
    },
    "notifications": {
      "beforeAction": true,
      "afterAction": true,
      "onFailure": true
    }
  }
}
```

## Team Configuration

### Shared Team Settings

For team collaboration, create `.claude/team-config.json`:

```json
{
  "team": {
    "name": "Frontend Team",
    "members": ["alice", "bob", "charlie"],
    "sharedSnapshots": true,
    "communicationChannels": {
      "slack": "#frontend-dev",
      "email": "frontend@company.com"
    }
  },
  "standardization": {
    "nodeVersion": "18.x",
    "packageManager": "npm",
    "requiredScripts": ["dev", "build", "test", "lint"],
    "codeQualityGates": {
      "typescript": 0,
      "linting": 10,
      "testCoverage": 80
    }
  }
}
```

## Troubleshooting Configuration

### Validate Configuration

```bash
# Check if configuration is valid
claude-auto doctor

# View current configuration
claude-auto config show

# Test configuration
claude-auto config test
```

### Common Configuration Issues

1. **Script Not Found**
   ```json
   // Ensure scripts exist in package.json
   {
     "scripts": {
       "dev": "vite",  // Must match your actual dev command
       "build": "vite build"
     }
   }
   ```

2. **Endpoint Not Responding**
   ```json
   // Update endpoints to match your setup
   {
     "endpoints": {
       "frontend": ["http://localhost:5173"] // Vite default
     }
   }
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   chmod +x .claude/claude
   chmod +x .claude/scripts/*.sh
   ```

## Examples

See the [examples directory](../examples/) for:
- React project configuration
- TypeScript project setup  
- Monorepo configuration
- Docker environment setup
- CI/CD pipeline integration