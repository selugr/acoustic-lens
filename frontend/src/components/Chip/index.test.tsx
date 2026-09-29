import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chip, Tag } from './index'

describe('Chip', () => {
	it('is a button that calls onClick', async () => {
		const onClick = vi.fn()
		render(<Chip onClick={onClick}>Cathedral</Chip>)

		await userEvent.click(screen.getByRole('button', { name: 'Cathedral' }))

		expect(onClick).toHaveBeenCalledOnce()
	})

	it('Tag is static text, not interactive', () => {
		render(<Tag>WAV</Tag>)

		expect(screen.getByText('WAV')).toBeInTheDocument()
		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})
})
