import { Header } from '../../components/Header'
import { StatusPill } from '../../components/StatusPill'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'

const STATUS: Record<string, { tone: 'ready' | 'warning' | 'idle'; label: string }> = {
	running: { tone: 'ready', label: 'Audio engine ready' },
	suspended: { tone: 'warning', label: 'Audio paused — press play' },
}
const IDLE = { tone: 'idle', label: 'Audio engine idle' } as const

export const HeaderContainer: React.FC = () => {
	const { contextState } = useSpatialAudio()
	const { tone, label } = (contextState && STATUS[contextState]) || IDLE

	return <Header title="Acoustic Lens" subtitle="Workstation" status={<StatusPill tone={tone}>{label}</StatusPill>} />
}
