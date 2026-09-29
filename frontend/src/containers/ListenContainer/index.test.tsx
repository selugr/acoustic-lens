import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ListenContainer } from './index'

const config = {
	spatial_config: { distance_meters: 3.2, azimuth_degrees: -60, elevation_degrees: 0, panner_model: 'HRTF' },
	acoustic_space: {
		space_type: 'concert_hall',
		reverb_time_rt60: 2.4,
		early_reflections_delay_ms: 38,
		room_size_category: 'large',
		surface_material: 'wood',
		impulse_response_type: 'synthetic',
	},
	audio_processing: {
		dry_wet_mix: 0.35,
		high_frequency_damping: 0.4,
		low_cut_frequency_hz: 120,
		high_cut_frequency_hz: 9500,
		occlusion_factor: 0.1,
		compression_threshold_db: -18,
		compression_ratio: 3,
	},
}
const ctx = { effectsConfig: null as unknown, isEffectApplied: false }
vi.mock('../../contexts/SpatialAudioCtx', () => ({ useSpatialAudio: () => ctx }))
vi.mock('../AudioPlayerContainer', () => ({ AudioPlayerContainer: () => <div>transport</div> }))

const EMPTY = 'Add a source, then describe a room. You’ll see where the voice sits here.'

describe('ListenContainer', () => {
	beforeEach(() => {
		ctx.effectsConfig = null
		ctx.isEffectApplied = false
	})

	it('shows the "No space yet" empty state and still renders the transport', () => {
		render(<ListenContainer />)
		expect(screen.getByText('No space yet')).toBeInTheDocument()
		expect(screen.getByText(EMPTY)).toBeInTheDocument()
		expect(screen.getByText('transport')).toBeInTheDocument()
		expect(screen.queryByRole('img')).not.toBeInTheDocument()
	})

	it('renders diagram, summary, meters and raw profile once a profile is applied', () => {
		ctx.effectsConfig = config
		ctx.isEffectApplied = true
		render(<ListenContainer />)

		expect(screen.queryByText('No space yet')).not.toBeInTheDocument()
		expect(screen.getByRole('img', { name: /3.2 meters away, 60 degrees to the left/ })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: 'Concert hall' })).toBeInTheDocument()
		expect(screen.getByText('9.5 kHz')).toBeInTheDocument()
		expect(screen.getByText('Raw profile (JSON)')).toBeInTheDocument()
	})
})
