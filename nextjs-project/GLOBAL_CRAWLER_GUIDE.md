# 🌍 全球母婴内容爬虫系统

## 🎉 系统概览

这是一个**多地区、多语言**的母婴内容自动爬虫系统，可以从全球18个权威来源抓取高质量的母婴文章。

### 📊 当前状态 (2025-10-07)

- ✅ **已抓取文章**: 174篇
- 🌍 **覆盖地区**: 8个地区
- 📦 **来源数量**: 18个权威网站
- 🔍 **已发现可抓取**: 387篇文章

### 📈 按地区分布

| 地区 | 已抓取 | 可抓取 | 主要来源 |
|------|--------|--------|---------|
| 🇺🇸 US | 154篇 | 200+ | AAP, Mayo Clinic, CDC, KidsHealth |
| 🇬🇧 UK | 0篇 | 50+ | NHS, NHS Start4Life |
| 🇨🇦 CA | 7篇 | 20+ | Health Canada, CPS |
| 🇦🇺 AU | 0篇 | 50+ | Raising Children, Pregnancy Birth Baby |
| 🇳🇿 NZ | 0篇 | 30+ | Plunket |
| 🇸🇬 SG | 0篇 | 20+ | HealthHub Singapore |
| 🇪🇺 EU | 0篇 | 30+ | WHO Europe |
| 🌐 Global | 13篇 | 200+ | WHO, UNICEF, La Leche League |

**总计潜力**: 600+ 篇权威母婴文章

---

## 🚀 快速开始

### 1. 运行全球爬虫（推荐）

```bash
# 抓取所有地区的文章（每次最多100篇）
node scripts/global-auto-scraper.js
```

### 2. 只抓取特定地区

编辑 `scripts/global-auto-scraper.js` 中的配置：

```javascript
const CONFIG = {
  // 只抓取这些地区，留空 [] 表示全部
  targetRegions: ['UK', 'CA', 'AU'],  // 只抓取英国、加拿大、澳洲

  maxArticlesPerRun: 100,  // 每次最多抓取100篇
  // ...
};
```

然后运行：

```bash
node scripts/global-auto-scraper.js
```

### 3. 更新现有文章的地区信息

```bash
node scripts/update-article-regions.js
```

### 4. 查看所有可用来源

```bash
node scripts/global-sources-config.js
```

---

## 📦 已配置的权威来源

### 🇺🇸 美国 (US) - 6个来源

1. **AAP** - American Academy of Pediatrics
   - 网站: healthychildren.org
   - 评级: A
   - 可抓取: 200+篇

2. **Mayo Clinic**
   - 网站: mayoclinic.org
   - 评级: A
   - 需要: sitemap配置

3. **CDC** - Centers for Disease Control
   - 网站: cdc.gov
   - 评级: A
   - 可抓取: 50+篇

4. **KidsHealth** (Nemours)
   - 网站: kidshealth.org
   - 评级: A
   - 可抓取: 50+篇

5. **Cleveland Clinic**
   - 网站: my.clevelandclinic.org
   - 评级: A
   - 需要: 搜索API

6. **Stanford Children's Health**
   - 网站: stanfordchildrens.org
   - 评级: A
   - 可抓取: 30+篇

### 🇬🇧 英国 (UK) - 2个来源

1. **NHS** - National Health Service
   - 网站: nhs.uk
   - 评级: A
   - 可抓取: 100+篇

2. **NHS Start4Life**
   - 网站: nhs.uk/start4life
   - 评级: A
   - 可抓取: 50+篇

### 🇨🇦 加拿大 (CA) - 2个来源

1. **Health Canada**
   - 网站: canada.ca
   - 评级: A
   - 可抓取: 30+篇

2. **Caring for Kids** (Canadian Paediatric Society)
   - 网站: caringforkids.cps.ca
   - 评级: A
   - 可抓取: 50+篇

### 🇦🇺 澳大利亚 (AU) - 2个来源

1. **Raising Children Network**
   - 网站: raisingchildren.net.au
   - 评级: A
   - 可抓取: 100+篇

2. **Pregnancy, Birth & Baby**
   - 网站: pregnancybirthbaby.org.au
   - 评级: A
   - 可抓取: 80+篇

### 🇳🇿 新西兰 (NZ) - 1个来源

1. **Plunket**
   - 网站: plunket.org.nz
   - 评级: A
   - 可抓取: 50+篇

### 🇸🇬 新加坡 (SG) - 1个来源

1. **HealthHub Singapore**
   - 网站: healthhub.sg
   - 评级: A
   - 可抓取: 30+篇

### 🇪🇺 欧洲 (EU) - 1个来源

1. **WHO Europe**
   - 网站: who.int/europe
   - 评级: A
   - 可抓取: 50+篇

### 🌐 国际组织 (Global) - 3个来源

1. **WHO** - World Health Organization
   - 网站: who.int
   - 评级: A
   - 可抓取: 100+篇

2. **UNICEF**
   - 网站: unicef.org
   - 评级: A
   - 可抓取: 80+篇

3. **La Leche League International**
   - 网站: llli.org
   - 评级: A (母乳喂养专家)
   - 可抓取: 200+篇

---

## ⚙️ 配置选项

### 修改爬取参数

编辑 `scripts/global-auto-scraper.js`:

