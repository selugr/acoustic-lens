import { Header } from './components/Header'
import { Icon } from './components/Icon'
import { SpatialAudioProvider } from './contexts/SpatialAudioCtx'
import MainLayout from './layouts/main'

export default function App() {
	return (
		<SpatialAudioProvider>
			<Header logo={<Icon name="soundwave" />} title="ACUSTIC LENS" subtitle="workstation" />
			<main>
				<MainLayout />
			</main>
		</SpatialAudioProvider>
	)
}
