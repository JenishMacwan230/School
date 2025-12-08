import { NextResponse } from 'next/server';
import getClientPromise from '@/lib/mongodb';

// GET /api/health - Check MongoDB connection health
export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db();
    
    // Ping the database to check connection
    await db.admin().ping();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection is healthy',
      database: db.databaseName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'MongoDB connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
