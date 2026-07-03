import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'

export const EffectsEditorContainer: React.FC = () => {
	const { effectsConfig, setEffectsConfig, applyConfig, resetConfig } = useSpatialAudio()

	const config = effectsConfig ? JSON.stringify(effectsConfig) : ''
	const isValid = !!config

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<span style={{ color: '#ccc', fontSize: 14, fontWeight: 600 }}>Configuración de efectos (JSON)</span>
				<div style={{ display: 'flex', gap: 8 }}>
					<button
						type="button"
						onClick={resetConfig}
						style={{
							padding: '4px 12px',
							fontSize: 12,
							background: '#333',
							color: '#ccc',
							border: '1px solid #555',
							borderRadius: 4,
							cursor: 'pointer',
						}}
					>
						Reset
					</button>
					<button
						type="button"
						onClick={applyConfig}
						disabled={!isValid}
						style={{
							padding: '4px 12px',
							fontSize: 12,
							background: isValid ? '#2e7d32' : '#444',
							color: isValid ? '#fff' : '#888',
							border: 'none',
							borderRadius: 4,
							cursor: isValid ? 'pointer' : 'not-allowed',
						}}
					>
						Aplicar efectos
					</button>
				</div>
			</div>

			<textarea
				value={config}
				onChange={(e) => setEffectsConfig(JSON.parse(e.target.value))}
				spellCheck={false}
				style={{
					width: '100%',
					minHeight: 400,
					fontFamily: 'monospace',
					fontSize: 13,
					lineHeight: 1.5,
					background: '#0d1117',
					color: isValid ? '#7ee787' : '#f85149',
					border: `1px solid ${isValid ? '#238636' : '#da3633'}`,
					borderRadius: 6,
					padding: 16,
					resize: 'vertical',
					tabSize: 2,
				}}
			/>

			{!isValid && (
				<div style={{ color: '#f85149', fontSize: 12 }}>
					⚠ JSON inválido o falta alguna sección requerida (spatial_config, acoustic_space, audio_processing)
				</div>
			)}

			{effectsConfig && (
				<div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
					<span>📍 Distancia: {effectsConfig.spatial_config.distance_meters}m</span>
					<span>🏛️ Espacio: {effectsConfig.acoustic_space.space_type}</span>
					<span>🔊 Dry/Wet: {effectsConfig.audio_processing.dry_wet_mix}</span>
				</div>
			)}
		</div>
	)
}
