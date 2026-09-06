import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Tab, TabGroup, TabPanel, TabPanels } from './index'

function TabsExample() {
	const [activeTab, setActiveTab] = useState<'generate' | 'upload'>('generate')

	return (
		<TabGroup>
			<Tab isActive={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>
				Generate
			</Tab>
			<Tab isActive={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
				Upload
			</Tab>
			<TabPanels>
				<TabPanel isActive={activeTab === 'generate'}>Generate panel</TabPanel>
				<TabPanel isActive={activeTab === 'upload'}>Upload panel</TabPanel>
			</TabPanels>
		</TabGroup>
	)
}

describe('Tabs', () => {
	it('marks only the active tab as selected', () => {
		render(<TabsExample />)

		expect(screen.getByRole('tab', { name: 'Generate' })).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tab', { name: 'Upload' })).toHaveAttribute('aria-selected', 'false')
	})

	it('switches the active tab on click', async () => {
		render(<TabsExample />)

		await userEvent.click(screen.getByRole('tab', { name: 'Upload' }))

		expect(screen.getByRole('tab', { name: 'Upload' })).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tab', { name: 'Generate' })).toHaveAttribute('aria-selected', 'false')
	})
})
