import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DB_TABLES } from '@/lib/constants/db';
import { pushUnsubscribeSchema } from '@/lib/schemas/validation';

export async function POST(req: NextRequest) {
  try {
    const { user, supabase } = await getCurrentAuthUser({ withClient: true });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validated = pushUnsubscribeSchema.parse(body);
    const { endpoint } = validated;

    const { error } = await supabase
      .from(DB_TABLES.PUSH_SUBSCRIPTIONS)
      .delete()
      .match({ user_id: user.id, endpoint });

    if (error) {
      console.error('[push/unsubscribe] DB error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.issues },
        { status: 400 }
      );
    }
    console.error('Push unsubscribe error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
