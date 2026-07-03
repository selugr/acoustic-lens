import styles from './styles.module.css'

export function Textarea({ className = '', rows = 4, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <textarea rows={rows} className={`${styles.textarea} ${className}`} {...props} />
}
