#!/bin/bash

# Web Scraper API测试脚本
# 使用方法: ./test-scraper-api.sh

# 配置
API_URL="http://localhost:3000"  # 开发环境
# API_URL="https://yourdomain.com"  # 生产环境
API_KEY="your_api_key_here"  # 替换为你的API密钥

echo "🧪 测试Web Scraper API"
echo "================================"
echo ""

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 测试获取配置
echo "1️⃣  测试获取爬虫配置..."
response=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $API_KEY" \
  "$API_URL/api/scraper/run")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✅ 成功${NC}"
  echo "$body" | jq '.'
else
  echo -e "${RED}❌ 失败 (HTTP $http_code)${NC}"
  echo "$body"
fi

echo ""
echo "================================"
echo ""

# 2. 测试运行爬虫
echo "2️⃣  测试运行爬虫（可能需要几分钟）..."
response=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sources": ["CDC"]}' \
  "$API_URL/api/scraper/run")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✅ 成功${NC}"
  echo "$body" | jq '.'
else
  echo -e "${RED}❌ 失败 (HTTP $http_code)${NC}"
  echo "$body"
fi

echo ""
echo "================================"
echo ""

# 3. 测试查询状态
echo "3️⃣  测试查询爬虫状态..."
response=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $API_KEY" \
  "$API_URL/api/scraper/status")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✅ 成功${NC}"
  echo "$body" | jq '.'
else
  echo -e "${RED}❌ 失败 (HTTP $http_code)${NC}"
  echo "$body"
fi

echo ""
echo "================================"
echo "🎉 测试完成！"

