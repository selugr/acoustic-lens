import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SourceSummary } from './index'

describe('SourceSummary', () => {
	it('renders the title and meta line', () => {
		render(<SourceSummary title="Generated voice" meta="0:12" onReplace={() => {}} />)

		expect(screen.getByText('Generated voice')).toBeInTheDocument()
		expect(screen.getByText('0:12')).toBeInTheDocument()
	})

	it('omits the meta line when unknown', () => {
		render(<SourceSummary title="take.wav" onReplace={() => {}} />)

		expect(screen.getByText('take.wav')).toBeInTheDocument()
		expect(screen.queryByTestId('source-meta')).not.toBeInTheDocument()
	})

	it('calls onReplace when Replace is pressed', async () => {
		const onReplace = vi.fn()
		render(<SourceSummary title="take.wav" onReplace={onReplace} />)

		await userEvent.click(screen.getByRole('button', { name: 'Replace' }))

		expect(onReplace).toHaveBeenCalledTimes(1)
	})
})
