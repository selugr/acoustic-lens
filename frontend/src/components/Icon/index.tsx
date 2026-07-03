import iconMap from './helpers/iconMap'

interface IconProps {
	name: keyof typeof iconMap
	size?: number
	color?: string
	className?: string
}

export function Icon({ name, color = 'currentColor' }: IconProps) {
	const svg = iconMap[name]
	if (!svg) return null

	return (
		<span
			style={{ color, display: 'flex' }}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Only loads internal and known assets
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	)
}
