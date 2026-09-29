import { HeaderContainer } from './containers/HeaderContainer'
import { SpatialAudioProvider } from './contexts/SpatialAudioCtx'
import MainLayout from './layouts/main'

export default function App() {
	return (
		<SpatialAudioProvider>
			<HeaderContainer />
			<main>
				<MainLayout />
			</main>
		</SpatialAudioProvider>
	)
}
