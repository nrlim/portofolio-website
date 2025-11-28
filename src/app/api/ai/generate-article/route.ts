import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import OpenAI from 'openai';

// Get auth session from cookies
function getAuthSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth_session')?.value;
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for consistent article styling
const ARTICLE_SYSTEM_PROMPT = `You are a professional technical content writer specializing in software engineering, .NET development, microservices, and product development.

When generating articles, follow these guidelines:
1. Write in a professional yet approachable tone
2. Use Markdown formatting with proper headings (# for title, ## for sections, ### for subsections)
3. Include code examples in markdown code blocks with language specification
4. Structure: Introduction → Key concepts/sections → Real-world examples → Best practices → Conclusion
5. Add practical insights from 7+ years of software engineering experience
6. Include actionable takeaways and practical tips
7. Use bullet points and numbered lists for clarity
8. Aim for 800-1500 words

Format the response ONLY as valid Markdown. Do not include any JSON or code blocks outside of the markdown content.`;

// Function to generate image URL based on category
function generateImageUrl(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'Technology': 'computer-technology-tech',
    'Backend': 'server-backend-api',
    'Frontend': 'web-design-ui',
    'DevOps': 'deployment-infrastructure',
    'Architecture': 'software-architecture',
    'Leadership': 'team-leadership-management',
    'Product Development': 'product-development',
    'Other': 'business-innovation'
  };

  const searchTerm = categoryMap[category] || 'technology';
  const width = 800;
  const height = 400;
  const randomSeed = Math.random().toString(36).substring(7);
  
  // Using Unsplash API for random images based on search term
  return `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=${width}&h=${height}&fit=crop&q=80`;
}

export async function POST(request: NextRequest) {
  try {
    const session = getAuthSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { instruction, category = 'General', featured = false, published = false } = body;

    if (!instruction || instruction.trim().length === 0) {
      return NextResponse.json(
        { error: 'Instruction is required' },
        { status: 400 }
      );
    }

    // Generate article using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: ARTICLE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Generate a technical article based on this instruction:\n\n${instruction}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content || '';

    // Extract title from the first heading in the markdown
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Generated Article';

    // Extract description (first paragraph after title)
    const descriptionMatch = content.match(/^# .+\n\n(.+?)(?:\n\n|\n##)/s);
    const description = descriptionMatch
      ? descriptionMatch[1].trim().substring(0, 160)
      : instruction.substring(0, 160);

    // Generate image URL based on category
    const imageUrl = generateImageUrl(category);

    // Save article to database
    const { data: article, error: dbError } = await supabaseServer
      .from('blog_articles')
      .insert({
        title,
        description,
        content,
        category,
        author_id: session.id,
        featured,
        published,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save article' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        article: {
          id: article.id,
          title: article.title,
          description: article.description,
          content: article.content,
          category: article.category,
          featured: article.featured,
          published: article.published,
          created_at: article.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Generate article error:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate article' },
      { status: 500 }
    );
  }
}
