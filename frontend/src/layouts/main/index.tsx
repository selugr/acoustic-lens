import { useState } from 'react'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { Tab, TabGroup, TabPanel, TabPanels } from '../../components/Tabs'
import { AudioDropZoneContainer } from '../../containers/AudioDropZoneContainer'
import { AudioPlayerContainer } from '../../containers/AudioPlayerContainer'
import AudioProfileGeneratorContainer from '../../containers/AudioProfileGeneratorContainer'
import VoiceGeneratorContainer from '../../containers/VoiceGeneratorContainer'
import styles from './styles.module.css'

export default function MainLayout() {
	const [activeTab, setActiveTab] = useState('generate')

	return (
		<div className={styles.layout}>
			<Card>
				<TabGroup>
					<Tab isActive={activeTab === 'generate'} onClick={() => setActiveTab('generate')} icon={<Icon name="mic" />}>
						Generate
					</Tab>
					<Tab isActive={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<Icon name="upload" />}>
						Upload
					</Tab>
				</TabGroup>

				<TabPanels>
					<TabPanel isActive={activeTab === 'generate'}>
						<VoiceGeneratorContainer />
					</TabPanel>

					<TabPanel isActive={activeTab === 'upload'}>
						<AudioDropZoneContainer />
					</TabPanel>
				</TabPanels>
			</Card>

			<AudioProfileGeneratorContainer />

			<AudioPlayerContainer />
		</div>
	)
}
