import { describe, expect, it } from 'vitest'
import { clamp, isBool, isNum, isStr, pickEnum } from './validation'

describe('isNum', () => {
	it('accepts finite numbers, including zero and negatives', () => {
		expect(isNum(0)).toBe(true)
		expect(isNum(-5)).toBe(true)
		expect(isNum(3.14)).toBe(true)
	})

	it('rejects non-finite numbers', () => {
		expect(isNum(Number.NaN)).toBe(false)
		expect(isNum(Number.POSITIVE_INFINITY)).toBe(false)
		expect(isNum(Number.NEGATIVE_INFINITY)).toBe(false)
	})

	it('rejects non-number types', () => {
		expect(isNum('5')).toBe(false)
		expect(isNum(null)).toBe(false)
		expect(isNum(undefined)).toBe(false)
		expect(isNum(true)).toBe(false)
		expect(isNum({})).toBe(false)
		expect(isNum([])).toBe(false)
	})
})

describe('isBool', () => {
	it('accepts true and false', () => {
		expect(isBool(true)).toBe(true)
		expect(isBool(false)).toBe(true)
	})

	it('rejects non-boolean types', () => {
		expect(isBool('true')).toBe(false)
		expect(isBool(0)).toBe(false)
		expect(isBool(1)).toBe(false)
		expect(isBool(null)).toBe(false)
		expect(isBool(undefined)).toBe(false)
	})
})

describe('isStr', () => {
	it('accepts empty and non-empty strings', () => {
		expect(isStr('')).toBe(true)
		expect(isStr('hello')).toBe(true)
	})

	it('rejects non-string types', () => {
		expect(isStr(5)).toBe(false)
		expect(isStr(null)).toBe(false)
		expect(isStr(undefined)).toBe(false)
		expect(isStr({})).toBe(false)
	})
})

describe('clamp', () => {
	it('leaves values inside the range unchanged', () => {
		expect(clamp(5, 0, 10)).toBe(5)
	})

	it('clamps values below the minimum', () => {
		expect(clamp(-5, 0, 10)).toBe(0)
	})

	it('clamps values above the maximum', () => {
		expect(clamp(15, 0, 10)).toBe(10)
	})

	it('returns the boundary value exactly at min/max', () => {
		expect(clamp(0, 0, 10)).toBe(0)
		expect(clamp(10, 0, 10)).toBe(10)
	})

	it('handles a degenerate range where min === max', () => {
		expect(clamp(5, 3, 3)).toBe(3)
	})

	it('handles negative ranges', () => {
		expect(clamp(-50, -100, -10)).toBe(-50)
		expect(clamp(-5, -100, -10)).toBe(-10)
		expect(clamp(-200, -100, -10)).toBe(-100)
	})
})

describe('pickEnum', () => {
	const allowed = ['a', 'b', 'c'] as const

	it('returns the value when it is in the allow-list', () => {
		expect(pickEnum('b', allowed, 'a')).toBe('b')
	})

	it('returns the fallback for an invalid string', () => {
		expect(pickEnum('z', allowed, 'a')).toBe('a')
	})

	it('returns the fallback for an empty string', () => {
		expect(pickEnum('', allowed, 'a')).toBe('a')
	})

	it('returns the fallback for non-string values', () => {
		expect(pickEnum(5, allowed, 'a')).toBe('a')
		expect(pickEnum(null, allowed, 'a')).toBe('a')
		expect(pickEnum(undefined, allowed, 'a')).toBe('a')
		expect(pickEnum({}, allowed, 'a')).toBe('a')
	})
})
