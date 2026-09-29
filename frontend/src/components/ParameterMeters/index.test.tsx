import type { AudioProcessing } from '@common/types'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ParameterMeters } from './index'

const processing: AudioProcessing = {
	dry_wet_mix: 0.35,
	high_frequency_damping: 0.4,
	low_cut_frequency_hz: 120,
	high_cut_frequency_hz: 9500,
	air_absorption_enabled: true,
	occlusion_factor: 0.1,
	compression_threshold_db: -18,
	compression_ratio: 3,
}

describe('ParameterMeters', () => {
	it('shows every parameter with its formatted value', () => {
		render(<ParameterMeters processing={processing} />)
		const rows: [string, string][] = [
			['Dry / wet', '35% wet'],
			['High-frequency damping', '0.40'],
			['Occlusion', '0.10'],
			['Low cut', '120 Hz'],
			['High cut', '9.5 kHz'],
			['Compression', '−18 dB · 3:1'],
		]
		for (const [label, value] of rows) {
			expect(screen.getByText(label)).toBeInTheDocument()
			expect(screen.getByText(value)).toBeInTheDocument()
		}
	})

	it('exposes each bar as a labelled meter', () => {
		render(<ParameterMeters processing={processing} />)
		const meter = screen.getByRole('meter', { name: 'Dry / wet' })
		expect(meter).toHaveAttribute('aria-valuenow', '35')
		expect(screen.getAllByRole('meter')).toHaveLength(6)
	})
})
