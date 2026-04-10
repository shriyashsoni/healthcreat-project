import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  } catch (error: any) {
    console.error('[v0] Sign out error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to sign out' },
      { status: 500 }
    );
  }
}
