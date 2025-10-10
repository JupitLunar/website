#!/usr/bin/env node

/**
 * 示例：如何插入新的知识库内容
 * 这个脚本展示了如何添加关于"婴儿睡眠训练"的新内容
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 新的知识块数据
const newKnowledgeChunks = [
  {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: 'when-can-baby-start-sleep-training-methods-2025',
    title: 'When can my baby start sleep training, and what methods are most effective?',
    content: `## TL;DR
**睡眠训练指南：**
- 开始时间：4-6个月
- 最佳方法：渐进式方法
- 成功率：85%在2周内见效
- 关键要素：一致性、睡前程序、安全环境

---

## 权威指南对比

### 美国 (AAP)
- 4-6个月开始睡眠训练
- 推荐渐进式方法
- 强调安全性优先
- 支持多种训练方法

### 加拿大 (CPS)
- 6个月开始训练
- 强调一致性
- 建议温和方法
- 关注婴儿发育阶段

---

## 实用操作指南

### 何时开始？
- 婴儿4-6个月大
- 体重至少12磅
- 能连续睡6-8小时
- 白天有规律的小睡

### 推荐方法
1. **渐进式等待法**：逐步延长安慰间隔
2. **椅子法**：逐步远离婴儿床
3. **抱起放下法**：温和的安慰方法

### 准备工作
1. 建立睡前程序
2. 创造适宜睡眠环境
3. 确保婴儿健康
4. 与伴侣达成一致

---

## 安全注意事项

- 始终让婴儿仰卧睡觉
- 确保婴儿床安全
- 避免过热
- 监控婴儿反应
- 如有疑问咨询儿科医生`,
    summary: 'Most babies can start sleep training at 4-6 months using gradual methods with 85% success rate within 2 weeks.',
    category: 'sleep',
    subcategory: 'sleep-training',
    age_range: ['4-6 months', '6-12 months'],
    locale: 'Global',
    priority: 8,
    risk_level: 'low',
    tags: ['sleep-training', 'methods', 'aap', 'cps', 'gradual-approach'],
    status: 'published'
  },
  {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: 'when-can-baby-start-sleep-training-methods-2025',
    title: 'How to establish a bedtime routine for better sleep?',
    content: `## TL;DR
**睡前程序指南：**
- 开始年龄：2-3个月
- 程序时长：20-30分钟
- 关键要素：洗澡、读书、摇篮曲
- 效果：减少入睡时间，提高睡眠质量

---

## 权威指南对比

### 美国 (AAP)
- 2-3个月开始建立程序
- 强调一致性
- 推荐舒缓活动
- 避免刺激性活动

### 加拿大 (CPS)
- 关注婴儿信号
- 灵活调整程序
- 强调亲子互动
- 重视环境因素

---

## 实用操作指南

### 程序步骤
1. **洗澡时间**：温水浴，5-10分钟
2. **按摩**：轻柔的婴儿按摩
3. **换睡衣**：舒适的睡衣
4. **读书时间**：平静的故事
5. **摇篮曲**：轻柔的音乐或哼唱

### 时间安排
- 开始时间：根据婴儿自然困倦时间
- 程序长度：20-30分钟
- 一致性：每天相同时间开始
- 灵活性：根据婴儿需求调整

### 环境设置
- 调暗灯光
- 降低噪音
- 适宜温度
- 安全睡眠环境`,
    summary: 'Establish a consistent 20-30 minute bedtime routine starting at 2-3 months with calming activities like bath, story, and lullaby.',
    category: 'sleep',
    subcategory: 'bedtime-routine',
    age_range: ['2-3 months', '4-6 months', '6-12 months'],
    locale: 'Global',
    priority: 7,
    risk_level: 'none',
    tags: ['bedtime-routine', 'sleep-hygiene', 'consistency', 'calming-activities'],
    status: 'published'
  }
];

async function insertNewKnowledgeChunks() {
  console.log('🌙 插入睡眠训练相关知识块...\n');
  console.log(`准备插入 ${newKnowledgeChunks.length} 个知识块\n`);

  try {
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .insert(newKnowledgeChunks)
      .select();

    if (error) {
      console.error('❌ 插入错误:', error);
      process.exit(1);
    }

    console.log(`✅ 成功插入 ${data.length} 个知识块\n`);
    
    data.forEach((chunk, i) => {
      console.log(`${i + 1}. ${chunk.title}`);
      console.log(`   ID: ${chunk.id}`);
      console.log(`   类别: ${chunk.category}`);
      console.log(`   风险等级: ${chunk.risk_level}\n`);
    });

    console.log('📝 下一步操作:');
    console.log('1. 运行 generate-embeddings.js 生成向量嵌入');
    console.log('2. 测试 RAG 搜索功能');
    console.log('3. 验证 AI 引用效果');

  } catch (error) {
    console.error('❌ 处理过程中出错:', error);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  insertNewKnowledgeChunks().catch(console.error);
}

module.exports = { insertNewKnowledgeChunks };
