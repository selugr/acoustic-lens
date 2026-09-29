import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ParameterMeters } from './index'

const rows = [
	{ label: 'Dry / wet', value: '35% wet', fill: 0.35 },
	{ label: 'Occlusion', value: '—', fill: null },
]

describe('ParameterMeters', () => {
	it('shows every row with its value', () => {
		render(<ParameterMeters rows={rows} />)
		for (const t of ['Dry / wet', '35% wet', 'Occlusion', '—']) expect(screen.getByText(t)).toBeInTheDocument()
	})

	it('exposes a labelled meter only for rows with a value', () => {
		render(<ParameterMeters rows={rows} />)
		expect(screen.getByRole('meter', { name: 'Dry / wet' })).toHaveAttribute('aria-valuenow', '35')
		expect(screen.getAllByRole('meter')).toHaveLength(1)
	})
})
