import { ParameterMeters } from '../../components/ParameterMeters'
import { RawProfile } from '../../components/RawProfile'
import { SceneDiagram } from '../../components/SceneDiagram'
import { SpaceSummary } from '../../components/SpaceSummary'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import { toListenView } from '../../helpers/listenView'
import { AudioPlayerContainer } from '../AudioPlayerContainer'
import styles from './styles.module.css'

export function ListenContainer() {
	const { effectsConfig, isEffectApplied } = useSpatialAudio()
	const view = effectsConfig && isEffectApplied ? toListenView(effectsConfig) : null

	return (
		<div className={styles.listen}>
			{view && effectsConfig ? (
				<>
					{view.scene && <SceneDiagram {...view.scene} />}
					<SpaceSummary {...view.space} />
					<ParameterMeters rows={view.meters} />
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
