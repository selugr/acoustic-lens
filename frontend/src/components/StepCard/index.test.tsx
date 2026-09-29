import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StepCard } from './index'

describe('StepCard', () => {
	it('renders the step number, heading, description and children', () => {
		render(
			<StepCard step={2} title="Acoustic space" description="Describe the room.">
				<p>Body</p>
			</StepCard>,
		)

		expect(screen.getByRole('heading', { level: 2, name: 'Acoustic space' })).toBeInTheDocument()
		expect(screen.getByText('Describe the room.')).toBeInTheDocument()
		expect(screen.getByText('2')).toBeInTheDocument()
		expect(screen.getByText('Body')).toBeInTheDocument()
	})

	it('shows a check instead of the number when done', () => {
		render(<StepCard step={1} title="Source" done />)

		expect(screen.queryByText('1')).not.toBeInTheDocument()
		expect(screen.getByText('Step 1 complete')).toBeInTheDocument()
	})

	it('renders the aside slot', () => {
		render(<StepCard step={1} title="Source" aside={<span>Ready</span>} />)

		expect(screen.getByText('Ready')).toBeInTheDocument()
	})
})
