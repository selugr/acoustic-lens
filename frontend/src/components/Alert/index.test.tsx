import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './index'

describe('Alert', () => {
	it('danger alerts use role="alert" and show title and message', () => {
		render(
			<Alert variant="danger" title="Couldn’t generate the voice">
				The speech service didn’t respond.
			</Alert>,
		)

		const alert = screen.getByRole('alert')
		expect(alert).toHaveTextContent('Couldn’t generate the voice')
		expect(alert).toHaveTextContent('The speech service didn’t respond.')
	})

	it('runs the action callback', async () => {
		const onClick = vi.fn()
		render(
			<Alert variant="danger" title="Failed" action={{ label: 'Retry', onClick }}>
				Try again.
			</Alert>,
		)

		await userEvent.click(screen.getByRole('button', { name: 'Retry' }))

		expect(onClick).toHaveBeenCalledOnce()
	})

	it('warning alerts are polite status messages, not alerts', () => {
		render(<Alert variant="warning">Audio is paused by the browser.</Alert>)

		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
		expect(screen.getByRole('status')).toHaveTextContent('Audio is paused by the browser.')
	})
})
