import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface StructuredResponse {
  summary: string;
  keyPoints: string[];
  details: {
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  actionableAdvice: string[];
  disclaimer: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, sessionId } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Search knowledge base for relevant content
    const { data: articles, error: searchError } = await supabase
      .from('articles')
      .select('id, title, body_md, slug, hub')
      .textSearch('title', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(5);

    if (searchError) {
      console.error('Search error:', searchError);
    }

    // Get relevant knowledge chunks if articles don't match well
    const { data: knowledgeChunks, error: chunksError } = await supabase
      .from('knowledge_chunks')
      .select('id, title, content, category, source_id')
      .textSearch('content', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(3);

    if (chunksError) {
      console.error('Chunks search error:', chunksError);
    }

    // Combine results and generate response
    const sources = [
      ...(articles || []).map(a => ({
        title: a.title,
        category: a.hub || 'General',
        url: `/articles/${a.slug}`,
        type: 'article'
      })),
      ...(knowledgeChunks || []).map(k => ({
        title: k.title,
        category: k.category || 'General',
        source: k.source_id,
        type: 'knowledge'
      }))
    ];

    // Generate AI response based on found content
    const response = await generateAnswer(query, articles || [], knowledgeChunks || []);

    return NextResponse.json({
      answer: response,
      sources,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('RAG API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process query',
        message: error.message
      },
      { status: 500 }
    );
  }
}

async function generateAnswer(query: string, articles: any[], knowledgeChunks: any[]): Promise<StructuredResponse> {
  const lowerQuery = query.toLowerCase();

  // Handle common maternal & infant care questions with structured responses
  if (lowerQuery.includes('milestone') || lowerQuery.includes('development')) {
    return {
      summary: "Infant development milestones vary by age, with key achievements in motor skills, communication, and social development.",
      keyPoints: [
        "0-3 months: Lifting head, tracking objects, social smiling",
        "4-6 months: Rolling over, reaching for objects, babbling",
        "7-9 months: Sitting independently, crawling, responding to name",
        "10-12 months: Standing with support, first words, pincer grasp"
      ],
      details: {
        sections: [
          {
            title: "Understanding Development",
            content: "Every baby develops at their own unique pace. While milestone charts provide general guidelines, there's a wide range of normal development. Some babies may reach certain milestones earlier or later than the average timeline."
          },
          {
            title: "When to Be Concerned",
            content: "Contact your pediatrician if your baby shows signs of developmental delays, loses previously acquired skills, or if you have any concerns about their progress."
          }
        ]
      },
      actionableAdvice: [
        "Track milestones using a baby journal or app",
        "Provide tummy time and age-appropriate play activities",
        "Schedule regular pediatric check-ups to monitor development"
      ],
      disclaimer: "Consult your pediatrician if you have concerns about your baby's development."
    };
  }

  if (lowerQuery.includes('breastfeeding') || lowerQuery.includes('nursing')) {
    return {
      summary: "Breastfeeding challenges are common and usually manageable with proper support and techniques.",
      keyPoints: [
        "Latching difficulties: Ensure proper positioning and seek lactation consultant support",
        "Low milk supply: Feed on demand, stay hydrated, consider pumping between feeds",
        "Sore nipples: Check latch, use lanolin cream, air-dry after feeding",
        "Engorgement: Feed frequently, use warm compress before feeding, cold after"
      ],
      details: {
        sections: [
          {
            title: "Getting Started",
            content: "Breastfeeding is a learned skill for both mother and baby. The first few weeks can be challenging as you both learn together. Most issues improve with time, practice, and proper support."
          },
          {
            title: "Warning Signs",
            content: "Contact your healthcare provider if you experience fever, severe pain, red streaks on the breast (signs of mastitis), or if your baby isn't gaining weight appropriately."
          }
        ]
      },
      actionableAdvice: [
        "Connect with a lactation consultant for personalized guidance",
        "Join a breastfeeding support group (online or in-person)",
        "Stay hydrated and maintain a nutritious diet"
      ],
      disclaimer: "For persistent breastfeeding challenges, consult a certified lactation consultant or your healthcare provider."
    };
  }

  if (lowerQuery.includes('solid') || lowerQuery.includes('food introduction') || lowerQuery.includes('weaning')) {
    return {
      summary: "Starting solid foods around 6 months requires understanding signs of readiness and introducing foods safely.",
      keyPoints: [
        "Signs of readiness: Sitting with support, good head control, showing interest in food",
        "First foods: Single-ingredient purées (iron-fortified cereal, vegetables, fruits)",
        "Texture progression: Smooth purées → mashed → soft chunks → finger foods",
        "Introduce common allergens early (peanuts, eggs, dairy) under pediatric guidance"
      ],
      details: {
        sections: [
          {
            title: "Starting Solids",
            content: "Most babies are ready for solid foods around 6 months of age. Look for developmental signs like sitting with minimal support, showing interest in food, and the ability to move food to the back of the mouth."
          },
          {
            title: "Allergen Introduction",
            content: "Recent research suggests introducing common allergens early (around 6 months) may help prevent allergies. Introduce one new food at a time and watch for reactions over 3-5 days."
          },
          {
            title: "Safety First",
            content: "Always supervise eating, avoid choking hazards (whole grapes, nuts, hard raw vegetables), and cut foods into appropriate sizes. Learn infant CPR for added peace of mind."
          }
        ]
      },
      actionableAdvice: [
        "Start with iron-rich foods like meat purée or iron-fortified cereals",
        "Let baby lead the pace - they'll show you when ready for more",
        "Make mealtimes positive and pressure-free experiences"
      ],
      disclaimer: "Consult your pediatrician before starting solids and for guidance on introducing allergens, especially if there's a family history of food allergies."
    };
  }

  // If we found relevant content, structure it
  if (articles && articles.length > 0) {
    const topArticle = articles[0];
    return {
      summary: topArticle.summary || topArticle.title || "Based on our knowledge base, we found relevant information for your question.",
      keyPoints: [
        "This information comes from our curated knowledge base",
        "Check the sources below for detailed articles"
      ],
      details: {
        sections: [{
          title: "From Our Knowledge Base",
          content: topArticle.body_md?.substring(0, 500) || "For more detailed information, please check the sources below."
        }]
      },
      actionableAdvice: [
        "Review the source articles for comprehensive information",
        "Consult your healthcare provider for personalized guidance"
      ],
      disclaimer: "For specific guidance related to your situation, please consult your healthcare provider."
    };
  }

  if (knowledgeChunks && knowledgeChunks.length > 0) {
    const topChunk = knowledgeChunks[0];
    return {
      summary: topChunk.title || "We found relevant information in our knowledge base.",
      keyPoints: [topChunk.content.substring(0, 200)],
      details: {
        sections: [{
          title: topChunk.category || "Information",
          content: topChunk.content.substring(0, 400)
        }]
      },
      actionableAdvice: ["Review the full source for more details"],
      disclaimer: "For specific guidance related to your situation, please consult your healthcare provider."
    };
  }

  // Use LLM fallback when no knowledge base content found
  console.log('🔍 No relevant content found in knowledge base, using LLM to generate response...');
  console.log('🔑 OpenAI API Key configured:', !!process.env.OPENAI_API_KEY);
  console.log('📝 Query:', query.substring(0, 100));
  
  try {
    // Step 1: First check if the question is related to maternal and infant care
    console.log('🔍 Checking if question is related to maternal and infant care...');
    const validationCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: `You are a topic classifier for a maternal and infant care platform. Your job is to determine if a user's question is related to maternal and infant care.

RELEVANT TOPICS include:
- Pregnancy, prenatal care, maternal health
- Baby care, infant care, newborn care
- Feeding (breastfeeding, formula, solid foods, nutrition)
- Child development and milestones (0-3 years)
- Baby sleep, sleep training
- Infant safety, baby-proofing
- Postpartum recovery and maternal mental health
- Common baby health issues (fever, rashes, colic, etc.)
- Parenting tips for infants and toddlers
- Baby products and equipment

NOT RELEVANT topics include:
- Technology, programming, cryptocurrency
- Politics, current events, sports
- Adult health unrelated to pregnancy/postpartum
- General knowledge questions
- Entertainment, movies, music
- School-age children or older

You must respond with valid JSON only:
{
  "isRelevant": true or false,
  "confidence": "high" | "medium" | "low",
  "reason": "Brief explanation"
}`
      }, {
        role: 'user',
        content: query
      }],
      max_tokens: 150,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const validationText = validationCompletion.choices[0]?.message?.content;
    console.log('🔍 Topic validation result:', validationText);

    if (validationText) {
      const validation = JSON.parse(validationText);
      
      // If question is not relevant to maternal/infant care, reject it politely
      if (!validation.isRelevant) {
        console.log('❌ Question is not related to maternal and infant care');
        return {
          summary: "I'm specifically designed to help with maternal and infant care questions.",
          keyPoints: [
            "I can answer questions about pregnancy, baby care, feeding, development, and parenting",
            "For other topics, please consult appropriate resources or specialists",
            "Feel free to ask me anything about maternal and infant health!"
          ],
          details: {
            sections: [{
              title: "What I Can Help With",
              content: "I specialize in maternal and infant care topics including pregnancy, newborn care, breastfeeding, baby nutrition, developmental milestones, sleep training, infant safety, and postpartum support. I'm here to provide evidence-based guidance on these topics based on recommendations from trusted sources like AAP, CDC, and WHO."
            }]
          },
          actionableAdvice: [
            "Ask me about baby feeding, sleep, development, or safety",
            "Consult your pediatrician for specific medical concerns",
            "Visit trusted sources for other topics outside maternal and infant care"
          ],
          disclaimer: "I focus exclusively on maternal and infant care topics to provide you with the most accurate and relevant information."
        };
      }
      
      console.log('✅ Question is relevant to maternal and infant care, proceeding with LLM response...');
    }

    // Step 2: Generate the actual answer since question is relevant
    console.log('🤖 Calling OpenAI API to generate answer...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: `You are a helpful maternal and infant care assistant. Provide evidence-based information based on general medical consensus from trusted sources (AAP, CDC, WHO).

IMPORTANT: You must respond with valid JSON only. Structure your response exactly as follows:
{
  "summary": "A brief 1-2 sentence answer to the question",
  "keyPoints": ["3-5 concise bullet points with the most important information"],
  "details": {
    "sections": [
      {
        "title": "Section heading",
        "content": "Detailed explanation"
      }
    ]
  },
  "actionableAdvice": ["2-3 practical next steps or tips"],
  "disclaimer": "Brief reminder to consult healthcare provider if needed"
}

Keep responses warm, supportive, and empathetic. Focus on practical, actionable advice.`
      }, {
        role: 'user',
        content: query
      }],
      max_tokens: 1200,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content;
    console.log('✅ Received LLM response:', responseText ? 'Success' : 'Empty response');
    
    if (responseText) {
      console.log('📄 Raw response length:', responseText.length);
      console.log('📄 Raw response preview:', responseText.substring(0, 200));
      
      try {
        const structuredResponse = JSON.parse(responseText) as StructuredResponse;
        console.log('✅ Successfully parsed JSON response');
        // Add AI indicator to disclaimer
        structuredResponse.disclaimer = (structuredResponse.disclaimer || "") +
          "\n\n💡 This response was generated using AI. For personalized medical advice, please consult your healthcare provider.";
        return structuredResponse;
      } catch (parseError) {
        console.error('❌ JSON parsing error:', parseError);
        console.error('Raw response:', responseText);
        // If JSON parsing fails, return plain text fallback
        return {
          summary: responseText.substring(0, 200),
          keyPoints: [],
          details: { sections: [] },
          actionableAdvice: [],
          disclaimer: "💡 This response was generated using AI. For personalized medical advice, please consult your healthcare provider."
        };
      }
    } else {
      console.error('❌ LLM returned empty response');
      throw new Error('LLM returned empty response');
    }
  } catch (error: any) {
    console.error('❌ LLM fallback error:', error);
    console.error('❌ Error details:', error.message, error.stack);
    
    // Handle specific error cases
    if (error.code === 'insufficient_quota' || error.message.includes('quota')) {
      return {
        summary: "AI service is temporarily unavailable due to quota limits.",
        keyPoints: [
          "For immediate concerns, please consult your pediatrician or healthcare provider",
          "Check our knowledge base sections on feeding, development, and safety",
          "Contact trusted sources like AAP, CDC, or WHO for evidence-based information"
        ],
        details: {
          sections: [{
            title: "Getting Help",
            content: "Our AI assistant is temporarily unavailable due to service limits. Your baby's health and your well-being are important. Never hesitate to contact your healthcare provider with concerns."
          }]
        },
        actionableAdvice: [
          "Schedule a consultation with your pediatrician",
          "Explore our knowledge base for evidence-based information",
          "Try again later when AI service is restored"
        ],
        disclaimer: "For personalized medical advice, please consult your healthcare provider. AI service temporarily unavailable."
      };
    }
    
    // Generic error fallback
    return {
      summary: "AI service is temporarily unavailable.",
      keyPoints: [
        "For immediate concerns, please consult your pediatrician or healthcare provider",
        "Check our knowledge base sections on feeding, development, and safety",
        "Contact trusted sources like AAP, CDC, or WHO for evidence-based information"
      ],
      details: {
        sections: [{
          title: "Getting Help",
          content: "Our AI assistant is temporarily unavailable. Your baby's health and your well-being are important. Never hesitate to contact your healthcare provider with concerns."
        }]
      },
      actionableAdvice: [
        "Schedule a consultation with your pediatrician",
        "Explore our knowledge base for evidence-based information",
        "Try again later when AI service is restored"
      ],
      disclaimer: "For personalized medical advice, please consult your healthcare provider. AI service temporarily unavailable."
    };
  }

  console.log('⚠️ Reaching final fallback - LLM failed or returned no response');
  // Final fallback if LLM fails
  return {
    summary: "Thank you for your question about maternal and infant care.",
    keyPoints: [
      "Consult with your pediatrician or healthcare provider for personalized advice",
      "Check our knowledge base sections on feeding, development, and safety",
      "Reach out to trusted sources like AAP, CDC, or WHO"
    ],
    details: {
      sections: [{
        title: "Getting Help",
        content: "Your baby's health and your well-being are important. Never hesitate to contact your healthcare provider with concerns."
      }]
    },
    actionableAdvice: [
      "Schedule a consultation with your pediatrician",
      "Explore our knowledge base for evidence-based information"
    ],
    disclaimer: "For personalized medical advice, please consult your healthcare provider."
  };
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'RAG API endpoint. Use POST to query the knowledge base.',
      version: '1.0'
    },
    { status: 200 }
  );
}
