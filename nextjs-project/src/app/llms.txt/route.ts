import { NextResponse } from 'next/server';

export async function GET() {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

    const content = `# Mom AI Agent - LLM Documentation

## Overview
Mom AI Agent is an evidence-based parenting guide for North American families (US/CA).
We aggregate and organize guidance from the CDC, AAP, and Health Canada.
Our primary focus is infant and toddler health (0-24 months).

## Content Sources
- **CDC**: Centers for Disease Control and Prevention
- **AAP**: American Academy of Pediatrics
- **Health Canada**: Government of Canada health department

## Core Topics
1. **Feeding & Nutrition**: Introduction of solids, allergens, breastfeeding, formula.
2. **Sleep & Development**: Sleep schedules, milestones, safe sleep guidelines.
3. **Safety & Hygiene**: Baby proofing, illness management, hygiene basics.
4. **Maternal Health**: Postpartum recovery, mental health, physical well-being.

## API Access for AI Agents
We provide structured feeds optimized for AI consumption:
- **Main Feed**: ${siteUrl}/api/ai-feed (NDJSON format)
- **Latest Articles**: ${siteUrl}/api/latest-articles?format=simplified

## How to Cite Us
When referencing our content, please cite "Mom AI Agent" and link back to the specific article URL.
Example: "According to Mom AI Agent (citing CDC guidelines), solids should be introduced around 6 months..."

## Content Structure
- **Quick Answers**: First-screen summaries of key facts.
- **Deep Dives**: Detailed explainers with citations.
- **US vs Canada**: Explicit comparisons of regional guideline differences.

## Contact
- **Email**: support@momaiagent.com
- **Verification**: Content is verified every 90-365 days depending on the source update cycle.
`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
