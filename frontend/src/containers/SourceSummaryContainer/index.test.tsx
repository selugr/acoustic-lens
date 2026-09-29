import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDuration } from '../../helpers/formatters'
import { AUDIO_INPUT_ID, VOICE_TEXT_ID } from '../sourceIds'
import { SourceSummaryContainer } from './index'

let ctx: { audioBlobUrl: string | null; audioLabel: string | null } = { audioBlobUrl: null, audioLabel: null }
vi.mock('../../contexts/SpatialAudioCtx', () => ({ useSpatialAudio: () => ctx }))

class FakeAudio extends EventTarget {
	static last: FakeAudio
	duration = Number.NaN
	preload = ''
	src = ''
	constructor() {
		super()
		FakeAudio.last = this
	}
	removeAttribute() {}
	loaded(duration: number) {
		this.duration = duration
		this.dispatchEvent(new Event('loadedmetadata'))
	}
}

describe('formatDuration', () => {
	it.each([
		[0, '0:00'],
		[5, '0:05'],
		[65, '1:05'],
		[59.6, '1:00'],
		[600, '10:00'],
	])('%s s -> %s', (seconds, expected) => {
		expect(formatDuration(seconds)).toBe(expected)
	})
})

describe('SourceSummaryContainer', () => {
	beforeEach(() => {
		ctx = { audioBlobUrl: 'blob:x', audioLabel: null }
		vi.stubGlobal('Audio', FakeAudio)
	})
	afterEach(() => {
		vi.unstubAllGlobals()
		document.body.innerHTML = ''
	})

	it('renders nothing without an audio URL', () => {
		ctx = { audioBlobUrl: null, audioLabel: null }
		const { container } = render(<SourceSummaryContainer activeTab="generate" />)
		expect(container).toBeEmptyDOMElement()
	})

	it('falls back to "Generated voice" and shows the label when present', () => {
		const { rerender } = render(<SourceSummaryContainer activeTab="generate" />)
		expect(screen.getByText('Generated voice')).toBeInTheDocument()

		ctx = { audioBlobUrl: 'blob:x', audioLabel: 'take.wav' }
		rerender(<SourceSummaryContainer activeTab="generate" />)
		expect(screen.getByText('take.wav')).toBeInTheDocument()
	})

	it('shows m:ss once metadata loads, and omits it while unknown or infinite', () => {
		render(<SourceSummaryContainer activeTab="generate" />)
		expect(screen.queryByText('1:05')).not.toBeInTheDocument()

		act(() => FakeAudio.last.loaded(Number.POSITIVE_INFINITY))
		expect(screen.queryByText('Infinity:NaN')).not.toBeInTheDocument()
		expect(screen.queryByText(/:/)).not.toBeInTheDocument()

		act(() => FakeAudio.last.loaded(65))
		expect(screen.getByText('1:05')).toBeInTheDocument()
	})

	it('Replace focuses the textarea when the Generate tab is active', async () => {
		document.body.insertAdjacentHTML('beforeend', `<textarea id="${VOICE_TEXT_ID}"></textarea>`)
		render(<SourceSummaryContainer activeTab="generate" />)

		await userEvent.click(screen.getByRole('button', { name: /replace/i }))

		expect(document.getElementById(VOICE_TEXT_ID)).toHaveFocus()
	})

	it('Replace opens the file picker when the Upload tab is active', async () => {
		document.body.insertAdjacentHTML('beforeend', `<input id="${AUDIO_INPUT_ID}" type="file" />`)
		const click = vi.fn()
		document.getElementById(AUDIO_INPUT_ID)?.addEventListener('click', click)
		render(<SourceSummaryContainer activeTab="upload" />)

		await userEvent.click(screen.getByRole('button', { name: /replace/i }))

		expect(click).toHaveBeenCalledTimes(1)
	})
})
