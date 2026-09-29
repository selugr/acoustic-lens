import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RawProfile } from './index'

const setClipboard = (writeText: (t: string) => Promise<void>) =>
	Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

describe('RawProfile', () => {
	beforeEach(() => vi.useFakeTimers())
	afterEach(() => vi.useRealTimers())

	it('renders the JSON under the "Raw profile (JSON)" summary', () => {
		render(<RawProfile json='{"a": 1}' />)
		expect(screen.getByText('Raw profile (JSON)')).toBeInTheDocument()
		expect(screen.getByText('{"a": 1}')).toBeInTheDocument()
	})

	it('copies to the clipboard, shows "Copied", then reverts after ~2s', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined)
		setClipboard(writeText)
		render(<RawProfile json="{}" />)

		await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy' })))

		expect(writeText).toHaveBeenCalledWith('{}')
		expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(2000))
		expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
	})

	it('shows "Copy failed" when the clipboard rejects', async () => {
		setClipboard(vi.fn().mockRejectedValue(new Error('denied')))
		render(<RawProfile json="{}" />)

		await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy' })))

		expect(screen.getByRole('button', { name: 'Copy failed' })).toBeInTheDocument()
	})

	it('does not update state or leave a timer after unmount while the copy is pending', async () => {
		let resolve: () => void = () => {}
		setClipboard(vi.fn(() => new Promise<void>((r) => (resolve = r))))
		const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
		const { unmount } = render(<RawProfile json="{}" />)
		fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

		unmount()
		await act(async () => resolve())

		expect(vi.getTimerCount()).toBe(0)
		expect(errors).not.toHaveBeenCalled()
	})
})
