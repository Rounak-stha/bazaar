import { optionsSignature } from '@/collections/Products/utilities'
import type { Product } from '@/payload-types'
import { describe, it, expect } from 'vitest'

describe('optionsSignature', () => {
  it('returns empty string when options is undefined', () => {
    expect(optionsSignature(undefined as unknown as Product['options'])).toBe('')
  })

  it('filters out options with no type or values', () => {
    const opts: Product['options'] = [
      { type: '', values: [] },
      { type: { id: 'color', name: 'Color' } as any, values: [] },
    ]
    expect(optionsSignature(opts)).toBe('[]')
  })

  it('filters out empty values', () => {
    const opts: Product['options'] = [
      {
        type: 'size',
        values: ['', { id: '' } as any, { id: '123', name: 'Small' }],
      },
    ]
    const sig = optionsSignature(opts)
    expect(sig).toContain('123')
    expect(sig).not.toContain('""')
  })

  it('handles type and values as relationship objects', () => {
    const opts: Product['options'] = [
      {
        type: { id: 'size', name: 'Size' } as any,
        values: [{ id: 's', name: 'Small' } as any, { id: 'm', name: 'Medium' } as any],
      },
      {
        type: { id: 'color', name: 'Color' } as any,
        values: [{ id: 'red', name: 'Red' } as any],
      },
    ]

    const sig = optionsSignature(opts)

    // Only ids should be in signature
    expect(sig).toContain('size')
    expect(sig).toContain('s')
    expect(sig).toContain('m')
    expect(sig).toContain('color')
    expect(sig).toContain('red')
    expect(sig).not.toContain('Small') // names should be ignored
  })

  it('produces same signature regardless of option order', () => {
    const opts1: Product['options'] = [
      { type: { id: 'size', name: 'Size' } as any, values: [{ id: 's', name: 'Small' }] as any },
      { type: { id: 'color', name: 'Color' } as any, values: [{ id: 'red', name: 'Red' }] as any },
    ]
    const opts2: Product['options'] = [...opts1].reverse()

    expect(optionsSignature(opts1)).toBe(optionsSignature(opts2))
  })

  it('produces same signature regardless of value order', () => {
    const opts1: Product['options'] = [
      {
        type: { id: 'size', name: 'Size' } as any,
        values: [
          { id: 's', name: 'Small' },
          { id: 'l', name: 'Large' },
        ] as any,
      },
    ]
    const opts2: Product['options'] = [
      {
        type: { id: 'size', name: 'Size' } as any,
        values: [
          { id: 'l', name: 'Large' },
          { id: 's', name: 'Small' },
        ] as any,
      },
    ]

    expect(optionsSignature(opts1)).toBe(optionsSignature(opts2))
  })

  it('detects differences when values change', () => {
    const opts1: Product['options'] = [
      { type: { id: 'size', name: 'Size' } as any, values: [{ id: 's', name: 'Small' }] as any },
    ]
    const opts2: Product['options'] = [
      { type: { id: 'size', name: 'Size' } as any, values: [{ id: 'm', name: 'Medium' }] as any },
    ]

    expect(optionsSignature(opts1)).not.toBe(optionsSignature(opts2))
  })

  it('detects differences when option type changes', () => {
    const opts1: Product['options'] = [
      { type: { id: 'size', name: 'Size' } as any, values: [{ id: 's', name: 'Small' }] as any },
    ]
    const opts2: Product['options'] = [
      { type: { id: 'fit', name: 'Fit' } as any, values: [{ id: 's', name: 'Small' }] as any },
    ]

    expect(optionsSignature(opts1)).not.toBe(optionsSignature(opts2))
  })
})
