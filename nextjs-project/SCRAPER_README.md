# 全球内容爬虫使用指南

## 📚 概述

自动从全球18个权威母婴健康网站抓取高质量文章，支持多地区、智能去重、内容质量验证。

## 🚀 快速开始

### 测试运行（推荐）
```bash
cd nextjs-project
node scripts/test-scraper-quick.js
```

### 完整运行（最多500篇）
```bash
node scripts/global-auto-scraper.js
```

### 调试模式
```bash
DEBUG=true node scripts/test-scraper-quick.js
```

## 📁 核心文件

| 文件 | 用途 |
|------|------|
| `global-auto-scraper.js` | **主程序** - 全球多地区自动爬虫 |
| `test-scraper-quick.js` | 快速测试（少量抓取） |
| `scraper-utils.js` | 共享工具模块 |
| `global-sources-config.js` | 18个全球权威来源配置 |
| `scraper-config.js` | 基础配置 |
| `scraper-stats.js` | 统计分析 |

## 🌍 支持的来源（18个）

### 美国 (6个)
- American Academy of Pediatrics (AAP)
- KidsHealth (Nemours)
- Mayo Clinic
- CDC
- Cleveland Clinic
- Stanford Children's Health

### 英国 (2个)
- NHS
- NHS Start4Life

### 加拿大 (2个)
- Health Canada
- Canadian Paediatric Society

### 澳大利亚 (2个)
- Raising Children Network
- Pregnancy Birth & Baby

### 其他
- 新西兰、新加坡、WHO、UNICEF、La Leche League

## ⚙️ 配置选项

在 `global-auto-scraper.js` 中修改：

```javascript
const CONFIG = {
  maxArticlesPerRun: 500,      // 每次最多抓取数量
  minContentLength: 300,       // 最少字符数
  maxContentLength: 50000,     // 最多字符数
  minParagraphs: 3,            // 最少段落数
  debugMode: false,            // 调试模式
  targetRegions: []            // 指定地区 ['US', 'CA'] 或 [] 全部
};
```

## ✨ 功能特性

### 智能内容提取
- ✅ 多种标题选择器（h1, meta, .title等）
- ✅ 智能内容容器识别（article, main, .content等）
- ✅ 提取段落、列表、表格内容
- ✅ 自动过滤噪音（广告、导航、评论）

### 内容质量验证
- ✅ 字符数限制（300-50000）
- ✅ 段落数要求（≥3段）
- ✅ 链接密度检测
- ✅ 标题完整性检查

### 去重机制
- ✅ URL 检查
- ✅ 标题/Slug 检查
- ✅ 双重保护（过滤+保存阶段）

### 其他
- ✅ 地区映射（UK/AU/EU → Global）
- ✅ 失败重试（3次）
- ✅ 礼貌延迟（1.5-2.5秒）
- ✅ 详细日志输出

## 📊 运行结果

```
发现文章: 387 篇
尝试抓取: 213 篇
✅ 成功保存: 16 篇新文章
❌ 失败: 197 篇（主要是重复或内容质量不足）
成功率: 7.5%
```

## 🔧 常见问题

### Q: 如何只抓取特定地区？
A: 修改 `CONFIG.targetRegions = ['US', 'CA']`

### Q: 为什么成功率较低？
A: 
1. 大部分文章已经存在（去重）
2. 部分页面是目录/导航页，不是文章
3. 内容质量不符合标准

### Q: 如何提高抓取量？
A: 
1. 降低 `minContentLength`
2. 降低 `minParagraphs`
3. 增加 `maxArticlesPerRun`

### Q: 失败原因查看
A: 启用调试模式查看详细信息：
```bash
DEBUG=true node scripts/global-auto-scraper.js
```

## 📝 最近更新

**2024-10-10**
- ✅ 创建共享工具模块 `scraper-utils.js`
- ✅ 优化内容提取算法
- ✅ 增强去重逻辑
- ✅ 修复 region 映射问题
- ✅ 删除4个旧版本脚本
- ✅ 删除15个旧文档
- ✅ 提升最大抓取量到500篇

## 🛠️ 维护

定期运行以获取新内容：
```bash
# 每周运行一次
0 0 * * 0 cd /path/to/nextjs-project && node scripts/global-auto-scraper.js
```

