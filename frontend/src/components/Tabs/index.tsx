import { Activity } from 'react'
import styles from './styles.module.css'

interface TabGroupProps {
	/** Tab buttons as children */
	children: React.ReactNode
	/** Optional additional CSS class */
	className?: string
}

export function TabGroup({ children, className = '' }: TabGroupProps) {
	return (
		<div className={`${styles.tabGroup} ${className}`} role="tablist">
			{children}
		</div>
	)
}

interface TabProps {
	/** Whether this tab is currently active */
	isActive: boolean
	/** Click handler to switch tabs */
	onClick: () => void
	/** Optional leading icon element */
	icon?: React.ReactNode
	/** Tab label text */
	children: React.ReactNode
	/** Spreadable button attributes */
	[key: string]: unknown
}

export function Tab({ isActive, onClick, icon, children, ...props }: TabProps) {
	return (
		<button
			role="tab"
			aria-selected={isActive}
			className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
			onClick={onClick}
			{...props}
		>
			{icon && <span className={styles.tabIcon}>{icon}</span>}
			<span className={styles.tabText}>{children}</span>
		</button>
	)
}

interface TabPanelsProps {
	/** TabPanel children */
	children: React.ReactNode
}

export function TabPanels({ children }: TabPanelsProps) {
	return <div className={styles.tabPanels}>{children}</div>
}

interface TabPanelProps {
	/** Whether this panel is visible */
	isActive: boolean
	/** Panel content */
	children: React.ReactNode
	/** Spreadable div attributes */
	[key: string]: unknown
}
export function TabPanel({ isActive, children, ...props }: TabPanelProps) {
	return (
		<Activity mode={isActive ? 'visible' : 'hidden'}>
			<div role="tabpanel" className={`${styles.tabPanel} ${isActive ? styles.tabPanelActive : ''}`} {...props}>
				{children}
			</div>
		</Activity>
	)
}
