import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SceneDiagram } from './index'

describe('SceneDiagram', () => {
	it('exposes an accessible description and the caption', () => {
		render(<SceneDiagram azimuthDeg={-60} elevationDeg={0} distanceM={3.2} />)

		expect(screen.getByRole('img', { name: 'Voice is 3.2 meters away, 60 degrees to the left' })).toBeInTheDocument()
		expect(screen.getByText('Az −60° · El 0° · 3.2 m · HRTF')).toBeInTheDocument()
	})

	it('labels the rings and orientation', () => {
		render(<SceneDiagram azimuthDeg={0} elevationDeg={0} distanceM={2} />)
		for (const label of ['1 m', '2 m', '4 m', 'Front', 'L', 'R']) expect(screen.getByText(label)).toBeInTheDocument()
	})

	it('rescales the rings when the source is beyond 4 m', () => {
		render(<SceneDiagram azimuthDeg={0} elevationDeg={0} distanceM={8} />)
		expect(screen.getByText('8 m')).toBeInTheDocument()
		expect(screen.getByText('2 m')).toBeInTheDocument()
	})
})
