import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const startTime = Date.now();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtmjbftdytobvikkauas.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test Supabase Database Ping
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    const responseTimeMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          error: error.message,
          responseTimeMs
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        database: 'connected',
        responseTimeMs
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'error',
        error: err?.message || 'Unknown health check exception',
        responseTimeMs: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}
