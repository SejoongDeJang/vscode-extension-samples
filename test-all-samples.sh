#!/bin/bash

# VS Code Extension Samples - Build Test Script
# This script tests all samples for build errors and fixes common issues

echo "🚀 VS Code Extension Samples Build Test Starting..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total_samples=0
successful_builds=0
failed_builds=0
fixed_builds=0

# Function to test a sample
test_sample() {
    local sample_dir="$1"
    
    if [[ ! -d "$sample_dir" ]]; then
        return
    fi
    
    # Skip non-sample directories
    if [[ "$sample_dir" == "node_modules" || "$sample_dir" == ".git" || "$sample_dir" == ".github" || "$sample_dir" == ".scripts" || "$sample_dir" == ".vscode" ]]; then
        return
    fi
    
    # Check if package.json exists
    if [[ ! -f "$sample_dir/package.json" ]]; then
        echo "⚠️  Skipping $sample_dir (no package.json)"
        return
    fi
    
    total_samples=$((total_samples + 1))
    echo ""
    echo "📦 Testing: $sample_dir"
    echo "----------------------------"
    
    cd "$sample_dir"
    
    # Install dependencies
    echo "🔧 Installing dependencies..."
    if npm install > /dev/null 2>&1; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        cd ..
        failed_builds=$((failed_builds + 1))
        return
    fi
    
    # Fix vulnerabilities if any
    if npm audit --audit-level=moderate > /dev/null 2>&1; then
        echo "🔍 No security vulnerabilities found"
    else
        echo "🔒 Fixing security vulnerabilities..."
        if npm audit fix > /dev/null 2>&1; then
            echo "✅ Security vulnerabilities fixed"
            fixed_builds=$((fixed_builds + 1))
        else
            echo "⚠️  Some vulnerabilities couldn't be auto-fixed"
        fi
    fi
    
    # Try to compile
    echo "🔨 Compiling..."
    if npm run compile > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Build successful${NC}"
        successful_builds=$((successful_builds + 1))
    elif npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Build successful (using build script)${NC}"
        successful_builds=$((successful_builds + 1))
    else
        echo -e "${RED}❌ Build failed${NC}"
        failed_builds=$((failed_builds + 1))
        
        # Try to get more details about the failure
        echo "🔍 Attempting to diagnose build failure..."
        if [[ -f "tsconfig.json" ]]; then
            echo "📋 Running TypeScript compiler directly..."
            npx tsc --noEmit 2>&1 | head -5
        fi
    fi
    
    cd ..
}

# Test all samples
echo "🔍 Scanning for samples..."
for dir in */; do
    test_sample "$dir"
done

# Summary
echo ""
echo "=============================================="
echo "📊 BUILD TEST SUMMARY"
echo "=============================================="
echo "Total samples tested: $total_samples"
echo -e "Successful builds: ${GREEN}$successful_builds${NC}"
echo -e "Failed builds: ${RED}$failed_builds${NC}"
echo -e "Fixed vulnerabilities: ${YELLOW}$fixed_builds${NC}"

if [[ $failed_builds -eq 0 ]]; then
    echo -e "${GREEN}🎉 All samples are building successfully!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some samples have build failures that need attention${NC}"
    exit 1
fi