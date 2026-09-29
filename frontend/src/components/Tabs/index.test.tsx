import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useId, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { TabPanel, Tabs } from './index'

const items = [
	{ id: 'generate', label: 'Generate voice' },
	{ id: 'upload', label: 'Upload audio' },
	{ id: 'record', label: 'Record' },
]

function TabsExample() {
	const [value, setValue] = useState('generate')
	const idPrefix = useId()

	return (
		<>
			<Tabs label="Source type" items={items} value={value} onChange={setValue} idPrefix={idPrefix} />
			{items.map((item) => (
				<TabPanel key={item.id} id={item.id} idPrefix={idPrefix} isActive={value === item.id}>
					{item.label} panel
				</TabPanel>
			))}
		</>
	)
}

describe('Tabs', () => {
	it('exposes a labelled tablist and marks only the active tab as selected', () => {
		render(<TabsExample />)

		expect(screen.getByRole('tablist', { name: 'Source type' })).toBeInTheDocument()
		expect(screen.getByRole('tab', { name: 'Generate voice' })).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tab', { name: 'Upload audio' })).toHaveAttribute('aria-selected', 'false')
	})

	it('links each tab to its panel with aria-controls and aria-labelledby', () => {
		render(<TabsExample />)

		const tab = screen.getByRole('tab', { name: 'Generate voice' })
		const panel = screen.getByRole('tabpanel')
		expect(tab).toHaveAttribute('aria-controls', panel.id)
		expect(panel).toHaveAttribute('aria-labelledby', tab.id)
	})

	it('switches the active tab on click', async () => {
		render(<TabsExample />)

		await userEvent.click(screen.getByRole('tab', { name: 'Upload audio' }))

		expect(screen.getByRole('tab', { name: 'Upload audio' })).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tab', { name: 'Generate voice' })).toHaveAttribute('aria-selected', 'false')
	})

	it('uses a roving tabindex: only the selected tab is tabbable', () => {
		render(<TabsExample />)

		expect(screen.getByRole('tab', { name: 'Generate voice' })).toHaveAttribute('tabindex', '0')
		expect(screen.getByRole('tab', { name: 'Upload audio' })).toHaveAttribute('tabindex', '-1')
	})

	it('moves selection and focus with ArrowRight / ArrowLeft, wrapping around', async () => {
		render(<TabsExample />)
		screen.getByRole('tab', { name: 'Generate voice' }).focus()

		await userEvent.keyboard('{ArrowRight}')
		expect(screen.getByRole('tab', { name: 'Upload audio' })).toHaveFocus()
		expect(screen.getByRole('tab', { name: 'Upload audio' })).toHaveAttribute('aria-selected', 'true')

		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
		expect(screen.getByRole('tab', { name: 'Record' })).toHaveFocus()
		expect(screen.getByRole('tab', { name: 'Record' })).toHaveAttribute('aria-selected', 'true')
	})

	it('jumps to the first / last tab with Home / End', async () => {
		render(<TabsExample />)
		screen.getByRole('tab', { name: 'Generate voice' }).focus()

		await userEvent.keyboard('{End}')
		expect(screen.getByRole('tab', { name: 'Record' })).toHaveFocus()

		await userEvent.keyboard('{Home}')
		expect(screen.getByRole('tab', { name: 'Generate voice' })).toHaveFocus()
		expect(screen.getByRole('tab', { name: 'Generate voice' })).toHaveAttribute('aria-selected', 'true')
	})
})

describe('Tabs ids', () => {
	it('keeps ids unique across two groups that share item ids, and wires aria to the right elements', () => {
		render(
			<>
				<TabsExample />
				<TabsExample />
			</>,
		)

		const tabs = screen.getAllByRole('tab', { name: 'Generate voice' })
		const panels = screen.getAllByRole('tabpanel')
		expect(tabs).toHaveLength(2)
		expect(tabs[0].id).not.toBe(tabs[1].id)
		expect(panels[0].id).not.toBe(panels[1].id)

		tabs.forEach((tab, i) => {
			expect(document.getElementById(tab.getAttribute('aria-controls') ?? '')).toBe(panels[i])
			expect(document.getElementById(panels[i].getAttribute('aria-labelledby') ?? '')).toBe(tab)
		})
	})
})
