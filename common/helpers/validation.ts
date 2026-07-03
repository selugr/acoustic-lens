export const isNum = (v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v)

export const isBool = (v: unknown): v is boolean => typeof v === 'boolean'

export const isStr = (v: unknown): v is string => typeof v === 'string'

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export const pickEnum = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
	isStr(v) && (allowed as readonly string[]).includes(v) ? (v as T) : fallback
