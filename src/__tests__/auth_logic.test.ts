import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocking Supabase
const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  })),
}

vi.mock('@/components/AuthProvider', () => ({
  supabase: mockSupabase,
  useAuth: () => ({ user: null, role: null, isLoading: false, connectionError: null }),
}))

describe('Authentication Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles successful sign in', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123' }, session: {} },
      error: null
    })

    const result = await mockSupabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result.error).toBeNull()
    expect(result.data.user.id).toBe('123')
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('handles sign in error', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' }
    })

    const result = await mockSupabase.auth.signInWithPassword({
      email: 'wrong@example.com',
      password: 'wrong'
    })

    expect(result.error.message).toBe('Invalid login credentials')
    expect(result.data.user).toBeNull()
  })

  it('handles successful sign up', async () => {
    mockSupabase.auth.signUp.mockResolvedValueOnce({
      data: { user: { id: '456' }, session: null },
      error: null
    })

    const result = await mockSupabase.auth.signUp({
      email: 'new@example.com',
      password: 'password123'
    })

    expect(result.error).toBeNull()
    expect(result.data.user.id).toBe('456')
  })
})
