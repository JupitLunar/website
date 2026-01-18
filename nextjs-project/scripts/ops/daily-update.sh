#!/bin/bash

###############################################################################
# 每日自动更新脚本
# 用途：自动抓取最新文章并更新数据库
# 建议：每天运行2-3次（第1-2周）或每天1次（之后）
###############################################################################

set -e  # 出错时退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

log "=========================================="
log "开始每日更新流程"
log "=========================================="

# 进入项目目录
cd "$PROJECT_DIR"
log "工作目录: $PROJECT_DIR"

# 1. 检查环境变量
log "检查环境变量..."
if [ ! -f ".env.local" ]; then
    error ".env.local 文件不存在"
    exit 1
fi

# 2. 运行爬虫
log "运行全球爬虫..."
node scripts/global-auto-scraper.js 2>&1 | tee -a logs/scraper-$(date +%Y-%m-%d).log

# 检查爬虫是否成功
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    log "✅ 爬虫运行成功"
else
    error "爬虫运行失败"
    exit 1
fi

# 3. 更新地区信息（如果有新文章）
log "更新文章地区信息..."
node scripts/update-article-regions.js 2>&1 | tee -a logs/update-$(date +%Y-%m-%d).log

# 4. 查看统计信息
log "查看最新统计..."
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  try {
    const { count } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    console.log('\n📊 数据库统计:');
    console.log('总文章数:', count);

    const regions = ['US', 'UK', 'CA', 'AU', 'NZ', 'SG', 'EU', 'Global'];
    console.log('\n按地区分布:');
    for (const region of regions) {
      const { data } = await supabase
        .from('articles')
        .select('id')
        .eq('region', region);
      if (data && data.length > 0) {
        console.log(\`  [\${region}]: \${data.length} 篇\`);
      }
    }

    // 最新文章
    const { data: latest } = await supabase
      .from('articles')
      .select('title, region, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('\n最新5篇文章:');
    latest.forEach((a, i) => {
      const date = new Date(a.created_at).toLocaleDateString();
      console.log(\`  \${i+1}. [\${a.region}] \${a.title.substring(0, 50)} (\${date})\`);
    });
  } catch (error) {
    console.error('统计失败:', error.message);
    process.exit(1);
  }
})();
"

if [ $? -eq 0 ]; then
    log "✅ 统计完成"
else
    warning "统计失败"
fi

# 5. 清理旧日志（保留30天）
log "清理旧日志..."
find logs/ -name "*.log" -mtime +30 -delete 2>/dev/null || true

# 6. 触发网站重新生成（如果使用Vercel等）
if [ ! -z "$DEPLOY_HOOK_URL" ]; then
    log "触发网站重新部署..."
    curl -X POST "$DEPLOY_HOOK_URL" || warning "部署触发失败"
fi

log "=========================================="
log "✅ 每日更新流程完成"
log "=========================================="

# 可选：发送通知
if [ ! -z "$WEBHOOK_URL" ]; then
    curl -X POST "$WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "{\"text\": \"✅ 每日文章更新完成 - $(date +'%Y-%m-%d %H:%M:%S')\"}" \
      || true
fi
