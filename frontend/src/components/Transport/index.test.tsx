import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Transport } from './index'

const base = { playing: false, currentTime: 4, duration: 12, onToggle: () => {}, onSeek: () => {} }

describe('Transport', () => {
	it('shows the mono time and a Play button when paused', () => {
		render(<Transport {...base} />)
		expect(screen.getByText('0:04 / 0:12')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
	})

	it('shows Pause while playing and toggles on click', () => {
		const onToggle = vi.fn()
		render(<Transport {...base} playing onToggle={onToggle} />)
		fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
		expect(onToggle).toHaveBeenCalledTimes(1)
	})

	it('exposes a keyboard-accessible Seek range and reports changes', () => {
		const onSeek = vi.fn()
		render(<Transport {...base} onSeek={onSeek} />)
		const seek = screen.getByRole('slider', { name: 'Seek' })
		expect(seek).toHaveAttribute('max', '12')
		expect(seek).toHaveValue('4')

		fireEvent.change(seek, { target: { value: '9' } })

		expect(onSeek).toHaveBeenCalledWith(9)
	})

	it('disables seeking while the duration is unknown', () => {
		render(<Transport {...base} duration={0} />)
		expect(screen.getByRole('slider', { name: 'Seek' })).toBeDisabled()
		expect(screen.getByText('0:04 / 0:00')).toBeInTheDocument()
	})
})
