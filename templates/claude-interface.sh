#!/bin/bash

# Claude Autonomous Development Interface
# Simple command interface for Claude to interact with the autonomous system

CLAUDE_DIR=".claude"
CORE_DIR="$CLAUDE_DIR/core"
LOGS_DIR="$CLAUDE_DIR/logs"
STATUS_DIR="$CLAUDE_DIR/status"
ANALYSIS_DIR="$CLAUDE_DIR/analysis"

# Ensure directories exist
mkdir -p "$CORE_DIR" "$LOGS_DIR" "$STATUS_DIR" "$ANALYSIS_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log with timestamp
log_with_timestamp() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOGS_DIR/claude-interface.log"
}

# Main command dispatcher
case "$1" in
    "status")
        echo -e "${BLUE}🤖 Checking system status...${NC}"
        node "$CORE_DIR/autonomous-engine.js" status
        log_with_timestamp "Status check requested"
        ;;
    
    "scan")
        echo -e "${BLUE}🔍 Performing detailed environment scan...${NC}"
        node "$CORE_DIR/autonomous-engine.js" scan
        log_with_timestamp "Full environment scan performed"
        ;;
    
    "ready")
        echo -e "${BLUE}✅ Checking development readiness...${NC}"
        node "$CORE_DIR/autonomous-engine.js" ready
        log_with_timestamp "Readiness check performed"
        ;;
    
    "can-start")
        result=$(node "$CORE_DIR/autonomous-engine.js" can-start)
        if [ "$result" = "true" ]; then
            echo -e "${GREEN}✅ Safe to start development servers${NC}"
        else
            echo -e "${YELLOW}⚠️ Development servers already running${NC}"
        fi
        log_with_timestamp "Can-start check: $result"
        ;;
    
    "build")
        echo -e "${BLUE}🏗️ Monitoring build process...${NC}"
        npm run build 2>&1 | tee "$LOGS_DIR/build.log"
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            echo -e "${GREEN}✅ Build successful${NC}"
            
            # Get build size if possible
            if [ -d "dist" ]; then
                SIZE=$(du -sh dist/ | cut -f1)
                echo -e "${GREEN}📦 Build size: $SIZE${NC}"
            elif [ -d "build" ]; then
                SIZE=$(du -sh build/ | cut -f1)
                echo -e "${GREEN}📦 Build size: $SIZE${NC}"
            fi
        else
            echo -e "${RED}❌ Build failed${NC}"
        fi
        log_with_timestamp "Build process completed"
        ;;
    
    "lint")
        if [ "$2" = "fix" ]; then
            echo -e "${BLUE}🧹 Running lint with auto-fix...${NC}"
            npm run lint -- --fix 2>&1 | tee "$LOGS_DIR/lint.log"
            echo -e "${GREEN}✅ Lint auto-fix completed${NC}"
            log_with_timestamp "Lint auto-fix executed"
        else
            echo -e "${BLUE}🧹 Checking lint status...${NC}"
            npm run lint 2>&1 | tee "$LOGS_DIR/lint.log"
            log_with_timestamp "Lint check performed"
        fi
        ;;
    
    "typecheck")
        echo -e "${BLUE}🔧 Checking TypeScript compilation...${NC}"
        npx tsc --noEmit --skipLibCheck 2>&1 | tee "$LOGS_DIR/typecheck.log"
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            echo -e "${GREEN}✅ TypeScript compilation clean${NC}"
        else
            echo -e "${RED}❌ TypeScript errors found${NC}"
        fi
        log_with_timestamp "TypeScript check performed"
        ;;
    
    "snapshot")
        echo -e "${BLUE}📸 Creating development snapshot...${NC}"
        TIMESTAMP=$(date +%s)
        node "$CORE_DIR/autonomous-engine.js" scan > "$STATUS_DIR/snapshot-$TIMESTAMP.json"
        echo -e "${GREEN}✅ Snapshot saved to $STATUS_DIR/snapshot-$TIMESTAMP.json${NC}"
        log_with_timestamp "Development snapshot created: snapshot-$TIMESTAMP.json"
        ;;
    
    "monitor")
        echo -e "${BLUE}👁️ Starting development monitoring...${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop monitoring${NC}"
        log_with_timestamp "Development monitoring started"
        
        while true; do
            # Check for TypeScript errors
            if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error TS"; then
                echo -e "${RED}❌ TypeScript errors detected$(date '+%H:%M:%S')${NC}" | tee -a "$LOGS_DIR/monitor.log"
            fi
            
            # Check if dev server is responsive
            if command -v curl >/dev/null 2>&1; then
                if ! curl -s http://localhost:5173 > /dev/null 2>&1 && ! curl -s http://localhost:3000 > /dev/null 2>&1; then
                    echo -e "${RED}💥 Development server appears to be down$(date '+%H:%M:%S')${NC}" | tee -a "$LOGS_DIR/monitor.log"
                fi
            fi
            
            sleep 10
        done
        ;;
    
    "activity")
        TIMEFRAME=${2:-"30 minutes ago"}
        echo -e "${BLUE}📊 Analyzing recent activity (since $TIMEFRAME)...${NC}"
        
        # Analyze recent log files
        echo -e "${YELLOW}Recent Errors:${NC}"
        find "$LOGS_DIR" -name "*.log" -newermt "$TIMEFRAME" -exec grep -l "error\|ERROR\|failed\|FAILED" {} \; | while read file; do
            echo "📁 $(basename "$file"):"
            tail -5 "$file" | grep -i "error\|failed" | head -3
        done
        
        echo -e "${YELLOW}Recent Success Messages:${NC}"
        find "$LOGS_DIR" -name "*.log" -newermt "$TIMEFRAME" -exec grep -l "success\|SUCCESS\|compiled\|ready" {} \; | while read file; do
            echo "📁 $(basename "$file"):"
            tail -5 "$file" | grep -i "success\|compiled\|ready" | head -2
        done
        
        log_with_timestamp "Activity analysis requested for timeframe: $TIMEFRAME"
        ;;
    
    "logs")
        LOG_TYPE=${2:-"all"}
        echo -e "${BLUE}📝 Displaying recent logs ($LOG_TYPE)...${NC}"
        
        case "$LOG_TYPE" in
            "dev"|"development")
                if [ -f "$LOGS_DIR/dev-server.log" ]; then
                    echo -e "${YELLOW}Development Server Log (last 20 lines):${NC}"
                    tail -20 "$LOGS_DIR/dev-server.log"
                fi
                ;;
            "build")
                if [ -f "$LOGS_DIR/build.log" ]; then
                    echo -e "${YELLOW}Build Log (last 20 lines):${NC}"
                    tail -20 "$LOGS_DIR/build.log"
                fi
                ;;
            "all"|*)
                echo -e "${YELLOW}All Recent Logs:${NC}"
                for logfile in "$LOGS_DIR"/*.log; do
                    if [ -f "$logfile" ]; then
                        echo -e "${BLUE}=== $(basename "$logfile") ===${NC}"
                        tail -10 "$logfile"
                        echo
                    fi
                done
                ;;
        esac
        
        log_with_timestamp "Logs viewed: $LOG_TYPE"
        ;;
    
    "alerts")
        echo -e "${BLUE}🚨 Checking for system alerts...${NC}"
        
        # Check for critical issues
        ALERTS=0
        
        # Check TypeScript errors
        if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error TS"; then
            echo -e "${RED}🚨 TypeScript compilation errors detected${NC}"
            ALERTS=$((ALERTS + 1))
        fi
        
        # Check for build failures
        if [ -f "$LOGS_DIR/build.log" ] && tail -10 "$LOGS_DIR/build.log" | grep -q "failed\|error"; then
            echo -e "${RED}🚨 Recent build failures detected${NC}"
            ALERTS=$((ALERTS + 1))
        fi
        
        # Check for server crashes
        if [ -f "$LOGS_DIR/dev-server.log" ] && tail -10 "$LOGS_DIR/dev-server.log" | grep -q "crash\|exit\|killed"; then
            echo -e "${RED}🚨 Development server crash detected${NC}"
            ALERTS=$((ALERTS + 1))
        fi
        
        if [ $ALERTS -eq 0 ]; then
            echo -e "${GREEN}✅ No critical alerts${NC}"
        else
            echo -e "${YELLOW}⚠️ $ALERTS alert(s) found${NC}"
        fi
        
        log_with_timestamp "Alert check performed: $ALERTS alerts found"
        ;;
    
    "help"|"--help"|"-h")
        echo -e "${BLUE}Claude Autonomous Development Interface${NC}"
        echo -e "${BLUE}=====================================\n${NC}"
        echo -e "${YELLOW}Environmental Awareness:${NC}"
        echo "  status      - Quick environment status check"
        echo "  scan        - Detailed JSON environment analysis"
        echo "  ready       - Comprehensive readiness validation"
        echo "  can-start   - Check if safe to start servers"
        echo "  snapshot    - Create development checkpoint"
        echo
        echo -e "${YELLOW}Development Intelligence:${NC}"
        echo "  build       - Build process monitoring with metrics"
        echo "  lint [fix]  - Lint analysis with optional auto-fix"
        echo "  typecheck   - TypeScript compilation validation"
        echo
        echo -e "${YELLOW}Monitoring & Safety:${NC}"
        echo "  monitor     - Real-time development monitoring"
        echo "  activity [time] - Recent activity analysis"
        echo "  logs [type] - View development logs"
        echo "  alerts      - Check for system alerts"
        echo
        echo -e "${YELLOW}Examples:${NC}"
        echo "  ./claude status"
        echo "  ./claude lint fix"
        echo "  ./claude activity '1 hour ago'"
        echo "  ./claude logs build"
        ;;
    
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo -e "${YELLOW}Use './claude help' for available commands${NC}"
        log_with_timestamp "Unknown command attempted: $1"
        exit 1
        ;;
esac