import styles from './styles.module.css'

interface PreProps {
	children: React.ReactNode
}

export default function Pre({ children }: PreProps) {
	return <pre className={styles.pre}>{children}</pre>
}
