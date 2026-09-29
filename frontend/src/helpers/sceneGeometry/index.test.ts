import { describe, expect, it } from 'vitest'
import { ringMeters, sourcePoint } from './index'

describe('ringMeters', () => {
	it('uses 1/2/4 m rings up to 4 m', () => {
		expect(ringMeters(0.5)).toEqual([1, 2, 4])
		expect(ringMeters(4)).toEqual([1, 2, 4])
	})
	it('rescales the rings to max/4, max/2, max beyond 4 m', () => {
		expect(ringMeters(8)).toEqual([2, 4, 8])
	})
})

describe('sourcePoint (x right, y down, listener at 0,0; front is up)', () => {
	const at = (az: number, d: number, max = 4, r = 100) => {
		const p = sourcePoint(az, d, max, r)
		return { x: Math.round(p.x) + 0, y: Math.round(p.y) + 0 }
	}
	it('places front, right, left and behind', () => {
		expect(at(0, 4)).toEqual({ x: 0, y: -100 })
		expect(at(90, 4)).toEqual({ x: 100, y: 0 })
		expect(at(-90, 4)).toEqual({ x: -100, y: 0 })
		expect(at(180, 4)).toEqual({ x: 0, y: 100 })
	})
	it('scales linearly with distance', () => {
		expect(at(0, 2)).toEqual({ x: 0, y: -50 })
	})
	it('clamps beyond the outer ring and below zero', () => {
		expect(at(0, 10)).toEqual({ x: 0, y: -100 })
		expect(at(0, -3)).toEqual({ x: 0, y: 0 })
	})
})
