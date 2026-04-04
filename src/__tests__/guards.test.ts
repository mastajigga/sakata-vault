/**
 * KISAKATA.COM — Guard Tests
 * 
 * These tests catch the 3 categories of bugs that broke the site:
 * 1. Missing Tailwind CSS configuration
 * 2. Hydration mismatches (Math.random/Date.now in render)
 * 3. Event handlers in Server Components
 * 
 * Run: npm test
 */

import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'src')

// ============================================================
// HELPER: recursively get all files matching extension
// ============================================================
function getFiles(dir: string, ext: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getFiles(full, ext))
    } else if (entry.name.endsWith(ext)) {
      results.push(full)
    }
  }
  return results
}

// ============================================================
// 1. TAILWIND CSS CONFIGURATION GUARD
// ============================================================
describe('Tailwind CSS Configuration', () => {
  it('tailwind.config.js exists at project root', () => {
    const configPath = path.join(ROOT, 'tailwind.config.js')
    expect(
      fs.existsSync(configPath),
      'tailwind.config.js is missing! Run: npm install -D tailwindcss@^3 postcss autoprefixer && npx tailwindcss init -p'
    ).toBe(true)
  })

  it('postcss.config.js exists at project root', () => {
    const configPath = path.join(ROOT, 'postcss.config.js')
    expect(
      fs.existsSync(configPath),
      'postcss.config.js is missing! Run: npx tailwindcss init -p'
    ).toBe(true)
  })

  it('tailwindcss is in devDependencies', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8')
    )
    expect(
      pkg.devDependencies?.tailwindcss,
      'tailwindcss is not in devDependencies! Run: npm install -D tailwindcss@^3'
    ).toBeDefined()
  })

  it('globals.css has @tailwind directives', () => {
    const cssPath = path.join(SRC, 'app', 'globals.css')
    const content = fs.readFileSync(cssPath, 'utf-8')
    expect(
      content.includes('@tailwind base'),
      'globals.css missing @tailwind base directive'
    ).toBe(true)
    expect(
      content.includes('@tailwind components'),
      'globals.css missing @tailwind components directive'
    ).toBe(true)
    expect(
      content.includes('@tailwind utilities'),
      'globals.css missing @tailwind utilities directive'
    ).toBe(true)
  })

  it('tailwind.config.js scans src/ directories', () => {
    const configContent = fs.readFileSync(
      path.join(ROOT, 'tailwind.config.js'),
      'utf-8'
    )
    expect(
      configContent.includes('./src/'),
      'tailwind.config.js content paths do not include ./src/ — Tailwind will not process any components'
    ).toBe(true)
  })
})

// ============================================================
// 2. HYDRATION MISMATCH GUARD
//    Detects Math.random(), Date.now(), new Date() in JSX render
// ============================================================
describe('Hydration Safety — No non-deterministic values in render', () => {
  const clientComponents = getFiles(path.join(SRC, 'components'), '.tsx')

  // Dangerous patterns that cause SSR/client hydration mismatches
  const DANGEROUS_PATTERNS = [
    { regex: /Math\.random\(\)/, name: 'Math.random()' },
    { regex: /Date\.now\(\)/, name: 'Date.now()' },
    { regex: /new Date\(\)/, name: 'new Date()' },
    { regex: /crypto\.randomUUID\(\)/, name: 'crypto.randomUUID()' },
  ]

  for (const file of clientComponents) {
    const relative = path.relative(ROOT, file)
    const content = fs.readFileSync(file, 'utf-8')

    // Only check "use client" files — they render on both server and client
    if (!content.includes('"use client"')) continue

    // Exclude content inside useEffect/useState callbacks (those are safe)
    // Simple heuristic: check if the pattern appears OUTSIDE of useEffect
    const renderContent = extractRenderBody(content)

    for (const pattern of DANGEROUS_PATTERNS) {
      it(`${relative} — no ${pattern.name} in render output`, () => {
        expect(
          pattern.regex.test(renderContent),
          `${relative} uses ${pattern.name} in the render path. This causes hydration mismatches. Move it into useEffect/useState or use a pre-computed deterministic array.`
        ).toBe(false)
      })
    }
  }
})

// ============================================================
// 3. SERVER COMPONENT BOUNDARY GUARD
//    Detects event handlers in files without "use client"
// ============================================================
describe('Server Component Boundary — No event handlers in Server Components', () => {
  const pageFiles = getFiles(path.join(SRC, 'app'), '.tsx')

  const EVENT_HANDLERS = [
    'onClick',
    'onChange',
    'onSubmit',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseOver',
    'onMouseOut',
    'onFocus',
    'onBlur',
    'onKeyDown',
    'onKeyUp',
    'onScroll',
    'onInput',
    'onTouchStart',
    'onTouchEnd',
  ]

  for (const file of pageFiles) {
    const relative = path.relative(ROOT, file)
    const content = fs.readFileSync(file, 'utf-8')

    // Skip client components — they can have event handlers
    if (content.includes('"use client"')) continue

    for (const handler of EVENT_HANDLERS) {
      it(`${relative} — no ${handler} in Server Component`, () => {
        // Check for handler= pattern (JSX attribute)
        const pattern = new RegExp(`${handler}=\\{`)
        expect(
          pattern.test(content),
          `${relative} is a Server Component but uses ${handler}. Extract the interactive part into a "use client" component.`
        ).toBe(false)
      })
    }
  }
})

// ============================================================
// 4. DESIGN SYSTEM GUARD — Anti-patterns from skills
// ============================================================
describe('Design System — Anti-patterns', () => {
  it('globals.css does not set cursor: none', () => {
    const css = fs.readFileSync(
      path.join(SRC, 'app', 'globals.css'),
      'utf-8'
    )
    expect(
      /cursor:\s*none/.test(css),
      'globals.css sets cursor: none — this is banned by the design-taste-frontend skill'
    ).toBe(false)
  })

  it('no CustomCursor component exists', () => {
    const cursorFile = path.join(SRC, 'components', 'CustomCursor.tsx')
    expect(
      fs.existsSync(cursorFile),
      'CustomCursor.tsx still exists — custom cursors are banned by the design skills'
    ).toBe(false)
  })

  it('globals.css does not use h-screen (use min-h-[100dvh] instead)', () => {
    const allTsx = [
      ...getFiles(path.join(SRC, 'app'), '.tsx'),
      ...getFiles(path.join(SRC, 'components'), '.tsx'),
    ]
    for (const file of allTsx) {
      const content = fs.readFileSync(file, 'utf-8')
      const relative = path.relative(ROOT, file)
      expect(
        /\bh-screen\b/.test(content),
        `${relative} uses h-screen — use min-h-[100dvh] instead (iOS Safari jumps)`
      ).toBe(false)
    }
  })
})

// ============================================================
// HELPER: extract the return/render body from a React component
// This is a rough heuristic — it finds content after "return ("
// ============================================================
function extractRenderBody(source: string): string {
  const returnIndex = source.lastIndexOf('return (')
  if (returnIndex === -1) return ''
  return source.slice(returnIndex)
}
