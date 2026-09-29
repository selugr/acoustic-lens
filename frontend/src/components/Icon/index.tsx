import iconMap from './helpers/iconMap'

export type IconName = keyof typeof iconMap

interface IconProps {
	name: IconName
	/** Icon box in px (width and height). Defaults to 16. */
	size?: number
	color?: string
	className?: string
}

export function Icon({ name, size = 16, color = 'currentColor', className }: IconProps) {
	const svg = iconMap[name]
	if (!svg) return null

	return (
		<span
			className={className}
			aria-hidden="true"
			style={{ color, display: 'inline-flex', width: size, height: size, fontSize: size, flexShrink: 0 }}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Only loads internal and known assets
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	)
}
