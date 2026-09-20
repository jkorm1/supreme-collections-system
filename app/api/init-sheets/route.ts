import { NextResponse } from 'next/server';
import { initializeGoogleSheets } from '@/lib/google-sheets/init';

export async function GET() {
  try {
    await initializeGoogleSheets();
    return NextResponse.json({ success: true, message: 'Google Sheets initialized successfully' });
  } catch (error) {
    console.error('Failed to initialize Google Sheets:', error);
    return NextResponse.json({ success: false, error: 'Failed to initialize Google Sheets' }, { status: 500 });
  }
}
