import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeaderContainer } from './index'

const useSpatialAudio = vi.fn()
vi.mock('../../contexts/SpatialAudioCtx', () => ({
	useSpatialAudio: () => useSpatialAudio(),
}))

describe('HeaderContainer', () => {
	beforeEach(() => {
		useSpatialAudio.mockReset()
	})

	it('shows the brand', () => {
		useSpatialAudio.mockReturnValue({ contextState: null })
		render(<HeaderContainer />)

		expect(screen.getByText('Acoustic Lens')).toBeInTheDocument()
		expect(screen.getByText('Workstation')).toBeInTheDocument()
	})

	it.each([
		['running', 'Audio engine ready', 'ready'],
		['suspended', 'Audio paused — press play', 'warning'],
		['closed', 'Audio engine idle', 'idle'],
		[null, 'Audio engine idle', 'idle'],
	])('maps AudioContext state %s to "%s"', (contextState, label, tone) => {
		useSpatialAudio.mockReturnValue({ contextState })
		render(<HeaderContainer />)

		expect(screen.getByText(label).closest('[data-tone]')).toHaveAttribute('data-tone', tone)
	})
})
