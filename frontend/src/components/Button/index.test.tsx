import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './index'

describe('Button', () => {
	it('renders its label and an optional icon', () => {
		render(<Button icon={<span data-testid="icon" />}>Generate Voice</Button>)

		expect(screen.getByRole('button', { name: 'Generate Voice' })).toBeInTheDocument()
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
})
