# 🚀 爬虫快速开始指南

## ⚡ 5分钟快速上手

### 1. 立即运行爬虫

```bash
cd nextjs-project

# 运行全球爬虫（抓取100篇）
node scripts/global-auto-scraper.js
```

### 2. 查看结果

```bash
# 查看文章总数
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
(async () => {
  const { count } = await supabase.from('articles').select('*', { count: 'exact', head: true });
  console.log('📊 总文章数:', count);
})();
"
```

### 3. 每周检查重复（推荐）

```bash
# 运行去重检查
node scripts/deduplication-tools.js
```

---

## 📅 运行频率建议

| 你的阶段 | 运行频率 | 命令 |
|---------|---------|------|
| **刚开始（现在）** | 每天2-3次 | `node scripts/global-auto-scraper.js` |
| **1个月后** | 每周2-3次 | `node scripts/global-auto-scraper.js` |
| **去重检查** | 每周1次 | `node scripts/deduplication-tools.js` |

---

## 🛡️ 去重保护（自动）

✅ **3层防护机制，100%防止重复**:

1. **URL去重** - 自动跳过已抓取的URL
2. **Slug去重** - 自动跳过相同标题
3. **内容相似度** - 工具检测相似内容（每周运行）

**结论**: 你不需要担心重复，系统会自动处理！

---

## 🌍 当前状态

- ✅ 已抓取: **174篇**
- 🔍 可抓取: **387篇+**
- 🌐 覆盖地区: **8个地区**
- 📦 来源数: **18个权威网站**

**预计总容量**: 600-1000篇

---

## 📚 详细文档

- [全球爬虫指南](GLOBAL_CRAWLER_GUIDE.md) - 完整使用说明
- [运行频率和去重](SCRAPER_SCHEDULE_GUIDE.md) - 运行计划和去重策略
- [原始爬虫文档](CRAWLER_README.md) - 第一版文档（参考）

---

## 🆘 常见问题

### Q1: 多久运行一次？

**A**:
- **现在**: 每天2-3次（快速建立内容库）
- **1个月后**: 每周2-3次（维护更新）

### Q2: 会抓取重复文章吗？

**A**: **不会！** 有3层自动防护：
1. URL去重 ✅
2. Slug去重 ✅
3. 内容相似度检测 ✅

### Q3: 怎么避免重复？

**A**:
```bash
# 每周运行一次检查即可
node scripts/deduplication-tools.js
```

系统会自动显示是否有重复。如果有，会给出建议。

### Q4: 如何只抓取特定地区？

**A**: 编辑 `scripts/global-auto-scraper.js`:

```javascript
const CONFIG = {
  targetRegions: ['UK', 'CA', 'AU'],  // 只抓取这些地区
  // ...
};
```

### Q5: 抓取失败怎么办？

**A**: 查看日志输出:
- 成功率 >70% = 正常
- 成功率 <50% = 需要检查网络或网站变更

---

## 💡 推荐工作流

### 日常（第1-2周）

```bash
# 早上
node scripts/global-auto-scraper.js

# 下午
node scripts/global-auto-scraper.js

# 晚上
node scripts/global-auto-scraper.js
```

### 周日维护

```bash
# 1. 去重检查
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
  console.log('总数:', count);

  const regions = ['US', 'UK', 'CA', 'AU', 'Global'];
  for (const region of regions) {
    const { data } = await supabase.from('articles').select('id').eq('region', region);
    if (data.length > 0) console.log(\`[\${region}]:\`, data.length);
  }
})();
"
```

---

## 🎯 目标时间线

| 时间 | 目标 | 行动 |
|------|------|------|
| **第1周** | 300-500篇 | 每天运行2-3次 |
| **第2周** | 500-700篇 | 每天运行1-2次 |
| **第3-4周** | 600-800篇 | 每天运行1次 |
| **1个月后** | 保持更新 | 每周运行2-3次 |

---

## ✅ 快速检查清单

- [ ] 运行爬虫 `node scripts/global-auto-scraper.js`
- [ ] 查看结果（上面的命令）
- [ ] 每周检查重复 `node scripts/deduplication-tools.js`
- [ ] 每周查看统计

**就这么简单！** 🎉

---

## 📞 需要帮助？

查看详细文档:
- [GLOBAL_CRAWLER_GUIDE.md](GLOBAL_CRAWLER_GUIDE.md)
- [SCRAPER_SCHEDULE_GUIDE.md](SCRAPER_SCHEDULE_GUIDE.md)
