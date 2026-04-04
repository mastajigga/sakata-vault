import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Supabase Environment Configuration', () => {
  const envPath = path.join(process.cwd(), '.env.local')
  
  it('.env.local exists', () => {
    expect(fs.existsSync(envPath), '.env.local is missing!').toBe(true)
  })

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    
    it('NEXT_PUBLIC_SUPABASE_URL is defined and valid', () => {
      const match = content.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)
      expect(match, 'NEXT_PUBLIC_SUPABASE_URL is not defined in .env.local').not.toBeNull()
      if (match) {
        const url = match[1].trim()
        expect(url.startsWith('https://'), 'Supabase URL must start with https://').toBe(true)
        expect(url.includes('.supabase.co'), 'Supabase URL seems invalid (missing .supabase.co)').toBe(true)
      }
    })

    it('NEXT_PUBLIC_SUPABASE_ANON_KEY is defined', () => {
      const match = content.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)
      expect(match, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in .env.local').not.toBeNull()
      if (match) {
        const key = match[1].trim()
        expect(key.length, 'Supabase Anon Key is too short').toBeGreaterThan(20)
      }
    })
  }
})
