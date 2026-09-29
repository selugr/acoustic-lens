import type { AcousticSpace } from '@common/types'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SpaceSummary } from './index'

const space: AcousticSpace = {
	space_type: 'concert_hall',
	reverb_time_rt60: 2.4,
	damping_factor: 0.3,
	early_reflections_delay_ms: 38,
	room_size_category: 'large',
	surface_material: 'wood',
	impulse_response_type: 'synthetic',
}

describe('SpaceSummary', () => {
	it('renders the humanized title, tags and stat tiles', () => {
		render(<SpaceSummary space={space} distanceM={3.2} />)

		expect(screen.getByRole('heading', { name: 'Concert hall' })).toBeInTheDocument()
		for (const t of ['Wood', 'Large room', 'Synthetic IR']) expect(screen.getByText(t)).toBeInTheDocument()
		expect(screen.getByText('RT60')).toBeInTheDocument()
		expect(screen.getByText('2.4 s')).toBeInTheDocument()
		expect(screen.getByText('Pre-delay')).toBeInTheDocument()
		expect(screen.getByText('38 ms')).toBeInTheDocument()
		expect(screen.getByText('Distance')).toBeInTheDocument()
		expect(screen.getByText('3.2 m')).toBeInTheDocument()
	})
})
