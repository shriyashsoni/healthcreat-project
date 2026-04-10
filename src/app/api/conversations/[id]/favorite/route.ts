import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = params.id;

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('conversation_id', conversationId)
      .single();

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId);

      if (error) throw error;
      return NextResponse.json({ favorited: false });
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          conversation_id: conversationId,
        });

      if (error) throw error;
      return NextResponse.json({ favorited: true });
    }
  } catch (error: any) {
    console.error('[v0] Favorite toggle error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}
