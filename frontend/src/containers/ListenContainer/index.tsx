import { ParameterMeters } from '../../components/ParameterMeters'
import { RawProfile } from '../../components/RawProfile'
import { SceneDiagram } from '../../components/SceneDiagram'
import { SpaceSummary } from '../../components/SpaceSummary'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import { AudioPlayerContainer } from '../AudioPlayerContainer'
import styles from './styles.module.css'

export function ListenContainer() {
	const { effectsConfig, isEffectApplied } = useSpatialAudio()

	return (
		<div className={styles.listen}>
			{effectsConfig && isEffectApplied ? (
				<>
					<SceneDiagram
						azimuthDeg={effectsConfig.spatial_config.azimuth_degrees}
						elevationDeg={effectsConfig.spatial_config.elevation_degrees}
						distanceM={effectsConfig.spatial_config.distance_meters}
						pannerModel={effectsConfig.spatial_config.panner_model}
					/>
					<SpaceSummary space={effectsConfig.acoustic_space} distanceM={effectsConfig.spatial_config.distance_meters} />
					<ParameterMeters processing={effectsConfig.audio_processing} />
					<RawProfile json={JSON.stringify(effectsConfig, null, 2)} />
				</>
			) : (
				<div className={styles.empty}>
					<p className={styles.emptyTitle}>No space yet</p>
					<p className={styles.emptyText}>Add a source, then describe a room. You’ll see where the voice sits here.</p>
				</div>
			)}
			<AudioPlayerContainer />
		</div>
	)
}
