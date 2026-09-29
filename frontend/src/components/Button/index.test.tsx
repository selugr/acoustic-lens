import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './index'

describe('Button', () => {
	it('renders its label and an optional icon', () => {
		render(<Button icon={<span data-testid="icon" />}>Generate voice</Button>)

		expect(screen.getByRole('button', { name: 'Generate voice' })).toBeInTheDocument()
		expect(screen.getByTestId('icon')).toBeInTheDocument()
	})

	it('calls onClick when clicked', async () => {
		const onClick = vi.fn()
		render(<Button onClick={onClick}>Apply</Button>)

		await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

		expect(onClick).toHaveBeenCalledOnce()
	})

	it('does not call onClick when disabled', async () => {
		const onClick = vi.fn()
		render(
			<Button onClick={onClick} disabled>
				Apply
			</Button>,
		)

		await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

		expect(onClick).not.toHaveBeenCalled()
	})

	it('when loading it is disabled, aria-busy and shows the loading label', () => {
		render(
			<Button loading loadingLabel="Building…">
				Build space
			</Button>,
		)

		const button = screen.getByRole('button', { name: 'Building…' })
		expect(button).toBeDisabled()
		expect(button).toHaveAttribute('aria-busy', 'true')
		expect(screen.queryByText('Build space')).not.toBeInTheDocument()
	})

	it('when loading without a loading label it keeps the original label', () => {
		render(<Button loading>Build space</Button>)

		expect(screen.getByRole('button', { name: 'Build space' })).toBeDisabled()
	})

	it('does not call onClick while loading', async () => {
		const onClick = vi.fn()
		render(
			<Button loading onClick={onClick}>
				Build space
			</Button>,
		)

		await userEvent.click(screen.getByRole('button'))

		expect(onClick).not.toHaveBeenCalled()
	})

	it('defaults to type="button" so it never submits a form by accident', () => {
		render(<Button>Apply</Button>)

		expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
	})
})
