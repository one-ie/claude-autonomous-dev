#!/bin/bash

LOGFILE="$1"
ANALYSIS_DIR=".claude/analysis"
ANALYSIS_FILE="$ANALYSIS_DIR/$(basename $LOGFILE .log)-analysis.txt"

mkdir -p "$ANALYSIS_DIR"

echo "🔍 Analyzing $LOGFILE..."

# Extract different types of messages
grep -i "error|failed|exception" "$LOGFILE" > "$ANALYSIS_FILE.errors" 2>/dev/null || touch "$ANALYSIS_FILE.errors"
grep -i "warn|warning" "$LOGFILE" > "$ANALYSIS_FILE.warnings" 2>/dev/null || touch "$ANALYSIS_FILE.warnings"
grep -i "success|compiled|ready|listening" "$LOGFILE" > "$ANALYSIS_FILE.success" 2>/dev/null || touch "$ANALYSIS_FILE.success"
grep -oE "http://[^[:space:]]+" "$LOGFILE" > "$ANALYSIS_FILE.urls" 2>/dev/null || touch "$ANALYSIS_FILE.urls"

# Generate summary
cat << SUMMARY > "$ANALYSIS_FILE"
=== LOG ANALYSIS SUMMARY ===
Timestamp: $(date)
Log File: $LOGFILE

Errors Found: $(wc -l < "$ANALYSIS_FILE.errors")
Warnings Found: $(wc -l < "$ANALYSIS_FILE.warnings")
Success Messages: $(wc -l < "$ANALYSIS_FILE.success")

Latest Error:
$(tail -1 "$ANALYSIS_FILE.errors" 2>/dev/null || echo "None")

Latest Success:
$(tail -1 "$ANALYSIS_FILE.success" 2>/dev/null || echo "None")

Available URLs:
$(cat "$ANALYSIS_FILE.urls" 2>/dev/null || echo "None found")
SUMMARY

cat "$ANALYSIS_FILE"
