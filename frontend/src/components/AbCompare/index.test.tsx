import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AbCompare } from './index'

describe('AbCompare', () => {
	it('marks the active side with aria-pressed', () => {
		render(<AbCompare bypassed={false} disabled={false} onChange={() => {}} />)
		expect(screen.getByRole('button', { name: 'B · Space' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByRole('button', { name: 'A · Dry' })).toHaveAttribute('aria-pressed', 'false')
	})

	it('reports the chosen side', () => {
		const onChange = vi.fn()
		render(<AbCompare bypassed={false} disabled={false} onChange={onChange} />)
		fireEvent.click(screen.getByRole('button', { name: 'A · Dry' }))
		expect(onChange).toHaveBeenCalledWith(true)
	})

	it('is disabled with B selected when there is no profile', () => {
		render(<AbCompare bypassed disabled onChange={() => {}} />)
		expect(screen.getByRole('button', { name: 'A · Dry' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'B · Space' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'B · Space' })).toHaveAttribute('aria-pressed', 'true')
	})
})
