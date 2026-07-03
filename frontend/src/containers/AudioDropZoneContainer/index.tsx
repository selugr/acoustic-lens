// import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { Icon } from '../../components/Icon'
import { Label } from '../../components/Label'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import styles from './styles.module.css'

export const AudioDropZoneContainer: React.FC = () => {
	const { setAudioBlobUrl, audioBlobUrl } = useSpatialAudio()

	const audioDropBlobUrl = useRef<string>(null)

	const handleFile = (file: File) => {
		console.log('FILE', file)
		if (!file.type.startsWith('audio/')) return
		const url = URL.createObjectURL(file)
		setAudioBlobUrl(url)
		audioDropBlobUrl.current = url
	}

	const handleOnDrop = (e: React.DragEvent) => {
		e.preventDefault()
		const file = e.dataTransfer.files[0]
		if (file) handleFile(file)
	}

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) handleFile(file)
	}

	const isAudioDrop = audioBlobUrl && audioDropBlobUrl.current === audioBlobUrl

	return (
		<button
			type="button"
			onDrop={handleOnDrop}
			onDragOver={(e) => {
				e.preventDefault()
				e.stopPropagation()
			}}
			className={styles.dropArea}
			style={{
				backgroundColor: audioBlobUrl ? 'var(--accent-active)' : 'var(--accent-muted)',
			}}
		>
			<input
				key={audioBlobUrl}
				id="audio-input"
				type="file"
				className={styles.dropAreaInput}
				accept="audio/*"
				onChange={handleOnChange}
			/>
			<Label htmlFor="audio-input" className={styles.dropAreaLabel}>
				{isAudioDrop ? (
					<>
						<Icon name="check" />
						<span>Audio loaded. Drag another or click to replace</span>
					</>
				) : (
					'Drag an audio file or click to browse'
				)}
			</Label>
		</button>
	)
}
