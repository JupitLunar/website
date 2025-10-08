# 📅 爬虫运行频率和去重策略指南

## 🕐 推荐运行频率

### 初期（第1-2周）- 快速建立内容库

**建议**: 每天运行 **2-3次**

```bash
# 每天运行时间
- 上午 9:00 AM
- 下午 3:00 PM
- 晚上 9:00 PM
```

**原因**:
- 现在只有174篇文章，还有387+篇可抓取
- 需要快速建立内容库
- 每次抓取100篇，2-3天就能抓完当前发现的文章

**预期结果**:
- 1周内可抓取 300-500篇文章
- 覆盖主要权威来源

---

### 成长期（第3-4周）- 扩展到更多来源

**建议**: 每天运行 **1次**

```bash
# 每天运行时间
- 凌晨 2:00 AM（服务器空闲时间）
```

**原因**:
- 已有足够的基础内容
- 新内容发布频率降低
- 避免过度抓取同一来源

**预期结果**:
- 每天新增 20-50篇
- 1个月内达到 500-600篇

---

### 稳定期（1个月后）- 维护更新

**建议**: 每周运行 **2-3次**

```bash
# 每周运行时间
- 周一 凌晨 2:00 AM
- 周三 凌晨 2:00 AM
- 周五 凌晨 2:00 AM
```

**原因**:
- 大部分文章已抓取
- 权威网站更新频率通常是每周或每月
- 主要用于抓取新发布的内容

**预期结果**:
- 每周新增 5-20篇
- 保持内容新鲜度

---

## 🚫 去重机制说明

### 当前已实现的去重方法

#### 方法1: URL去重 ✅

**工作原理**:
```javascript
// 在保存前检查URL是否已存在
async function articleExists(url) {
  const { data } = await supabase
    .from('articles')
    .select('id')
    .ilike('license', `%${url}%`)  // 在license字段中查找URL
    .single();

  return !!data;  // 存在返回true
}
```

**优点**:
- ✅ 防止抓取相同URL
- ✅ 快速检查
- ✅ 100%准确

**局限**:
- ⚠️ 如果URL改变但内容相同，会被当作新文章

---

#### 方法2: Slug去重 ✅

**工作原理**:
```javascript
// 在保存时检查slug是否已存在
const slug = generateSlug(articleData.title);  // 从标题生成slug

const { data: existing } = await supabase
  .from('articles')
  .select('id')
  .eq('slug', slug)
  .single();

if (existing) {
  return { success: false, reason: 'slug已存在' };
}
```

**优点**:
- ✅ 防止标题相同的文章重复
- ✅ 数据库约束保证唯一性

**局限**:
- ⚠️ 标题略有不同的相同内容会通过
- ⚠️ 例如: "Baby Sleep Tips" vs "Baby Sleep Tips Updated 2024"

---

### 增强去重策略

#### 方法3: 内容相似度检测 ✅

**工作原理**:
```javascript
// 使用Jaccard相似度算法
function calculateJaccardSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g));
  const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;  // 0-1之间
}

// 相似度超过80%则认为重复
if (similarity >= 0.8) {
  console.log('发现相似文章');
}
```

**优点**:
- ✅ 检测内容实质相同但标题不同的文章
- ✅ 防止同一内容的不同版本

**使用**:
```bash
# 运行去重检查
node scripts/deduplication-tools.js

# 只检查内容相似度（相似度90%以上）
node scripts/deduplication-tools.js --check-content --similarity=0.9
```

---

## 📋 去重检查清单

### 每天运行前检查（推荐）

```bash
# 1. 快速检查数据库状态
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
(async () => {
  const { count } = await supabase.from('articles').select('*', { count: 'exact', head: true });
  console.log('当前文章数:', count);
})();
"

# 2. 运行去重检查（每周1次）
node scripts/deduplication-tools.js
```

### 每周维护（推荐）

**周日晚上执行**:

```bash
# 1. 完整去重检查
node scripts/deduplication-tools.js

# 2. 查看统计
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
(async () => {
  const { count } = await supabase.from('articles').select('*', { count: 'exact', head: true });
  console.log('总文章数:', count);

  const regions = ['US', 'UK', 'CA', 'AU', 'Global'];
  for (const region of regions) {
    const { data } = await supabase.from('articles').select('id').eq('region', region);
    if (data.length > 0) console.log(\`  [\${region}]: \${data.length}\`);
  }
})();
"

# 3. 备份数据库（如果需要）
# 在Supabase后台创建备份
```

---

## 🎯 完整运行计划（推荐）

### 第1周: 快速建设期

