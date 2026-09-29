import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DropZone } from './index'

const audio = new File(['a'], 'take.wav', { type: 'audio/wav' })
const pdf = new File(['p'], 'notes.pdf', { type: 'application/pdf' })

const dropOn = (el: HTMLElement, file: File) => fireEvent.drop(el, { dataTransfer: { files: [file] } })

describe('DropZone', () => {
	it('renders the idle prompt with a keyboard-reachable browse label bound to a hidden file input', () => {
		render(<DropZone inputId="audio-input" onFile={() => {}} />)

		expect(screen.getByText('Drop an audio file here')).toBeInTheDocument()
		const input = screen.getByLabelText('browse your files')
		expect(input).toHaveAttribute('type', 'file')
		expect(input).toHaveAttribute('accept', 'audio/*')
		expect(input).toHaveAttribute('id', 'audio-input')
	})

	it('shows "Release to load" while a file is dragged over, and resets on leave', () => {
		render(<DropZone inputId="audio-input" onFile={() => {}} />)
		const zone = screen.getByTestId('dropzone')

		fireEvent.dragEnter(zone)
		expect(screen.getByText('Release to load')).toBeInTheDocument()

		fireEvent.dragLeave(zone)
		expect(screen.queryByText('Release to load')).not.toBeInTheDocument()
		expect(screen.getByText('Drop an audio file here')).toBeInTheDocument()
	})

	it('calls onFile for a dropped audio file', () => {
		const onFile = vi.fn()
		render(<DropZone inputId="audio-input" onFile={onFile} />)

		dropOn(screen.getByTestId('dropzone'), audio)

		expect(onFile).toHaveBeenCalledWith(audio)
	})

	it('rejects a dropped non-audio file with a message and does not call onFile', () => {
		const onFile = vi.fn()
		render(<DropZone inputId="audio-input" onFile={onFile} />)

		dropOn(screen.getByTestId('dropzone'), pdf)

		expect(onFile).not.toHaveBeenCalled()
		expect(screen.getByText('That’s not an audio file')).toBeInTheDocument()
		expect(screen.getByText('notes.pdf — try MP3, WAV or M4A')).toBeInTheDocument()
	})

	it('validates files chosen through the input too, and clears the rejection on a valid file', () => {
		const onFile = vi.fn()
		render(<DropZone inputId="audio-input" onFile={onFile} />)
		const input = screen.getByLabelText('browse your files')

		fireEvent.change(input, { target: { files: [pdf] } })
		expect(screen.getByText('That’s not an audio file')).toBeInTheDocument()

		fireEvent.change(input, { target: { files: [audio] } })
		expect(onFile).toHaveBeenCalledWith(audio)
		expect(screen.queryByText('That’s not an audio file')).not.toBeInTheDocument()
	})

	it('stays in drag-over while moving across children (enter/leave depth counter)', () => {
		render(<DropZone inputId="audio-input" onFile={() => {}} />)
		const zone = screen.getByTestId('dropzone')
		const child = screen.getByLabelText('browse your files')

		fireEvent.dragEnter(zone)
		fireEvent.dragEnter(child)
		fireEvent.dragLeave(zone)
		expect(screen.getByText('Release to load')).toBeInTheDocument()

		fireEvent.dragLeave(child)
		expect(screen.queryByText('Release to load')).not.toBeInTheDocument()
	})

	it('resets the depth counter on drop so the next drag starts clean', () => {
		render(<DropZone inputId="audio-input" onFile={() => {}} />)
		const zone = screen.getByTestId('dropzone')

		fireEvent.dragEnter(zone)
		fireEvent.dragEnter(zone)
		dropOn(zone, audio)
		fireEvent.dragEnter(zone)
		fireEvent.dragLeave(zone)

		expect(screen.queryByText('Release to load')).not.toBeInTheDocument()
	})

	it('drag-over takes precedence over the rejected state', () => {
		render(<DropZone inputId="audio-input" onFile={() => {}} />)
		const zone = screen.getByTestId('dropzone')
		dropOn(zone, pdf)
		expect(screen.getByText('That’s not an audio file')).toBeInTheDocument()

		fireEvent.dragEnter(zone)

		expect(screen.getByText('Release to load')).toBeInTheDocument()
		expect(screen.queryByText('That’s not an audio file')).not.toBeInTheDocument()
	})

	it.each([
		'mp3',
		'wav',
		'm4a',
		'aac',
		'ogg',
		'oga',
		'flac',
		'webm',
		'opus',
		'aiff',
	])('accepts a .%s file with an empty MIME type', (ext) => {
		const onFile = vi.fn()
		render(<DropZone inputId="audio-input" onFile={onFile} />)
		const file = new File(['a'], `take.${ext.toUpperCase()}`, { type: '' })

		dropOn(screen.getByTestId('dropzone'), file)

		expect(onFile).toHaveBeenCalledWith(file)
	})

	it('still rejects an empty-MIME file with an unknown extension', () => {
		const onFile = vi.fn()
		render(<DropZone inputId="audio-input" onFile={onFile} />)

		dropOn(screen.getByTestId('dropzone'), new File(['x'], 'notes.txt', { type: '' }))

		expect(onFile).not.toHaveBeenCalled()
	})
})
