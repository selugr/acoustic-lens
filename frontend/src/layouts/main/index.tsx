import { useId, useState } from 'react'
import { Icon } from '../../components/Icon'
import { StepCard } from '../../components/StepCard'
import { TabPanel, Tabs } from '../../components/Tabs'
import { AudioDropZoneContainer } from '../../containers/AudioDropZoneContainer'
import { AudioPlayerContainer } from '../../containers/AudioPlayerContainer'
import AudioProfileGeneratorContainer from '../../containers/AudioProfileGeneratorContainer'
import { SourceSummaryContainer } from '../../containers/SourceSummaryContainer'
import VoiceGeneratorContainer from '../../containers/VoiceGeneratorContainer'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import styles from './styles.module.css'

const SOURCE_TABS = [
	{ id: 'generate', label: 'Generate voice', icon: <Icon name="mic" /> },
	{ id: 'upload', label: 'Upload audio', icon: <Icon name="upload" /> },
]

export default function MainLayout() {
	const [activeTab, setActiveTab] = useState('generate')
	const tabsId = useId()
	const { audioBlobUrl, effectsConfig } = useSpatialAudio()

	const hasSource = !!audioBlobUrl
	const hasSpace = !!effectsConfig

	return (
		<div className={styles.layout}>
			<div className={styles.column}>
				<StepCard
					step={1}
					title="Source"
					description="Synthesize a voice line, or bring your own recording."
					done={hasSource}
					active={!hasSource}
				>
					<Tabs label="Source type" items={SOURCE_TABS} value={activeTab} onChange={setActiveTab} idPrefix={tabsId} />
					<TabPanel id="generate" idPrefix={tabsId} isActive={activeTab === 'generate'}>
						<VoiceGeneratorContainer />
					</TabPanel>
					<TabPanel id="upload" idPrefix={tabsId} isActive={activeTab === 'upload'}>
						<AudioDropZoneContainer />
					</TabPanel>
					<SourceSummaryContainer activeTab={activeTab} />
				</StepCard>

				<StepCard
					step={2}
					title="Acoustic space"
					description="Describe the room and where the voice is. We turn it into a spatial profile."
					done={hasSpace}
					active={hasSource && !hasSpace}
				>
					<AudioProfileGeneratorContainer />
				</StepCard>
			</div>

			<StepCard
				step={3}
				title="Listen"
				description="Use headphones for accurate direction. Flip A/B to hear the difference."
				active={hasSource}
			>
				<AudioPlayerContainer />
			</StepCard>
		</div>
	)
}
