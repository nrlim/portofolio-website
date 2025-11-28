import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { BlogArticle } from '@/types/database';

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

// GET all articles (published public, all for authenticated users)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session = getAuthSession(request);
    
    // For authenticated users, check if they want all articles (including drafts)
    const showAll = searchParams.get('published') === 'false';
    const featured = searchParams.get('featured');

    let query = supabaseServer
      .from('blog_articles')
      .select('*')
      .order('created_at', { ascending: false });

    // If not authenticated or not showing all, only show published articles
    if (!session || !showAll) {
      query = query.eq('published', true);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new article (authenticated)
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
    const { title, description, content, category, featured, published } = body;

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('blog_articles')
      .insert({
        title,
        description,
        content,
        category: category || 'General',
        author_id: session.id,
        featured: featured || false,
        published: published || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