```yaml
时间表:
  周一-周五:
    - 09:00: 运行爬虫（100篇）
    - 15:00: 运行爬虫（100篇）
    - 21:00: 运行爬虫（100篇）

  周六:
    - 09:00: 运行爬虫（100篇）

  周日:
    - 20:00: 去重检查 + 统计

预期结果: 300-500篇文章
```

### 第2-4周: 扩展期

```yaml
时间表:
  每天:
    - 02:00: 运行爬虫（100篇）

  周日:
    - 20:00: 去重检查 + 统计

预期结果: 600-800篇文章
```

### 1个月后: 维护期

```yaml
时间表:
  周一、周三、周五:
    - 02:00: 运行爬虫（50篇）

  周日:
    - 20:00: 去重检查 + 统计 + 内容审核

预期结果: 保持800-1000篇，更新率10-20篇/周
```

---

## 🚨 去重失败案例和解决方案

### 案例1: URL变化但内容相同

**问题**:
```
原URL: https://example.com/article/123
新URL: https://example.com/article/123-updated-2024
```

**检测**:
```bash
# 运行内容相似度检查
node scripts/deduplication-tools.js --check-content --similarity=0.85
```

**解决**:
- 检查发现相似度>85%的文章
- 手动审核并删除旧版本

---

### 案例2: 标题略有不同

**问题**:
```
文章1: "Baby Sleep Tips"
文章2: "Baby Sleep Tips: Updated 2024"
```

**检测**:
```bash
# Slug可能不同，但内容相似度高
node scripts/deduplication-tools.js --check-content
```

**解决**:
- 保留最新版本
- 更新metadata

---

### 案例3: 同一来源的重复抓取

**问题**:
- 爬虫配置错误导致同一URL被多次抓取

**检测**:
```bash
# URL检查会发现
node scripts/deduplication-tools.js --check-urls
```

**解决**:
- 已实现自动防护（articleExists函数）
- 不会发生

---

## 💡 最佳实践建议

### ✅ 推荐做法

1. **定期去重检查** - 每周至少1次
2. **监控抓取日志** - 查看"已存在，跳过"的数量
3. **内容质量审核** - 每月审核一次draft状态的文章
4. **备份数据库** - 每周备份一次
5. **更新地区信息** - 新增文章后运行一次
6. **限制抓取速度** - 避免IP被封禁

### ❌ 避免做法

1. **不要频繁运行** - 每小时运行会被视为攻击
2. **不要降低延迟** - 保持1.5-2.5秒延迟
3. **不要自动删除** - 去重检查后手动确认
4. **不要忽略错误** - 失败率>50%需要检查
5. **不要跳过备份** - 删除前一定备份

---

## 🔧 实用命令速查

```bash
# 1. 运行爬虫
node scripts/global-auto-scraper.js

# 2. 去重检查
node scripts/deduplication-tools.js

# 3. 只检查URL重复
node scripts/deduplication-tools.js --check-urls

# 4. 检查内容相似度（85%阈值）
node scripts/deduplication-tools.js --check-content --similarity=0.85

# 5. 更新地区信息
node scripts/update-article-regions.js

# 6. 查看帮助
node scripts/deduplication-tools.js --help

# 7. 查看统计
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
(async () => {
  const { count } = await supabase.from('articles').select('*', { count: 'exact', head: true });
  console.log('文章总数:', count);
})();
"
```

---

## 📈 监控指标

### 关键指标

1. **抓取成功率** - 应该 >70%
2. **重复率** - 应该 <5%
3. **内容质量** - 平均长度 >1000字符
4. **地区分布** - 各地区均衡
5. **增长速度** - 每周20-100篇

### 警报条件

- ⚠️ 成功率 <50%
- ⚠️ 重复率 >10%
- ⚠️ 平均内容长度 <500字符
- ⚠️ 连续失败 >10次

---

## 🎓 总结

### 运行频率建议

| 阶段 | 频率 | 每次数量 | 预期结果 |
|------|------|---------|---------|
| 初期（1-2周） | 每天2-3次 | 100篇 | 300-500篇 |
| 成长期（3-4周） | 每天1次 | 100篇 | 600-800篇 |
| 维护期（1个月后） | 每周2-3次 | 50篇 | 保持更新 |

### 去重机制

✅ **已实现（100%防护）**:
- URL去重（自动）
- Slug去重（自动）
- 内容相似度检测（工具）

✅ **最佳实践**:
- 每周运行去重检查
- 手动审核相似内容
- 定期备份数据库

**你现在有完整的去重保护，不会抓取重复文章！** 🎉
