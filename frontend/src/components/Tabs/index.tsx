import { Activity, useId, useRef } from 'react'
import styles from './styles.module.css'

const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`
const panelId = (prefix: string, id: string) => `${prefix}-tabpanel-${id}`

export interface TabItem {
	id: string
	label: string
	/** Optional leading icon element */
	icon?: React.ReactNode
}

interface TabsProps {
	/** Accessible name of the tablist */
	label: string
	items: TabItem[]
	/** Id of the selected tab */
	value: string
	onChange: (id: string) => void
	/** Per-instance id prefix (e.g. from `useId()`); pass the same one to each TabPanel. Defaults to an internal one. */
	idPrefix?: string
	className?: string
}

export function Tabs({ label, items, value, onChange, idPrefix, className = '' }: TabsProps) {
	const autoPrefix = useId()
	const prefix = idPrefix ?? autoPrefix
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

	const select = (id: string) => {
		onChange(id)
		tabRefs.current[id]?.focus()
	}

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		const last = items.length - 1
		const targets: Record<string, number> = {
			ArrowRight: index === last ? 0 : index + 1,
			ArrowLeft: index === 0 ? last : index - 1,
			Home: 0,
			End: last,
		}
		const target = targets[e.key]
		if (target === undefined) return
		e.preventDefault()
		select(items[target].id)
	}

	return (
		<div
			role="tablist"
			aria-label={label}
			className={`${styles.tabGroup} ${className}`}
			style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
		>
			{items.map((item, index) => {
				const isActive = item.id === value
				return (
					<button
						key={item.id}
						ref={(el) => {
							tabRefs.current[item.id] = el
						}}
						type="button"
						role="tab"
						id={tabId(prefix, item.id)}
						aria-selected={isActive}
						aria-controls={panelId(prefix, item.id)}
						tabIndex={isActive ? 0 : -1}
						className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
						onClick={() => select(item.id)}
						onKeyDown={(e) => handleKeyDown(e, index)}
					>
						{item.icon && <span className={styles.tabIcon}>{item.icon}</span>}
						<span>{item.label}</span>
					</button>
				)
			})}
		</div>
	)
}

interface TabPanelProps {
	/** Id of the tab this panel belongs to */
	id: string
	/** Same `idPrefix` given to the owning Tabs */
	idPrefix: string
	isActive: boolean
	children: React.ReactNode
}

export function TabPanel({ id, idPrefix, isActive, children }: TabPanelProps) {
	return (
		<Activity mode={isActive ? 'visible' : 'hidden'}>
			<div role="tabpanel" id={panelId(idPrefix, id)} aria-labelledby={tabId(idPrefix, id)} className={styles.tabPanel}>
				{children}
			</div>
		</Activity>
	)
}
