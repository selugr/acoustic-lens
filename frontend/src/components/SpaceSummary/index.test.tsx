import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SpaceSummary } from './index'

describe('SpaceSummary', () => {
	it('renders the title, tags and stat tiles it is given', () => {
		render(
			<SpaceSummary
				title="Concert hall"
				tags={['Wood', 'Large room', 'Synthetic IR']}
				stats={[
					{ label: 'RT60', value: '2.4 s' },
					{ label: 'Pre-delay', value: '38 ms' },
					{ label: 'Distance', value: '3.2 m' },
				]}
			/>,
		)

		expect(screen.getByRole('heading', { name: 'Concert hall' })).toBeInTheDocument()
		for (const t of ['Wood', 'Large room', 'Synthetic IR', 'RT60', '2.4 s', 'Pre-delay', '38 ms', 'Distance', '3.2 m'])
			expect(screen.getByText(t)).toBeInTheDocument()
	})
})
