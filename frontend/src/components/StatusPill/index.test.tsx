import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusPill } from './index'

describe('StatusPill', () => {
	it('renders its label and exposes the tone', () => {
		render(<StatusPill tone="warning">Audio paused</StatusPill>)

		expect(screen.getByText('Audio paused').closest('[data-tone]')).toHaveAttribute('data-tone', 'warning')
	})

	it('defaults to the idle tone', () => {
		render(<StatusPill>Idle</StatusPill>)

		expect(screen.getByText('Idle').closest('[data-tone]')).toHaveAttribute('data-tone', 'idle')
	})
})
