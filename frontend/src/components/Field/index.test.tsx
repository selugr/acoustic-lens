import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Field } from './index'

describe('Field', () => {
	it('associates the label with the textarea', () => {
		render(<Field label="Scene description" value="" onChange={() => {}} />)

		expect(screen.getByLabelText('Scene description')).toBeInstanceOf(HTMLTextAreaElement)
	})

	it('shows a value / maxLength counter', () => {
		render(<Field label="Voice" value="Hello" maxLength={50} onChange={() => {}} />)

		expect(screen.getByText('5 / 50')).toBeInTheDocument()
	})

	it('flags the counter when the value is shorter than minLength', () => {
		render(<Field label="Scene" value="Big" minLength={5} maxLength={100} onChange={() => {}} />)

		expect(screen.getByText('3 / 100')).toHaveAttribute('data-out-of-range', 'true')
	})

	it('does not flag an empty field or a valid one', () => {
		const { rerender } = render(<Field label="Scene" value="" minLength={5} maxLength={100} onChange={() => {}} />)
		expect(screen.getByText('0 / 100')).toHaveAttribute('data-out-of-range', 'false')

		rerender(<Field label="Scene" value="Big hall" minLength={5} maxLength={100} onChange={() => {}} />)
		expect(screen.getByText('8 / 100')).toHaveAttribute('data-out-of-range', 'false')
	})

	it('wires the error message with aria-invalid and aria-describedby', () => {
		render(<Field label="Scene" value="Big" error="Add a bit more detail" onChange={() => {}} />)

		const textarea = screen.getByLabelText('Scene')
		const message = screen.getByText('Add a bit more detail')
		expect(textarea).toHaveAttribute('aria-invalid', 'true')
		expect(textarea.getAttribute('aria-describedby')).toContain(message.id)
	})

	it('describes the textarea with the hint when there is no error', () => {
		render(<Field label="Scene" value="" hint="Describe the room" onChange={() => {}} />)

		const textarea = screen.getByLabelText('Scene')
		expect(textarea).not.toHaveAttribute('aria-invalid', 'true')
		expect(textarea.getAttribute('aria-describedby')).toContain(screen.getByText('Describe the room').id)
	})

	it('reports the new value through onChange', async () => {
		const onChange = vi.fn()
		render(<Field label="Voice" value="" onChange={onChange} />)

		await userEvent.type(screen.getByLabelText('Voice'), 'a')

		expect(onChange).toHaveBeenCalledWith('a')
	})
})
