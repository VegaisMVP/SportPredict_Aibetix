#!/bin/bash

# Security scan script - Detect sensitive information leaks in the codebase
# Usage: ./security-scan.sh

echo "🔍 Starting security scan..."

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check results
SCAN_RESULT=0

echo -e "\n${YELLOW}1. Check for hardcoded API keys and private keys...${NC}"
if grep -r -i "api.*key.*['\"][^'\"]*['\"]" . --exclude-dir=node_modules --exclude-dir=.git --exclude=security-scan.sh | grep -v "Please configure via environment variables\|via KMS" | grep -v "your-api-key-here\|your-actual-ai-backend"; then
    echo -e "${RED}❌ Found hardcoded API keys${NC}"
    SCAN_RESULT=1
else
    echo -e "${GREEN}✅ No hardcoded API keys found${NC}"
fi

echo -e "\n${YELLOW}2. Check JWT secrets...${NC}"
if grep -r -i "jwt.*secret.*['\"][^'\"]*['\"]" . --exclude-dir=node_modules --exclude-dir=.git --exclude=security-scan.sh | grep -v "Please configure via environment variables\|via KMS"; then
    echo -e "${RED}❌ Found hardcoded JWT secret${NC}"
    SCAN_RESULT=1
else
    echo -e "${GREEN}✅ No hardcoded JWT secret found${NC}"
fi

echo -e "\n${YELLOW}3. Check Solana private keys...${NC}"
if grep -r -i "private.*key.*['\"][^'\"]*['\"]" . --exclude-dir=node_modules --exclude-dir=.git --exclude=security-scan.sh | grep -v "Please configure via environment variables\|via KMS"; then
    echo -e "${RED}❌ Found hardcoded private key${NC}"
    SCAN_RESULT=1
else
    echo -e "${GREEN}✅ No hardcoded private key found${NC}"
fi

echo -e "\n${YELLOW}4. Check database passwords...${NC}"
if grep -r -i "password.*['\"][^'\"]*['\"]" . --exclude-dir=node_modules --exclude-dir=.git --exclude=security-scan.sh | grep -v "password.*123\|password.*test\|Please configure via environment variables\|via KMS" | grep -v "username:password"; then
    echo -e "${RED}❌ Found hardcoded database password${NC}"
    SCAN_RESULT=1
else
    echo -e "${GREEN}✅ No hardcoded database password found${NC}"
fi

echo -e "\n${YELLOW}5. Check environment variable files...${NC}"
if [ -f ".env" ]; then
    echo -e "${RED}❌ Found .env file, please ensure it's added to .gitignore${NC}"
    SCAN_RESULT=1
else
    echo -e "${GREEN}✅ No .env file found${NC}"
fi

echo -e "\n${YELLOW}6. Check sensitive files...${NC}"
SENSITIVE_FILES=("*.pem" "*.key" "*.p12" "*.pfx" "id_rsa" "id_dsa" "*.crt" "*.cert")
for pattern in "${SENSITIVE_FILES[@]}"; do
    if find . -name "$pattern" -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | grep -q .; then
        echo -e "${RED}❌ Found sensitive file: $pattern${NC}"
        SCAN_RESULT=1
    fi
done

echo -e "\n${YELLOW}7. Check Firebase configuration...${NC}"
if grep -r -i "firebase.*api.*key.*['\"][^'\"]*['\"]" . --exclude-dir=node_modules --exclude-dir=.git --exclude=security-scan.sh | grep -v "Please configure via environment variables\|via KMS" | grep -v "your-api-key-here"; then
    echo -e "${RED}❌ Found hardcoded Firebase API key${NC}"
    SCAN_RESULT=1
else
    echo -e "${GREEN}✅ No hardcoded Firebase API key found${NC}"
fi

if [ $SCAN_RESULT -eq 0 ]; then
    echo -e "\n${GREEN}✅ Security scan passed! No sensitive information leaks detected${NC}"
else
    echo -e "\n${RED}❌ Security scan failed! Sensitive information leaks detected, please fix immediately${NC}"
fi

echo -e "\n${YELLOW}Security recommendations:${NC}"
echo "1. All private keys, secrets, and API keys must be obtained via KMS/third-party API"
echo "2. Do not store sensitive information in plaintext in codebases, environment variables, or frontends"
echo "3. Regularly run this scan script to check security status"
echo "4. Use environment variables and secure key management services"

exit $SCAN_RESULT 