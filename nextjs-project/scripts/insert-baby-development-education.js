#!/usr/bin/env node

/**
 * 添加婴儿发育和教育相关的 RAG 知识库内容
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 婴儿发育相关的知识块
const developmentChunks = [
  {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: 'baby-development-milestones-0-12-months-2025',
    title: 'What are the key developmental milestones for babies 0-12 months?',
    content: `## TL;DR
**发育里程碑概览：**
- 0-3个月：抬头、追视、社交微笑
- 4-6个月：翻身、抓握、咿呀学语
- 7-9个月：独坐、爬行、认人
- 10-12个月：扶站、模仿、简单指令

---

## 权威指南对比

### 美国 (CDC)
- 提供详细的里程碑检查清单
- 强调个体差异的重要性
- 建议定期儿科检查
- 关注早期干预需求

### 世界卫生组织 (WHO)
- 基于全球数据制定标准
- 考虑文化差异
- 强调营养对发育的影响
- 提供多语言资源

---

## 详细里程碑指南

### 0-3个月发育重点
**大运动发育：**
- 俯卧时能短暂抬头
- 四肢活动协调
- 开始有蹬腿动作

**精细运动：**
- 手部握拳反射
- 能短暂抓握物品
- 手眼协调开始发展

**认知发育：**
- 能追视移动物体
- 对声音有反应
- 开始社交微笑

**语言发育：**
- 发出简单声音
- 对成人说话有反应
- 开始模仿面部表情

### 4-6个月发育重点
**大运动发育：**
- 能从俯卧翻到仰卧
- 能支撑上半身
- 开始有坐的意愿

**精细运动：**
- 主动抓握物品
- 双手协作能力
- 手到嘴的协调

**认知发育：**
- 物体恒存概念萌芽
- 因果关系理解
- 注意力持续时间增长

**语言发育：**
- 咿呀学语增多
- 对名字有反应
- 开始模仿声音

---

## 实用观察指南

### 如何观察发育
1. **日常观察**：在游戏和互动中观察
2. **记录变化**：使用发育日记
3. **比较同龄**：参考CDC里程碑
4. **咨询专家**：定期儿科检查

### 促进发育的活动
1. **大运动**：俯卧时间、自由活动
2. **精细运动**：抓握游戏、手部探索
3. **认知**：阅读、音乐、游戏
4. **语言**：对话、唱歌、模仿

---

## 何时需要关注

### 预警信号
- 3个月不能抬头
- 6个月不能翻身
- 9个月不能独坐
- 12个月不能扶站

### 建议行动
- 记录观察结果
- 咨询儿科医生
- 考虑早期干预
- 持续监测进展`,
    summary: 'Key developmental milestones for babies 0-12 months include motor skills, cognitive development, language acquisition, and social interaction patterns.',
    category: 'development',
    subcategory: 'milestones',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'Global',
    priority: 9,
    risk_level: 'none',
    tags: ['development', 'milestones', 'motor-skills', 'cognitive', 'language', 'cdc', 'who'],
    status: 'published'
  },
  {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: 'how-to-promote-baby-brain-development-activities-2025',
    title: 'How can I promote my baby\'s brain development through daily activities?',
    content: `## TL;DR
**大脑发育促进指南：**
- 关键期：0-3岁是大脑发育黄金期
- 核心要素：互动、营养、睡眠、安全环境
- 简单活动：对话、阅读、音乐、游戏
- 效果：建立神经连接，提升认知能力

---

## 权威指南对比

### 美国儿科学会 (AAP)
- 强调早期互动的重要性
- 推荐阅读和音乐活动
- 关注安全的学习环境
- 建议限制屏幕时间

### 哈佛大学儿童发展中心
- 基于神经科学研究
- 强调"serve and return"互动
- 关注压力对发育的影响
- 提供循证实践指南

---

## 日常促进活动

### 0-6个月活动
**互动对话：**
- 与婴儿面对面交流
- 模仿婴儿的声音
- 使用简单词汇
- 保持眼神接触

**感官刺激：**
- 提供不同质地的玩具
- 播放轻柔音乐
- 进行轻柔按摩
- 创造丰富的视觉环境

**运动发展：**
- 充足的俯卧时间
- 安全的自由活动
- 轻柔的运动游戏
- 支撑式坐立练习

### 6-12个月活动
**认知游戏：**
- 躲猫猫游戏
- 物体恒存练习
- 简单拼图游戏
- 因果关系探索

**语言发展：**
- 日常对话
- 歌曲和童谣
- 阅读绘本
- 命名游戏

**精细运动：**
- 抓握和释放练习
- 堆叠游戏
- 手指食物探索
- 简单手工活动

---

## 环境设置

### 安全的学习环境
- 无毒玩具和材料
- 安全的探索空间
- 适当的刺激水平
- 规律的生活作息

### 营养支持
- 母乳喂养或优质配方奶
- 适时引入营养丰富的辅食
- 充足的铁和维生素D
- 避免过度加工食品

### 睡眠质量
- 规律的睡眠时间
- 充足的睡眠时长
- 安全的睡眠环境
- 良好的睡前程序

---

## 避免的误区

### 过度刺激
- 避免过多的电子设备
- 不要同时进行多种活动
- 注意婴儿的疲劳信号
- 保持活动简单有趣

### 压力因素
- 避免强迫性活动
- 不要比较发育进度
- 关注婴儿的舒适度
- 提供情感支持

---

## 监测进展

### 观察指标
- 注意力持续时间
- 对新事物的兴趣
- 互动和回应能力
- 整体情绪状态

### 何时寻求帮助
- 发育明显延迟
- 缺乏社交互动
- 过度敏感或迟钝
- 持续的行为问题`,
    summary: 'Promote baby brain development through daily interactions, age-appropriate activities, safe exploration, and consistent routines.',
    category: 'development',
    subcategory: 'brain-development',
    age_range: ['0-6 months', '6-12 months', '12-24 months'],
    locale: 'Global',
    priority: 9,
    risk_level: 'none',
    tags: ['brain-development', 'cognitive', 'activities', 'interaction', 'aap', 'harvard'],
    status: 'published'
  }
];

// 婴儿教育相关的知识块
const educationChunks = [
  {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: 'early-learning-activities-babies-toddlers-2025',
    title: 'What are the best early learning activities for babies and toddlers?',
    content: `## TL;DR
**早期学习活动指南：**
- 0-12个月：感官探索、互动游戏、音乐
- 12-24个月：模仿游戏、简单指令、探索
- 核心原则：游戏化学习、重复练习、积极鼓励
- 效果：促进认知、语言、社交和运动发展

---

## 权威指南对比

### 美国教育部
- 强调游戏的重要性
- 关注个体发展节奏
- 推荐家庭参与
- 提供免费学习资源

### 蒙台梭利教育法
- 强调自主探索
- 关注敏感期
- 提供有序环境
- 重视实际生活技能

---

## 分年龄学习活动

### 0-6个月学习活动
**感官探索：**
- 不同质地的触摸板
- 彩色高对比度卡片
- 轻柔的音乐和声音
- 温和的视觉追踪游戏

**互动游戏：**
- 面部表情模仿
- 简单的躲猫猫
- 轻柔的摇篮曲
- 身体部位游戏

**语言基础：**
- 日常对话
- 描述周围环境
- 简单的词汇重复
- 回应婴儿的声音

### 6-12个月学习活动
**认知发展：**
- 物体恒存游戏
- 简单的因果关系
- 分类和匹配
- 记忆游戏

**精细运动：**
- 抓握和释放
- 简单的堆叠
- 手指食物探索
- 涂鸦活动

**语言发展：**
- 词汇扩展
- 简单的指令
- 歌曲和童谣
- 图片书阅读

### 12-24个月学习活动
**认知技能：**
- 简单的拼图
- 形状和颜色识别
- 数字概念引入
- 问题解决游戏

**社交技能：**
- 分享和轮流
- 模仿成人活动
- 简单的角色扮演
- 与他人互动

**创造表达：**
- 艺术和手工
- 音乐和舞蹈
- 故事创作
- 自由游戏

---

## 学习环境设置

### 安全的学习空间
- 无毒材料和玩具
- 适合年龄的家具
- 充足的存储空间
- 易于清洁的表面

### 刺激丰富的环境
- 各种质地的材料
- 不同高度的活动区
- 自然光和新鲜空气
- 安静的学习角落

### 有序的环境
- 清晰的物品分类
- 固定的活动区域
- 简单的规则和程序
- 整洁的视觉环境

---

## 学习原则

### 游戏化学习
- 让学习变得有趣
- 跟随孩子的兴趣
- 保持轻松的氛围
- 鼓励探索和实验

### 重复和一致性
- 重复喜欢的活动
- 建立日常学习程序
- 保持一致的规则
- 提供可预测的环境

### 积极鼓励
- 庆祝小成就
- 提供具体反馈
- 避免过度批评
- 培养自信心

---

## 常见误区

### 过度结构化
- 避免过度安排
- 允许自由游戏时间
- 跟随孩子的节奏
- 保持灵活性

### 过早学术化
- 不要强迫学习
- 关注整体发展
- 保持年龄适宜性
- 重视过程而非结果`,
    summary: 'Best early learning activities focus on play-based exploration, age-appropriate challenges, and consistent positive interactions.',
    category: 'education',
    subcategory: 'early-learning',
    age_range: ['0-6 months', '6-12 months', '12-24 months'],
    locale: 'Global',
    priority: 8,
    risk_level: 'none',
    tags: ['early-learning', 'education', 'activities', 'cognitive', 'montessori', 'play-based'],
    status: 'published'
  },
  {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: 'how-to-teach-baby-language-skills-communication-2025',
    title: 'How can I help my baby develop language and communication skills?',
    content: `## TL;DR
**语言发展促进指南：**
- 0-6个月：回应声音、日常对话、面部表情
- 6-12个月：词汇扩展、简单指令、阅读
- 12-24个月：句子构建、问题回答、对话练习
- 关键要素：频繁互动、重复练习、积极回应

---

## 权威指南对比

### 美国言语语言听力协会 (ASHA)
- 强调早期语言刺激
- 关注听力筛查
- 提供发展里程碑
- 推荐专业评估

### 斯坦福大学儿童语言研究
- 基于认知科学研究
- 强调双向交流
- 关注个体差异
- 提供循证策略

---

## 分阶段语言发展

### 0-6个月语言基础
**听力发展：**
- 对声音的警觉反应
- 转向声源
- 区分不同音调
- 对音乐的兴趣

**发声练习：**
- 哭泣和咕咕声
- 元音发音
- 辅音组合尝试
- 音调变化

**互动回应：**
- 模仿成人声音
- 面部表情交流
- 眼神接触
- 身体语言

### 6-12个月语言发展
**理解能力：**
- 理解简单词汇
- 对名字有反应
- 理解日常指令
- 识别常见物品

**表达技能：**
- 咿呀学语增多
- 有意义的词汇
- 手势和声音结合
- 表达需求和情感

**交流技巧：**
- 指向和展示
- 模仿成人行为
- 寻求关注
- 参与简单游戏

### 12-24个月语言爆发
**词汇发展：**
- 词汇量快速增长
- 两字组合
- 简单句子
- 语法规则学习

**理解能力：**
- 复杂指令理解
- 故事内容理解
- 因果关系理解
- 抽象概念萌芽

**交流技能：**
- 主动发起对话
- 回答问题
- 表达观点
- 社交交流

---

## 促进活动

### 日常对话
**描述活动：**
- 描述正在做的事情
- 使用简单清晰的词汇
- 重复关键词汇
- 保持积极语调

**回应交流：**
- 及时回应婴儿声音
- 模仿和扩展发音
- 提供词汇标签
- 鼓励交流尝试

### 阅读活动
**选择合适书籍：**
- 大图片和简单文字
- 重复性文本
- 互动元素
- 适合年龄的主题

**阅读技巧：**
- 指向图片
- 使用不同声音
- 鼓励参与
- 重复阅读

### 音乐和歌曲
**语言学习歌曲：**
- 身体部位歌曲
- 动作歌曲
- 数字和字母歌
- 日常生活歌曲

**音乐活动：**
- 跟着节拍活动
- 模仿声音
- 创造简单歌词
- 乐器探索

---

## 环境设置

### 语言丰富环境
- 日常物品标签
- 图片和书籍
- 音乐和声音
- 对话机会

### 减少干扰
- 限制背景噪音
- 关闭不必要的屏幕
- 创造安静时间
- 专注的互动

---

## 预警信号

### 需要关注的情况
- 6个月对声音无反应
- 12个月无有意义词汇
- 18个月词汇少于10个
- 24个月不能组合词汇

### 建议行动
- 记录观察结果
- 咨询儿科医生
- 考虑听力评估
- 寻求语言治疗师建议

---

## 常见误区

### 过度纠正
- 避免频繁纠正
- 关注交流意图
- 提供正确模型
- 保持积极态度

### 忽视个体差异
- 尊重发展节奏
- 避免比较
- 提供适当支持
- 关注整体发展`,
    summary: 'Promote baby language development through frequent interaction, responsive communication, reading, music, and creating a language-rich environment.',
    category: 'education',
    subcategory: 'language-development',
    age_range: ['0-6 months', '6-12 months', '12-24 months'],
    locale: 'Global',
    priority: 9,
    risk_level: 'none',
    tags: ['language-development', 'communication', 'speech', 'reading', 'asha', 'stanford'],
    status: 'published'
  },
  {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: 'social-emotional-development-babies-toddlers-2025',
    title: 'How can I support my baby\'s social and emotional development?',
    content: `## TL;DR
**社交情感发展支持：**
- 0-6个月：建立安全感、情感回应、社交微笑
- 6-12个月：陌生人焦虑、情感调节、依恋关系
- 12-24个月：自我意识、共情能力、社交技能
- 关键要素：温暖回应、稳定关系、情感安全

---

## 权威指南对比

### 美国心理学会 (APA)
- 强调早期依恋的重要性
- 关注情感调节能力
- 提供发展里程碑
- 推荐干预策略

### 哈佛大学儿童发展中心
- 基于神经科学研究
- 强调"serve and return"
- 关注压力影响
- 提供实践指南

---

## 发展阶段和支持策略

### 0-6个月情感基础
**建立安全感：**
- 及时回应需求
- 一致的照顾模式
- 温暖的身体接触
- 平静的语调

**情感回应：**
- 模仿婴儿表情
- 回应情感信号
- 提供舒适安慰
- 建立信任关系

**社交互动：**
- 面部表情游戏
- 眼神接触
- 简单的互动游戏
- 社交微笑回应

### 6-12个月社交发展
**陌生人焦虑处理：**
- 理解正常发展
- 渐进式接触新环境
- 提供安全感
- 支持探索尝试

**情感调节：**
- 识别情感信号
- 提供安慰策略
- 建立规律作息
- 创造安全环境

**依恋关系：**
- 主要照顾者稳定
- 积极的分离和重聚
- 建立信任基础
- 支持独立性发展

### 12-24个月自我意识
**自我认知：**
- 镜像游戏
- 身体部位认知
- 个人物品概念
- 自主性支持

**共情能力：**
- 情感词汇使用
- 他人感受讨论
- 安慰行为示范
- 社交情境解释

**社交技能：**
- 分享和轮流练习
- 简单规则理解
- 冲突解决示范
- 友谊概念引入

---

## 支持策略

### 情感回应技巧
**及时回应：**
- 识别情感信号
- 快速提供安慰
- 使用温暖语调
- 保持耐心理解

**情感标签：**
- 命名情感状态
- 解释情感原因
- 提供应对策略
- 验证情感体验

### 社交环境设置
**安全探索：**
- 创造安全空间
- 提供适当挑战
- 监督和支持
- 鼓励尝试

**社交机会：**
- 与同龄人互动
- 家庭聚会参与
- 社区活动
- 多样化社交体验

### 规律和预测性
**日常程序：**
- 稳定的作息时间
- 可预测的活动
- 清晰的转换信号
- 一致的反应模式

**环境稳定：**
- 熟悉的空间设置
- 一致的照顾者
- 稳定的规则
- 可预测的结果

---

## 常见挑战

### 分离焦虑
**正常发展现象：**
- 8-18个月常见
- 表明健康依恋
- 需要理解支持
- 逐渐改善过程

**支持策略：**
- 渐进式分离
- 积极重聚仪式
- 保持一致性
- 提供安全感

### 情绪爆发
**理解原因：**
- 语言能力限制
- 自主性需求
- 情感调节困难
- 环境变化影响

**应对策略：**
- 保持冷静
- 提供安全空间
- 简单安慰技巧
- 事后讨论学习

---

## 预警信号

### 需要关注的情况
- 持续的情感冷漠
- 极度分离焦虑
- 社交回避行为
- 情感调节困难

### 专业帮助
- 儿科医生咨询
- 儿童心理评估
- 早期干预服务
- 家庭支持资源

---

## 促进活动

### 情感游戏
- 面部表情模仿
- 情感词汇游戏
- 安慰玩偶活动
- 情感故事阅读

### 社交游戏
- 轮流游戏
- 合作活动
- 角色扮演
- 群体游戏

### 自我认知活动
- 镜像游戏
- 照片识别
- 身体部位游戏
- 个人物品整理`,
    summary: 'Support social-emotional development through responsive care, emotional validation, secure attachment, and age-appropriate social experiences.',
    category: 'education',
    subcategory: 'social-emotional',
    age_range: ['0-6 months', '6-12 months', '12-24 months'],
    locale: 'Global',
    priority: 8,
    risk_level: 'none',
    tags: ['social-development', 'emotional-development', 'attachment', 'apa', 'harvard'],
    status: 'published'
  }
];

async function insertDevelopmentEducationChunks() {
  console.log('👶 插入婴儿发育和教育相关知识块...\n');
  
  const allChunks = [...developmentChunks, ...educationChunks];
  console.log(`准备插入 ${allChunks.length} 个知识块\n`);

  try {
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .insert(allChunks)
      .select();

    if (error) {
      console.error('❌ 插入错误:', error);
      process.exit(1);
    }

    console.log(`✅ 成功插入 ${data.length} 个知识块\n`);
    
    // 按类别分组显示
    const developmentData = data.filter(chunk => chunk.category === 'development');
    const educationData = data.filter(chunk => chunk.category === 'education');
    
    console.log('🧠 婴儿发育相关内容:');
    developmentData.forEach((chunk, i) => {
      console.log(`${i + 1}. ${chunk.title}`);
      console.log(`   子类别: ${chunk.subcategory}`);
      console.log(`   风险等级: ${chunk.risk_level}\n`);
    });
    
    console.log('📚 婴儿教育相关内容:');
    educationData.forEach((chunk, i) => {
      console.log(`${i + 1}. ${chunk.title}`);
      console.log(`   子类别: ${chunk.subcategory}`);
      console.log(`   风险等级: ${chunk.risk_level}\n`);
    });

    console.log('📝 下一步操作:');
    console.log('1. 运行 node scripts/generate-embeddings.js 生成向量嵌入');
    console.log('2. 测试 RAG 搜索功能');
    console.log('3. 验证 AI 引用效果');

  } catch (error) {
    console.error('❌ 处理过程中出错:', error);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  insertDevelopmentEducationChunks().catch(console.error);
}

module.exports = { insertDevelopmentEducationChunks };


