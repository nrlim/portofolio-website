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

const UNSPLASH_API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;

// Comprehensive topic-to-search-term mapping for Unsplash
const topicSearchTermMap: { [key: string]: string[] } = {
  // Leadership & Motivation
  'leadership': ['team leadership', 'business leadership', 'team management', 'professional team'],
  'motivation': ['success motivation', 'professional growth', 'team motivation', 'achievement'],
  'team': ['team collaboration', 'teamwork', 'team meeting', 'professional team'],
  'management': ['project management', 'team management', 'business management', 'strategic planning'],
  
  // Mobile Development - Cross Platform & Native
  'flutter': ['flutter mobile development', 'flutter app development', 'cross platform mobile', 'flutter ui design'],
  'react native': ['react native development', 'cross platform app development', 'mobile javascript', 'react native app'],
  'mobile': ['mobile app development', 'mobile development', 'smartphone app', 'mobile ui'],
  'android': ['android app development', 'android development', 'android studio', 'java android'],
  'ios': ['ios app development', 'iphone development', 'swift programming', 'swift ios'],
  
  // Frontend Web Development
  'react': ['react development', 'react js framework', 'javascript react', 'react component'],
  'vue': ['vue js development', 'vue framework', 'javascript vue', 'vue component'],
  'angular': ['angular framework', 'angular development', 'typescript angular', 'angular application'],
  'nextjs': ['next js development', 'react next js', 'server side rendering', 'fullstack next js'],
  'frontend': ['web development', 'ui design', 'responsive design', 'web interface'],
  
  // Backend Development - Java Ecosystem
  'java': ['java development', 'java programming', 'enterprise java', 'java application'],
  'spring boot': ['spring boot development', 'java spring boot', 'microservices spring', 'spring boot api'],
  'spring': ['spring framework', 'spring mvc', 'spring data', 'spring boot development'],
  
  // Backend Development - Go
  'golang': ['golang development', 'go programming language', 'golang microservices', 'go backend'],
  'go': ['go programming', 'golang application', 'go backend development', 'go microservices'],
  
  // Backend Development - .NET
  '.net': ['dot net development', 'csharp programming', 'backend development', 'enterprise software'],
  'c#': ['csharp development', 'csharp programming', 'dot net csharp', 'enterprise csharp development'],
  'asp.net': ['asp net development', 'asp net core', 'csharp web development', 'asp net api'],
  
  // Backend Development - Python & Node.js
  'python': ['python development', 'python programming', 'python backend', 'fastapi django'],
  'django': ['django framework', 'python django', 'django rest api', 'django development'],
  'fastapi': ['fastapi framework', 'python fastapi', 'fastapi api development', 'async python'],
  'nodejs': ['node js development', 'nodejs backend', 'express js', 'javascript backend'],
  'express': ['express js framework', 'nodejs express', 'javascript api', 'express backend'],
  
  // General Backend & API
  'microservices': ['microservices architecture', 'distributed systems', 'system architecture', 'backend development'],
  'backend': ['backend development', 'server infrastructure', 'api development', 'backend code'],
  'api': ['api development', 'rest api', 'graphql api', 'web services'],
  
  // Database Technologies
  'database': ['database design', 'data storage', 'sql database', 'data architecture'],
  'sql': ['sql database', 'sql development', 'relational database', 'sql server'],
  'nosql': ['nosql database', 'mongodb', 'nosql development', 'document database'],
  'mongodb': ['mongodb database', 'mongodb development', 'nosql mongodb', 'document database'],
  'postgresql': ['postgresql database', 'postgres sql', 'postgresql development', 'relational database'],
  'redis': ['redis cache', 'redis database', 'caching redis', 'in memory database'],
  
  // DevOps & Infrastructure - Containerization
  'docker': ['docker containers', 'containerization', 'docker technology', 'docker development'],
  'container': ['container technology', 'containerization', 'docker kubernetes', 'container orchestration'],
  'kubernetes': ['kubernetes', 'container orchestration', 'kubernetes deployment', 'k8s orchestration'],
  'k8s': ['kubernetes k8s', 'kubernetes orchestration', 'container orchestration', 'kubernetes deployment'],
  
  // DevOps & Infrastructure - General
  'devops': ['devops engineering', 'devops deployment', 'infrastructure automation', 'ci cd pipeline'],
  'ci/cd': ['continuous integration', 'continuous deployment', 'ci cd pipeline', 'devops automation'],
  'deployment': ['deployment process', 'release management', 'continuous deployment', 'infrastructure'],
  'infrastructure': ['infrastructure automation', 'infrastructure code', 'cloud infrastructure', 'infrastructure design'],
  
  // Cloud Platforms
  'cloud': ['cloud computing', 'cloud infrastructure', 'cloud services', 'cloud deployment'],
  'aws': ['aws cloud', 'amazon web services', 'aws development', 'aws infrastructure'],
  'azure': ['azure cloud', 'microsoft azure', 'azure development', 'azure services'],
  'gcp': ['google cloud platform', 'gcp development', 'google cloud', 'gcp services'],
  
  // AI & Machine Learning
  'ai': ['artificial intelligence', 'ai development', 'ai application', 'machine learning ai'],
  'machine learning': ['machine learning development', 'ml model', 'machine learning algorithm', 'deep learning'],
  'ml': ['machine learning', 'ml model', 'ml development', 'machine learning ai'],
  'deep learning': ['deep learning', 'neural network', 'deep learning model', 'tensorflow pytorch'],
  'tensorflow': ['tensorflow framework', 'tensorflow model', 'tensorflow development', 'deep learning tensorflow'],
  'pytorch': ['pytorch framework', 'pytorch model', 'pytorch development', 'deep learning pytorch'],
  'keras': ['keras framework', 'keras model', 'deep learning keras', 'neural network keras'],
  
  // Agentic AI & LLM
  'agentic ai': ['agentic ai development', 'autonomous ai', 'ai agent system', 'intelligent agent'],
  'agent ai': ['ai agent', 'autonomous agent', 'agent development', 'intelligent automation'],
  'llm': ['large language model', 'llm development', 'gpt api', 'language model'],
  'gpt': ['gpt model', 'openai gpt', 'gpt api integration', 'large language model'],
  'transformer': ['transformer model', 'transformer architecture', 'attention mechanism', 'nlp transformer'],
  'nlp': ['natural language processing', 'nlp development', 'text processing', 'language model'],
  'chatbot': ['chatbot development', 'ai chatbot', 'conversational ai', 'intelligent chatbot'],
  
  // Data Science & Analytics
  'data science': ['data science development', 'data analysis', 'data visualization', 'data scientist'],
  'data': ['data processing', 'data pipeline', 'data engineering', 'big data'],
  'analytics': ['data analytics', 'business analytics', 'analytics platform', 'analytics development'],
  'spark': ['apache spark', 'spark development', 'big data spark', 'distributed computing'],
  'hadoop': ['hadoop framework', 'hadoop development', 'big data hadoop', 'distributed storage'],
  
  // Software Architecture & Design
  'architecture': ['software architecture', 'system design', 'architecture diagram', 'technical design'],
  'design': ['design thinking', 'ux design', 'interface design', 'design pattern'],
  'pattern': ['design pattern', 'software pattern', 'coding pattern', 'architecture pattern'],
  'scalability': ['scalable systems', 'scaling architecture', 'performance optimization', 'system efficiency'],
  'clean code': ['clean code', 'code quality', 'best practices', 'refactoring'],
  
  // Version Control & Collaboration
  'git': ['git version control', 'github development', 'git workflow', 'version control'],
  'github': ['github repository', 'github development', 'github workflow', 'git repository'],
  
  // Testing & Quality
  'testing': ['unit testing', 'integration testing', 'test development', 'testing framework'],
  'tdd': ['test driven development', 'unit test', 'testing methodology', 'test automation'],
  'qa': ['quality assurance', 'qa testing', 'automation testing', 'test quality'],
  
  // Monitoring & Logging
  'monitoring': ['monitoring systems', 'system monitoring', 'performance monitoring', 'infrastructure monitoring'],
  'logging': ['log management', 'system logging', 'log analysis', 'observability'],
  'observability': ['observability', 'system monitoring', 'performance tracking', 'analytics'],
  
  // Product & Business
  'product': ['product development', 'product design', 'product management', 'innovation'],
  'agile': ['agile methodology', 'agile development', 'sprint planning', 'agile team'],
  'scrum': ['scrum development', 'scrum team', 'sprint', 'agile scrum'],
  'innovation': ['innovation', 'creative thinking', 'breakthrough ideas', 'technology innovation'],
  'startup': ['startup business', 'entrepreneurship', 'business growth', 'startup team'],
  'performance': ['performance optimization', 'efficiency', 'speed optimization', 'performance metrics'],
  
  // General Development
  'code': ['programming code', 'software development', 'coding', 'developer workspace'],
  'development': ['software development', 'web development', 'coding', 'developer tools'],
};

