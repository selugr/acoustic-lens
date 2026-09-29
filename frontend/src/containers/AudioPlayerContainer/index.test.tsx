import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act, createRef } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AudioPlayerContainer } from './index'

const audioRef = createRef<HTMLAudioElement>()
const ctx = {
	audioRef,
	audioBlobUrl: 'blob:x' as string | null,
	contextState: 'running' as string | null,
	isEffectApplied: true,
	isBypassed: false,
	setBypassed: vi.fn(),
	resumeAudio: vi.fn(),
}
vi.mock('../../contexts/SpatialAudioCtx', () => ({ useSpatialAudio: () => ctx }))

let paused = true
const audio = () => audioRef.current as HTMLAudioElement

describe('AudioPlayerContainer', () => {
	beforeEach(() => {
		Object.assign(ctx, {
			audioBlobUrl: 'blob:x',
			contextState: 'running',
			isEffectApplied: true,
			isBypassed: false,
		})
		ctx.setBypassed.mockReset()
		ctx.resumeAudio.mockReset()
		paused = true
		vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(() => paused)
		vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(async () => {
			paused = false
		})
		vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {
			paused = true
		})
	})

	it('renders nothing without a source', () => {
		ctx.audioBlobUrl = null
		const { container } = render(<AudioPlayerContainer />)
		expect(container).toBeEmptyDOMElement()
	})

	it('keeps a hidden audio element (no native controls) and the custom transport', () => {
		render(<AudioPlayerContainer />)
		expect(audio()).not.toHaveAttribute('controls')
		expect(audio()).toHaveAttribute('src', 'blob:x')
		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
	})

	it('toggles play/pause, following the element events', async () => {
		render(<AudioPlayerContainer />)

		await userEvent.click(screen.getByRole('button', { name: 'Play' }))
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
		act(() => {
			audio().dispatchEvent(new Event('play'))
		})

		await userEvent.click(screen.getByRole('button', { name: 'Pause' }))
		expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1)
		act(() => {
			audio().dispatchEvent(new Event('pause'))
		})
		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
	})

	it('shows Play and plays on the first click after the source changes while playing', async () => {
		const { rerender } = render(<AudioPlayerContainer />)
		await userEvent.click(screen.getByRole('button', { name: 'Play' }))
		act(() => {
			audio().dispatchEvent(new Event('play'))
		})
		expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()

		// Loading a new source resets the element to paused without emitting 'pause'
		paused = true
		ctx.audioBlobUrl = 'blob:y'
		rerender(<AudioPlayerContainer />)

		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
		vi.mocked(HTMLMediaElement.prototype.play).mockClear()
		await userEvent.click(screen.getByRole('button', { name: 'Play' }))
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
	})

	it('resets to Play on the element "emptied" event', async () => {
		render(<AudioPlayerContainer />)
		await userEvent.click(screen.getByRole('button', { name: 'Play' }))
		act(() => {
			audio().dispatchEvent(new Event('play'))
		})

		paused = true
		act(() => {
			audio().dispatchEvent(new Event('emptied'))
		})

		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
	})

	it('resumes a suspended context before playing', async () => {
		ctx.contextState = 'suspended'
		render(<AudioPlayerContainer />)

		await userEvent.click(screen.getByRole('button', { name: 'Play' }))

		expect(ctx.resumeAudio).toHaveBeenCalledTimes(1)
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
	})

	it('shows the time from the element and seeks by setting currentTime', () => {
		render(<AudioPlayerContainer />)
		Object.defineProperty(audio(), 'duration', { value: 12, configurable: true })
		act(() => {
			audio().dispatchEvent(new Event('loadedmetadata'))
		})
		expect(screen.getByText('0:00 / 0:12')).toBeInTheDocument()

		fireEvent.change(screen.getByRole('slider', { name: 'Seek' }), { target: { value: '9' } })
		expect(audio().currentTime).toBe(9)

		act(() => {
			audio().dispatchEvent(new Event('timeupdate'))
		})
		expect(screen.getByText('0:09 / 0:12')).toBeInTheDocument()
	})

	it('shows the suspended hint only while the context is suspended', () => {
		const { unmount } = render(<AudioPlayerContainer />)
		expect(
			screen.queryByText('Audio is paused by the browser. Press play to start the engine.'),
		).not.toBeInTheDocument()
		unmount()

		ctx.contextState = 'suspended'
		render(<AudioPlayerContainer />)
		expect(screen.getByText('Audio is paused by the browser. Press play to start the engine.')).toBeInTheDocument()
	})

	it('A/B: choosing Dry bypasses; disabled without a profile', async () => {
		const { unmount } = render(<AudioPlayerContainer />)
		await userEvent.click(screen.getByRole('button', { name: 'A · Dry' }))
		expect(ctx.setBypassed).toHaveBeenCalledWith(true)
		unmount()

		ctx.isEffectApplied = false
		render(<AudioPlayerContainer />)
		expect(screen.getByRole('button', { name: 'A · Dry' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'B · Space' })).toHaveAttribute('aria-pressed', 'true')
	})
})
