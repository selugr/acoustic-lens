import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildAudioGraphSync, setGraphBypass } from '../helpers/audioEngine'
import { SpatialAudioProvider, useSpatialAudio } from './SpatialAudioCtx'

vi.mock('../helpers/audioEngine', () => ({ buildAudioGraphSync: vi.fn(), setGraphBypass: vi.fn() }))

const graph = { id: 'graph' }
const resume = vi.fn()
let state = 'running'

function Probe() {
	const c = useSpatialAudio()
	return (
		<>
			{c.audioBlobUrl && <audio ref={c.audioRef} src={c.audioBlobUrl} />}
			<output data-testid="bypassed">{String(c.isBypassed)}</output>
			<button type="button" onClick={() => c.setAudioBlobUrl('blob:x')}>
				load
			</button>
			<button type="button" onClick={() => c.applyEffectsConfig({} as never)}>
				apply
			</button>
			<button type="button" onClick={() => c.setBypassed(true)}>
				bypass
			</button>
			<button type="button" onClick={() => c.setBypassed(false)}>
				unbypass
			</button>
			<button type="button" onClick={c.onResetConfig}>
				reset
			</button>
			<button type="button" onClick={() => void c.resumeAudio()}>
				resume
			</button>
		</>
	)
}

const setup = async () => {
	render(
		<SpatialAudioProvider>
			<Probe />
		</SpatialAudioProvider>,
	)
	await userEvent.click(screen.getByRole('button', { name: 'load' }))
}
const click = (name: string) => userEvent.click(screen.getByRole('button', { name }))

describe('SpatialAudioProvider bypass', () => {
	beforeEach(() => {
		vi.mocked(buildAudioGraphSync)
			.mockReset()
			.mockReturnValue(graph as never)
		vi.mocked(setGraphBypass).mockReset()
		resume.mockReset()
		state = 'running'
		vi.stubGlobal(
			'AudioContext',
			class {
				destination = {}
				get state() {
					return state
				}
				resume = resume
				addEventListener() {}
				removeEventListener() {}
				createMediaElementSource() {
					return { connect: vi.fn(), disconnect: vi.fn() }
				}
			},
		)
		URL.revokeObjectURL = vi.fn()
	})

	it('routes the applied graph to dry and back without rebuilding it', async () => {
		await setup()
		await click('apply')

		await click('bypass')
		expect(setGraphBypass).toHaveBeenLastCalledWith(graph, true)
		expect(screen.getByTestId('bypassed')).toHaveTextContent('true')

		await click('unbypass')
		expect(setGraphBypass).toHaveBeenLastCalledWith(graph, false)
		expect(screen.getByTestId('bypassed')).toHaveTextContent('false')
		expect(buildAudioGraphSync).toHaveBeenCalledTimes(1)
	})

	it('ignores bypass when no profile is applied', async () => {
		await setup()
		await click('bypass')
		expect(setGraphBypass).not.toHaveBeenCalled()
		expect(screen.getByTestId('bypassed')).toHaveTextContent('false')
	})

	it('applying a profile or resetting returns to the space side', async () => {
		await setup()
		await click('apply')
		await click('bypass')
		await click('apply')
		expect(screen.getByTestId('bypassed')).toHaveTextContent('false')

		await click('bypass')
		await click('reset')
		expect(screen.getByTestId('bypassed')).toHaveTextContent('false')
	})

	it('resumeAudio resumes a suspended context only', async () => {
		await setup()
		await click('resume')
		expect(resume).not.toHaveBeenCalled()

		state = 'suspended'
		await act(async () => click('resume'))
		expect(resume).toHaveBeenCalledTimes(1)
	})
})