// Default search terms if topic not found
const defaultSearchTerms = [
  'technology',
  'programming',
  'software development',
  'professional workspace',
];

// Fetch images from Unsplash API - returns array of images with better filtering
async function fetchUnsplashImages(searchTerms: string[], limit: number = 1): Promise<string[]> {
  if (!UNSPLASH_API_KEY) {
    console.warn('Unsplash API key not configured, using fallback images');
    return [];
  }

  const images: string[] = [];

  try {
    // Try to get images from each search term for variety
    for (const term of searchTerms) {
      try {
        console.log(`Fetching images for search term: "${term}"`);
        
        // Fetch with ordering by relevance and popularity
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=8&order_by=relevant&client_id=${UNSPLASH_API_KEY}`,
          { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
          console.warn(`Unsplash API error for term "${term}": ${response.status}`);
          continue;
        }

        const data = await response.json();
        console.log(`Found ${data.results?.length || 0} results for "${term}"`);

        if (data.results && data.results.length > 0) {
          // Get top 3-4 most relevant images from this search for variety
          // This ensures we get different images for content vs thumbnail
          data.results.slice(0, 4).forEach((photo: any) => {
            if (photo.urls?.regular) {
              console.log(`  - Selected: ${photo.description || photo.alt_description || 'No description'}`);
              images.push(photo.urls.regular);
            }
          });

          if (images.length >= limit * 3) break; // Got enough images (3x the limit for variety)
        }
      } catch (err) {
        console.warn(`Error fetching from Unsplash for term "${term}":`, err);
        continue;
      }
    }

    console.log(`Total images fetched: ${images.length}`);
    return images.slice(0, limit * 3); // Return up to 3x limit for maximum variety
  } catch (error) {
    console.error('Error in fetchUnsplashImages:', error);
    return [];
  }
}

// Extract topics from text (instruction and content)
function extractTopics(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundTopics: string[] = [];

  for (const topic of Object.keys(topicSearchTermMap)) {
    if (lowerText.includes(topic)) {
      foundTopics.push(topic);
    }
  }

  return foundTopics.length > 0 ? foundTopics : [];
}

// Generate custom search terms from prompt using AI - for better accuracy
async function generateCustomSearchTerms(instruction: string, articleContent: string = ''): Promise<string[]> {
  try {
    // Combine instruction and content for better context
    const fullContext = `${instruction}\n\nGenerated content preview:\n${articleContent.substring(0, 800)}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert at creating highly specific Unsplash image search queries that match article topics precisely.

CRITICAL: Your search terms MUST match the specific technologies and topics mentioned in the article.

Your task: Generate search terms that will find professional, relevant images for blog articles.

Rules:
1. Extract the MAIN TECHNOLOGY and CONTEXT from the article
2. Create 4-5 SPECIFIC, DETAILED search terms combining technology + use case + context
3. Each term should be 2-5 words:
   - For "Flutter mobile development": flutter development, flutter app, mobile cross platform, flutter ui, flutter testing
   - For "Java Spring Boot microservices": java spring boot, microservices architecture, enterprise java, spring boot api, distributed systems
   - For "Golang backend": golang backend, go programming, golang microservices, go concurrency, golang web server
   - For "React TypeScript": react development, react typescript, component based ui, javascript frontend, react hooks
4. MUST include the specific technology mentioned (not generic terms)
5. Return ONLY search terms separated by commas
6. No explanations, no numbering, just comma-separated terms

CRITICAL: If article mentions "Flutter", do NOT return "react" or "angular". Match the EXACT technology!`,
        },
        {
          role: 'user',
          content: `Generate image search terms for this article:\n\n${fullContext}`,
        },
      ],
      max_tokens: 250,
      temperature: 0.2,
    });

    const termsText = response.choices[0].message.content || '';
    console.log('Raw AI response for search terms:', termsText);
    
    // Parse with more flexible filtering
    const terms = termsText
      .split(',')
      .map(t => t.trim().replace(/^["\']|["\']$/g, '')) // Remove quotes
      .filter(t => t.length > 2 && !t.includes(':') && !t.startsWith('No') && !t.includes('http') && !t.includes('?'))
      .slice(0, 5);

    console.log('Parsed search terms:', terms);
    return terms.length > 0 ? terms : [];
  } catch (error) {
    console.warn('Error generating custom search terms:', error);
    return [];
  }
}

// Get search terms for detected topics
function getSearchTermsForTopics(topics: string[]): string[] {
  const searchTerms: string[] = [];

  for (const topic of topics) {
    const terms = topicSearchTermMap[topic];
    if (terms) {
      // Use first 2 terms only for efficiency
      searchTerms.push(...terms.slice(0, 2));
    }
  }

  return searchTerms.length > 0 ? searchTerms.slice(0, 3) : defaultSearchTerms;
}

// System prompt for consistent article styling with image placeholders
const ARTICLE_SYSTEM_PROMPT = `You are a professional technical content writer specializing in software engineering, .NET development, microservices, leadership, and product development.

When generating articles, follow these guidelines:
1. Write in a professional yet approachable tone
2. Use Markdown formatting with proper headings (# for title, ## for sections, ### for subsections)
3. Include code examples in markdown code blocks with language specification
4. **IMPORTANT**: Add ONLY 1-2 [IMAGE] markers strategically:
   - First [IMAGE] after the introduction (after first paragraph)
   - Second [IMAGE] in the middle section if article is very long (1200+ words)
5. Structure: Introduction → [IMAGE] → Key concepts → Examples → Best practices → [IMAGE] (if long) → Conclusion
6. Add practical insights from 7+ years of software engineering experience
7. Include actionable takeaways and practical tips
8. Use bullet points and numbered lists for clarity
9. Aim for 800-1500 words

Format the response ONLY as valid Markdown. Do not include any JSON or code blocks outside of the markdown content.`;

// Embed images into content (max 1-2 images)
function embedImagesIntoContent(content: string, images: string[]): string {
  let imageIndex = 0;

  // Replace [IMAGE] markers with actual image markdown (max 2 images)
  return content.replace(/\[IMAGE\]/g, () => {
    if (imageIndex >= images.length || imageIndex >= 2) {
      return ''; // Don't show more than 2 images
    }
    const imageUrl = images[imageIndex];
    imageIndex++;
    return `\n\n![Article visualization](${imageUrl})\n\n`;
  });
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
          content: `Generate a technical article based on this instruction:\n\n${instruction}\n\nRemember to add [IMAGE] markers throughout the content.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    let content = completion.choices[0].message.content || '';

    // Extract topics from instruction and content
    const detectedTopics = extractTopics(instruction + ' ' + content);
    console.log('Detected topics:', detectedTopics);
    
    // Extract key technologies/keywords directly from instruction
    const instructionKeywords = instruction.toLowerCase().split(/[\s,\.\!?:;]+/).filter((w: string) => w.length > 3);
    console.log('Instruction keywords:', instructionKeywords);
    
    // Get search terms: ALWAYS use AI-generated terms first (most accurate)
    let searchTerms = await generateCustomSearchTerms(instruction, content);
    
    // If AI search fails, use detected topics + explicit keywords
    if (searchTerms.length === 0) {
      console.log('AI search failed, falling back to topic-based terms');
      
      // First, try detected topic mappings
      const topicTerms = getSearchTermsForTopics(detectedTopics);
      
      // Then add specific keywords from instruction (filter for tech-related words)
      const techKeywords = instructionKeywords.filter((w: string) => 
        ['flutter', 'react', 'java', 'spring', 'golang', 'python', 'nodejs', 'docker', 'kubernetes', 
         'microservices', 'api', 'database', 'frontend', 'backend', 'devops', 'cloud', 'ai', 'ml',
         'typescript', 'javascript', 'csharp', 'golang', 'django', 'fastapi', 'express', 'angular',
         'vue', 'mongodb', 'postgresql', 'redis', 'aws', 'azure', 'gcp'].includes(w)
      );
      
      searchTerms = [...topicTerms, ...techKeywords];
    }
    
    console.log('Final search terms to use:', searchTerms);
    
    // Fetch more images from Unsplash API based on topics
    // Request 3 images so we can ensure variety between content and thumbnail
    let images = await fetchUnsplashImages(searchTerms, 3); // Fetch up to 9 images for maximum variety
    console.log(`Fetched ${images.length} images`);
    
    // If no images found from Unsplash, use fallback (just 1 image)
    if (images.length === 0) {
      console.warn('No images found from Unsplash, using fallback image');
      images = [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop&q=80',
      ];
    }

    // Separate images for thumbnail vs content - ensure they are different
    let thumbnailImage = '';
    let contentImages: string[] = [];
    
    if (images.length >= 3) {
      // If we have 3+ images: use last one for thumbnail, first 2 for content
      contentImages = images.slice(0, 2); // First 2 for content
      thumbnailImage = images[2].replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=600'); // 3rd for thumbnail
      console.log('Using 3+ images: content=[0,1], thumbnail=[2]');
    } else if (images.length === 2) {
      // If we have 2 images: use first for content, second for thumbnail
      contentImages = [images[0]]; // Only first in content to ensure different from thumbnail
      thumbnailImage = images[1].replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=600');
      console.log('Using 2 images: content=[0], thumbnail=[1]');
    } else if (images.length === 1) {
      // Only 1 image - use for both but will be same
      contentImages = [images[0]];
      thumbnailImage = images[0].replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=600');
      console.log('Using 1 image: content=[0], thumbnail=[0]');
    } else {
      // Fallback
      thumbnailImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop&q=80';
      console.log('Using fallback image');
    }

    // Embed Unsplash images into the content
    content = embedImagesIntoContent(content, contentImages);

    // Extract title from the first heading in the markdown
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Generated Article';

    // Extract description (first paragraph after title, excluding images)
    const descriptionMatch = content.match(/^# .+\n\n(.+?)(?:\n\n|\!\[|\n##)/s);
    const rawDescription = descriptionMatch ? descriptionMatch[1].trim() : instruction.substring(0, 160);
    // Remove markdown image syntax from description
    const description = rawDescription.replace(/!\[.*?\]\(.*?\)/g, '').substring(0, 160).trim();

    // Use different image as featured image (thumbnail) vs content images
    let imageUrl = thumbnailImage;

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