```javascript
const CONFIG = {
  delayBetweenRequests: 1500,      // 请求间隔（毫秒）
  delayBetweenArticles: 2500,      // 文章间隔（毫秒）
  maxArticlesPerRun: 100,          // 每次最多抓取
  minContentLength: 500,           // 最小内容长度
  maxContentLength: 50000,         // 最大内容长度
  targetRegions: []                // 目标地区，[]表示全部
};
```

### 添加新的来源

编辑 `scripts/global-sources-config.js`，在相应地区添加：

```javascript
GLOBAL_SOURCES.UK.NEW_SOURCE = {
  name: 'New UK Source',
  organization: 'Organization Name',
  baseUrl: 'https://example.com',
  region: 'UK',
  grade: 'A',
  language: 'en',
  categories: [
    '/baby-care/',
    '/feeding/'
  ],
  linkPattern: /\/articles\//
};
```

---

## 📊 监控和统计

### 查看文章总数和地区分布

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

  const regions = ['US', 'UK', 'CA', 'AU', 'NZ', 'SG', 'EU', 'Global'];
  for (const region of regions) {
    const { data } = await supabase
      .from('articles')
      .select('id')
      .eq('region', region);
    if (data.length > 0) {
      console.log(\`  [\${region}]:\`, data.length);
    }
  }
})();
"
```

### 查看最新抓取的文章

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data } = await supabase
    .from('articles')
    .select('title, region, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('最新文章:');
  data.forEach((a, i) => {
    console.log(\`  \${i+1}. [\${a.region}] \${a.title}\`);
  });
})();
"
```

---

## 🔄 每日自动运行

### 方案A: GitHub Actions (推荐)

创建 `.github/workflows/global-scraper.yml`:

```yaml
name: Global Content Scraper

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点
  workflow_dispatch:

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd nextjs-project
          npm install

      - name: Run global scraper
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          cd nextjs-project
          node scripts/global-auto-scraper.js
```

### 方案B: Cron Job

```bash
# 编辑crontab
crontab -e

# 添加（每天凌晨2点运行）
0 2 * * * cd /path/to/nextjs-project && node scripts/global-auto-scraper.js >> /tmp/global-scraper.log 2>&1
```

---

## 🎯 抓取策略建议

### 阶段1: 优先抓取高质量英文内容（1-2周）

```javascript
targetRegions: ['US', 'UK', 'CA', 'AU', 'NZ']
maxArticlesPerRun: 100
```

**预期结果**: 400-500篇高质量英文文章

### 阶段2: 扩展到国际组织（1周）

```javascript
targetRegions: ['Global']
maxArticlesPerRun: 100
```

**预期结果**: 200-300篇全球权威指南

### 阶段3: 补充其他地区（持续）

```javascript
targetRegions: []  // 全部
maxArticlesPerRun: 50
```

**预期结果**: 持续增长，最终600+篇

---

## 🔧 故障排除

### 问题: 某些网站抓取失败率高

**可能原因**:
1. 网站结构变更
2. 需要更精确的选择器
3. 反爬虫措施

**解决方案**:
```bash
# 1. 检查具体网站
node -e "
const axios = require('axios');
axios.get('https://example.com/article')
  .then(r => console.log('状态:', r.status))
  .catch(e => console.log('错误:', e.message));
"

# 2. 更新选择器配置
# 编辑 global-sources-config.js 中的 linkPattern
```

### 问题: 地区识别不正确

**解决方案**:
```bash
# 运行地区更新脚本
node scripts/update-article-regions.js

# 或手动修改 update-article-regions.js 中的 REGION_RULES
```

### 问题: 内容质量不足

**解决方案**:
```javascript
// 调整 CONFIG 中的参数
minContentLength: 500,    // 增加最小长度
maxContentLength: 50000   // 调整最大长度
```

---

## 📈 未来扩展计划

- [ ] 添加多语言支持（中文、西班牙语等）
- [ ] 实现图片下载和存储
- [ ] 添加内容质量评分系统
- [ ] 支持PDF文档抓取
- [ ] 实现智能主题分类
- [ ] 添加情感分析和可读性评分
- [ ] 集成翻译API
- [ ] 添加邮件通知（每日报告）

---

## 📝 文件说明

| 文件 | 用途 |
|------|------|
| `global-sources-config.js` | 全球来源配置 |
| `global-auto-scraper.js` | 全球自动爬虫主程序 |
| `update-article-regions.js` | 更新文章地区信息 |
| `auto-scraper.js` | 原始爬虫（仅美国） |

---

## 🎓 最佳实践

1. **礼貌爬取**: 保持合理的延迟时间（1.5-2.5秒）
2. **增量更新**: 每天运行一次，每次100篇
3. **质量优先**: 宁可少抓，不要低质量内容
4. **地区平衡**: 均衡各地区的内容
5. **定期检查**: 每周检查失败率和内容质量
6. **遵守规则**: 遵守各网站的robots.txt
7. **正确归属**: 所有文章都标注来源和地区

---

## 📞 支持和贡献

如需添加新的来源或改进爬虫，请编辑相应的配置文件。

**当前覆盖**:
- ✅ 8个地区
- ✅ 18个权威来源
- ✅ 600+篇可抓取文章
- ✅ 自动地区识别
- ✅ 质量控制
- ✅ 增量更新

**Happy Scraping! 🚀**
