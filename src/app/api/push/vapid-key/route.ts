import { NextResponse } from 'next/server';

export async function GET() {
  // En production, cette clé devrait être dans .env
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BPE-placeholder-key-for-initial-setup-should-be-replaced";
  
  return NextResponse.json({ publicKey });
}
