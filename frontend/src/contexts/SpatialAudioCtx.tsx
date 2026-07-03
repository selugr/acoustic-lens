import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { SpatialAudioConfig } from '../../../common/types'
import { buildAudioGraphSync } from '../helpers/audioEngine'

// import type { AudioGraph } from '../types'

interface SpatialAudioState {
	audioBlobUrl: string | null
	setAudioBlobUrl: (url: string | null) => void
	audioRef: React.RefObject<HTMLAudioElement | null>
	effectsConfig: SpatialAudioConfig | null
	setEffectsConfig: (config: SpatialAudioConfig) => void
	contextState: AudioContextState | null
	onApplyConfig: () => void
	onResetConfig: () => void
}

const SpatialAudioContext = createContext<SpatialAudioState | null>(null)

export const useSpatialAudio = (): SpatialAudioState => {
	const ctx = useContext(SpatialAudioContext)
	if (!ctx) throw new Error('useSpatialAudio must be used within SpatialAudioProvider')
	return ctx
}

export const SpatialAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const audioCtx = useRef(new AudioContext())
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)

	const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null)
	const [effectsConfig, setEffectsConfig] = useState<SpatialAudioConfig | null>(null)
	const [contextState, setContextState] = useState<AudioContextState | null>(audioCtx.current.state)

	useEffect(() => {
		if (!audioRef.current || sourceNodeRef.current || !audioBlobUrl) return
		sourceNodeRef.current = audioCtx.current.createMediaElementSource(audioRef.current)
		sourceNodeRef.current.connect(audioCtx.current.destination)

		const onStateChangeListener = () => setContextState(audioCtx.current.state)
		audioCtx.current.addEventListener('statechange', onStateChangeListener)

		if (audioCtx.current.state === 'suspended') {
			audioCtx.current.resume()
		}

		return () => {
			audioCtx.current.removeEventListener('statechange', onStateChangeListener)
		}
	}, [audioBlobUrl])

	const handleOnApplyConfig = useCallback(async () => {
		if (!sourceNodeRef.current || !effectsConfig) return
		sourceNodeRef.current.disconnect()
		buildAudioGraphSync({
			sourceNode: sourceNodeRef.current,
			audioCtx: audioCtx.current,
			effectsConfig,
		})
	}, [effectsConfig])

	const handleOnResetConfig = () => {
		if (!sourceNodeRef.current) return
		setEffectsConfig(null)
		sourceNodeRef.current.disconnect()
		sourceNodeRef.current.connect(audioCtx.current.destination)
	}

	const handleOnBypass = () => {
		// if (!sourceNodeRef.current) return
		// setEffectsConfig(null)
		// sourceNodeRef.current.disconnect()
		// sourceNodeRef.current.connect(audioCtx.current.destination)
	}

	return (
		<SpatialAudioContext.Provider
			value={{
				audioRef,
				audioBlobUrl,
				setAudioBlobUrl,
				effectsConfig,
				setEffectsConfig,
				contextState,
				onApplyConfig: handleOnApplyConfig,
				onResetConfig: handleOnResetConfig,
			}}
		>
			{children}
		</SpatialAudioContext.Provider>
	)
}
