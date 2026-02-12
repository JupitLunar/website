#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fetchTrendingTopicsWithAudit } = require('../scrapers/fetch-trending-topics');

function getTimestampTag(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const h = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const s = String(date.getUTCSeconds()).padStart(2, '0');
  return `${y}${m}${d}-${h}${min}${s}Z`;
}

async function main() {
  const startedAt = new Date();
  console.log('🔎 开始审计每日 Trending Topics 抓取流程...');

  const audit = await fetchTrendingTopicsWithAudit();
  const logsDir = path.resolve(__dirname, '../../logs');
  fs.mkdirSync(logsDir, { recursive: true });

  const report = {
    generated_at: new Date().toISOString(),
    started_at: startedAt.toISOString(),
    selected_source: audit.source,
    topics_count: (audit.topics || []).length,
    top_10_topics: (audit.topics || []).slice(0, 10),
    attempts: audit.attempts || []
  };

  const reportPath = path.join(logsDir, `trend-audit-${getTimestampTag(startedAt)}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`✅ 审计完成，选用来源: ${report.selected_source}`);
  console.log(`📊 最终 topics 数量: ${report.topics_count}`);
  for (const attempt of report.attempts) {
    console.log(
      `   - ${attempt.source}: ${attempt.status} | raw=${attempt.raw_count}, unique=${attempt.unique_count}, dup=${attempt.duplicate_count}`
    );
  }
  console.log(`🧾 审计报告已写入: ${reportPath}`);
}

main().catch((error) => {
  console.error('❌ 审计失败:', error.message);
  process.exit(1);
});
