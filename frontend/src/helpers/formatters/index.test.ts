import { describe, expect, it } from 'vitest'
import {
	compressionFill,
	describeDirection,
	formatCompression,
	formatDuration,
	formatHz,
	formatMeters,
	formatMs,
	formatSeconds,
	formatSigned,
	humanize,
	impulseLabel,
	logPosition,
	roomSizeLabel,
} from './index'

describe('formatters', () => {
	it('humanizes snake_case', () => {
		expect(humanize('concert_hall')).toBe('Concert hall')
		expect(humanize('forest')).toBe('Forest')
	})
	it('labels room size and impulse type', () => {
		expect(roomSizeLabel('large')).toBe('Large room')
		expect(impulseLabel('synthetic')).toBe('Synthetic IR')
		expect(impulseLabel('none')).toBe('No IR')
	})
	it('formats units', () => {
		expect(formatSeconds(2.4)).toBe('2.4 s')
		expect(formatMs(38)).toBe('38 ms')
		expect(formatMeters(3.2)).toBe('3.2 m')
		expect(formatHz(120)).toBe('120 Hz')
		expect(formatHz(9500)).toBe('9.5 kHz')
		expect(formatHz(20000)).toBe('20 kHz')
		expect(formatCompression(-18, 3)).toBe('−18 dB · 3:1')
		expect(formatSigned(-60)).toBe('−60')
		expect(formatSigned(0)).toBe('0')
	})
	it('formats m:ss durations', () => {
		expect(formatDuration(65)).toBe('1:05')
		expect(formatDuration(59.6)).toBe('1:00')
	})
	it('log-scales frequencies between 20 Hz and 20 kHz', () => {
		expect(logPosition(20)).toBe(0)
		expect(logPosition(20000)).toBe(1)
		expect(logPosition(632.455)).toBeCloseTo(0.5, 2)
		expect(logPosition(5)).toBe(0)
		expect(logPosition(99999)).toBe(1)
	})
	it('fills the compression bar from the threshold', () => {
		expect(compressionFill(0)).toBe(0)
		expect(compressionFill(-30)).toBeCloseTo(0.5)
		expect(compressionFill(-100)).toBe(1)
	})
	it('describes direction for screen readers', () => {
		expect(describeDirection(3.2, -60)).toBe('Voice is 3.2 meters away, 60 degrees to the left')
		expect(describeDirection(2, 45)).toBe('Voice is 2 meters away, 45 degrees to the right')
		expect(describeDirection(3, 0)).toBe('Voice is 3 meters away, straight ahead')
		expect(describeDirection(3, 180)).toBe('Voice is 3 meters away, directly behind you')
	})
})
