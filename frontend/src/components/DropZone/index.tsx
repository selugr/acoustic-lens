import { useRef, useState } from 'react'
import { Icon } from '../Icon'
import styles from './styles.module.css'

interface DropZoneProps {
	/** Id of the hidden file input (lets the outside world open the picker) */
	inputId: string
	/** Called with a validated audio file */
	onFile: (file: File) => void
}

const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'm4a', 'aac', 'ogg', 'oga', 'flac', 'webm', 'opus', 'aiff'])

/** Some platforms report an empty MIME type, so fall back to the extension. */
const isAudio = (file: File) => {
	if (file.type) return file.type.startsWith('audio/')
	return AUDIO_EXTENSIONS.has(file.name.split('.').pop()?.toLowerCase() ?? '')
}

export function DropZone({ inputId, onFile }: DropZoneProps) {
	const [dragOver, setDragOver] = useState(false)
	// dragenter/dragleave also fire for child elements; count depth to avoid flicker
	const dragDepth = useRef(0)
	const [rejectedName, setRejectedName] = useState<string | null>(null)

	const accept = (file: File) => {
		if (!isAudio(file)) {
			setRejectedName(file.name)
			return
		}
		setRejectedName(null)
		onFile(file)
	}

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault()
		dragDepth.current += 1
		setDragOver(true)
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
	}

	const handleDragLeave = () => {
		dragDepth.current = Math.max(0, dragDepth.current - 1)
		if (dragDepth.current === 0) setDragOver(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		dragDepth.current = 0
		setDragOver(false)
		const file = e.dataTransfer.files[0]
		if (file) accept(file)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) accept(file)
		// Allow choosing the same file again
		e.target.value = ''
	}

	const state = dragOver ? 'dragOver' : rejectedName ? 'rejected' : 'idle'

	return (
		<div
			data-testid="dropzone"
			className={`${styles.zone} ${styles[state]}`}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<input id={inputId} type="file" accept="audio/*" className={styles.input} onChange={handleChange} />
			{state === 'dragOver' ? (
				<span className={`${styles.title} ${styles.titleAccent}`}>Release to load</span>
			) : (
				<>
					{state === 'idle' && <Icon name="upload" size={24} className={styles.icon} />}
					<span className={`${styles.title} ${state === 'rejected' ? styles.titleDanger : ''}`} aria-live="polite">
						{state === 'rejected' ? 'That’s not an audio file' : 'Drop an audio file here'}
					</span>
					<span className={styles.sub}>
						{state === 'rejected' ? (
							<>
								<span>{rejectedName} — try MP3, WAV or M4A</span>{' '}
								<label htmlFor={inputId} className={styles.browse}>
									Browse files
								</label>
							</>
						) : (
							<>
								or{' '}
								<label htmlFor={inputId} className={styles.browse}>
									browse your files
								</label>{' '}
								· any audio format
							</>
						)}
					</span>
				</>
			)}
		</div>
	)
}
