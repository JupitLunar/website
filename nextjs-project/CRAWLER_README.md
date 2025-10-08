# 🤖 母婴内容自动爬虫系统

## 📊 当前状态

✅ **已抓取文章数: 134篇**

- **AAP (American Academy of Pediatrics)**: ~90篇
- **KidsHealth**: ~40篇
- **Mayo Clinic**: 少量

## 🎯 系统能力

### ✅ 已实现功能

1. **自动发现文章** - 从权威网站目录页自动发现所有母婴相关文章
2. **智能过滤** - 自动跳过非内容页（导航、工具页等）
3. **去重处理** - 自动检测并跳过已抓取的文章
4. **质量控制** - 只保存高质量、内容充实的文章
5. **增量更新** - 每次运行只抓取新文章
6. **并发控制** - 礼貌爬取，避免对服务器造成压力

### 📦 可抓取的内容来源

| 来源 | 当前发现 | 预计总量 | 质量评级 |
|------|---------|---------|---------|
| AAP (HealthyChildren.org) | 122篇 | 200+ | A |
| KidsHealth | 25篇 | 50+ | A |
| Mayo Clinic | 需要sitemap | 100+ | A |
| 其他权威来源 | 待添加 | 500+ | A |

**总计可抓取: 500+ 篇权威母婴文章**

## 🚀 使用方法

### 1. 手动运行爬虫

```bash
# 运行自动爬虫（每次抓取最多50篇新文章）
node scripts/auto-scraper.js

# 查看当前文章数量
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
(async () => {
  const { count } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });
  console.log('文章总数:', count);
})();
"
```

### 2. 配置每日自动运行（推荐）

#### 方案A: 使用GitHub Actions (推荐)

创建 `.github/workflows/daily-scraper.yml`:

```yaml
name: Daily Content Scraper

on:
  schedule:
    # 每天凌晨2点运行（UTC时间）
    - cron: '0 2 * * *'
  workflow_dispatch: # 允许手动触发

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd nextjs-project
          npm install

      - name: Run scraper
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          cd nextjs-project
          node scripts/auto-scraper.js
```

**设置GitHub Secrets:**
1. 进入仓库 Settings → Secrets and variables → Actions
2. 添加:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

#### 方案B: 使用cron (Linux/Mac)

```bash
# 编辑crontab
crontab -e

# 添加以下行（每天凌晨2点运行）
0 2 * * * cd /path/to/nextjs-project && node scripts/auto-scraper.js >> /tmp/scraper.log 2>&1
```

#### 方案C: 使用Vercel Cron Jobs

在 `vercel.json` 中添加:

```json
{
  "crons": [{
    "path": "/api/cron/scraper",
    "schedule": "0 2 * * *"
  }]
}
```

创建 `/api/cron/scraper/route.ts`:

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  // 验证cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { stdout } = await execAsync('node scripts/auto-scraper.js');
    return Response.json({ success: true, output: stdout });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
```

## ⚙️ 配置选项

编辑 `scripts/auto-scraper.js` 中的 `CONFIG`:

```javascript
const CONFIG = {
  delayBetweenRequests: 1000,      // 请求间隔（毫秒）
  delayBetweenArticles: 2000,      // 文章抓取间隔（毫秒）
  maxArticlesPerRun: 50,           // 每次运行最多抓取文章数
  minContentLength: 500,           // 最小内容长度
  maxContentLength: 50000          // 最大内容长度
};
```

## 📈 扩展更多来源

### 添加新的权威来源

编辑 `scripts/auto-scraper.js`，添加新的发现函数:

```javascript
async function discoverNHSArticles() {
  console.log('🔍 发现NHS文章...');

  const categoryUrls = [
    'https://www.nhs.uk/conditions/baby/',
    // 更多分类...
  ];

  const articles = new Set();

  for (const url of categoryUrls) {
    const html = await fetch(url);
    const $ = cheerio.load(html);

    // 提取文章链接
    $('a[href*="/conditions/baby/"]').each((i, elem) => {
      const href = $(elem).attr('href');
      // 处理URL...
    });
  }

  return Array.from(articles);
}
```

### 当前可以添加的权威来源

1. **NHS (UK)** - https://www.nhs.uk/conditions/baby/
2. **Health Canada** - https://www.canada.ca/en/health-canada
3. **WHO** - https://www.who.int
4. **Cleveland Clinic** - https://my.clevelandclinic.org
5. **Stanford Children's Health**
6. **La Leche League** - 母乳喂养专家

## 🔍 监控和维护

### 查看爬取统计

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { count } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  console.log('总文章数:', count);

  // 按来源统计
  const sources = ['AAP', 'KidsHealth', 'Mayo'];
  for (const source of sources) {
    const { data } = await supabase
      .from('articles')
      .select('id')
      .ilike('license', \`%\${source}%\`);
    console.log(\`  \${source}:\`, data.length, '篇');
  }
})();
"
```

### 清理重复文章

```bash
# 查找重复的slug
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data } = await supabase.rpc('find_duplicate_slugs');
  console.log('重复的slugs:', data);
})();
"
```

## 🎯 下一步计划

- [ ] 添加更多权威来源（NHS, Health Canada, WHO等）
- [ ] 使用sitemap.xml来发现Mayo Clinic文章
- [ ] 添加图片下载和本地存储
- [ ] 实现全文搜索和向量化（for RAG）
- [ ] 添加邮件通知（每日爬取报告）
- [ ] 实现智能分类和标签
- [ ] 添加多语言支持

## 📝 日志和调试

爬虫运行日志存储在:
- 原始抓取数据: `nextjs-project/data/scraped/`
- 运行日志: 控制台输出

## ⚠️ 注意事项

1. **礼貌爬取**: 已设置合理的延迟时间，避免对网站造成压力
2. **合规性**: 确保遵守各网站的robots.txt和使用条款
3. **内容归属**: 所有文章都正确标注了来源和许可信息
4. **定期更新**: 建议每天运行一次，保持内容新鲜
5. **监控失败**: 定期检查失败的抓取，可能是网站结构变更

## 🔧 故障排除

### 问题: 抓取失败率高

**解决方案:**
- 检查网站结构是否变更
- 增加延迟时间
- 检查网络连接

### 问题: 数据库连接失败

**解决方案:**
- 检查 `.env.local` 中的环境变量
- 验证Supabase服务是否正常

### 问题: 内容质量不足

**解决方案:**
- 调整 `minContentLength` 参数
- 检查选择器是否正确

## 📞 支持

如有问题，请查看:
1. 爬虫日志输出
2. Supabase错误日志
3. 网站的robots.txt文件
