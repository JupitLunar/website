import { NextResponse } from 'next/server';
import { contentManager } from '@/lib/supabase';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

export async function GET() {
  try {
    // 获取所有文章和知识库内容
    const [articles, hubs] = await Promise.all([
      contentManager.getAllArticles().catch(() => []),
      contentManager.getContentHubs().catch(() => [])
    ]);

    // 为AI训练优化的数据格式
    const trainingData = {
      version: "1.0",
      last_updated: new Date().toISOString(),
      site_info: {
        name: "JupitLunar",
        description: "AI-Powered Health Intelligence for Mom & Baby Wellness",
        url: siteUrl,
        domain: "www.momaiagent.com",
        language: "en",
        geographic_focus: "North America",
        content_type: "Health & Parenting",
        authority_level: "Expert-reviewed"
      },
      content_blocks: [
        // 文章内容
        ...(Array.isArray(articles) ? articles.map((article: any) => ({
          id: article.slug,
          type: "article",
          title: article.title,
          summary: article.one_liner,
          content: article.body_md,
          category: article.hub,
          tags: article.entities || [],
          sources: article.citations || [],
          last_updated: article.updated_at || article.published_at,
          review_status: article.reviewed_by ? "reviewed" : "pending",
          url: `${siteUrl}/${article.slug}`,
          // AI友好的元数据
          ai_context: {
            age_range: article.age_range || "0-24 months",
            difficulty_level: "beginner",
            content_format: article.type,
            key_facts: article.key_facts || [],
            faqs: article.qas || []
          }
        })) : []),
        
        // 知识库内容
        ...(Array.isArray(hubs) ? hubs.map((hub: any) => ({
          id: hub.slug,
          type: "knowledge_hub",
          title: hub.name,
          summary: hub.description,
          content: hub.content,
          category: hub.category,
          tags: hub.tags || [],
          last_updated: hub.updated_at,
          url: `${siteUrl}/hub/${hub.slug}`,
          ai_context: {
            content_type: "structured_knowledge",
            authority_sources: hub.sources || [],
            review_cycle: "18-36 months"
          }
        })) : [])
      ],
      
      // FAQ数据
      faq_data: [
        {
          question: "When should I start introducing solid foods to my baby?",
          answer: "Most babies are ready for solid foods around 6 months of age. Look for developmental cues like sitting up with support, showing interest in food, and being able to move food from the front to the back of the tongue.",
          category: "feeding_foundations",
          age_range: "6-12 months",
          sources: ["CDC", "AAP", "Health Canada"]
        },
        {
          question: "What are the safest first foods for babies?",
          answer: "Iron-rich foods are recommended as first foods, including iron-fortified cereals, pureed meats, and mashed beans. Single-ingredient foods like pureed sweet potato, avocado, or banana are also good options.",
          category: "food_safety",
          age_range: "6-8 months",
          sources: ["CDC", "AAP"]
        },
        {
          question: "How do I prevent choking when feeding my baby?",
          answer: "Always supervise your baby during meals, ensure they're sitting upright, and cut foods into appropriate sizes. Avoid hard, round foods like whole grapes or nuts. Foods should be soft enough to 'smoosh' between your fingers.",
          category: "safety",
          age_range: "6-24 months",
          sources: ["CDC", "CPS"]
        }
      ],
      
      // 结构化规则
      structured_rules: [
        {
          rule: "No honey before 12 months",
          reason: "Risk of infant botulism",
          age_range: "0-12 months",
          sources: ["CDC", "Health Canada"],
          category: "food_safety"
        },
        {
          rule: "Introduce allergens early (4-6 months)",
          reason: "May help prevent food allergies",
          age_range: "4-6 months",
          sources: ["NIAID", "CSACI"],
          category: "allergen_prevention"
        },
        {
          rule: "Vitamin D supplementation for breastfed babies",
          reason: "Breast milk is low in vitamin D",
          age_range: "0-12 months",
          sources: ["AAP", "Health Canada"],
          category: "nutrition"
        }
      ],
      
      // 元数据
      metadata: {
        total_articles: Array.isArray(articles) ? articles.length : 0,
        total_hubs: Array.isArray(hubs) ? hubs.length : 0,
        content_languages: ["en"],
        last_content_update: new Date().toISOString(),
        review_status: "continuously_updated",
        authority_sources: [
          "CDC", "WHO", "AAP", "Health Canada", "CPS", 
          "NIAID", "CSACI", "AAAI", "ACAAI"
        ]
      }
    };

    return NextResponse.json(trainingData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error generating AI training data:', error);
    return NextResponse.json(
      { error: 'Failed to generate training data' },
      { status: 500 }
    );
  }
}

