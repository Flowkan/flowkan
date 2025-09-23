interface AvatarProps {
	name: string;
	photo?: string | null;
	size?: number;
	format?: string;
	className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
	name,
	photo,
	size = 40,
	format = "t",
	className,
}) => {
	const randomColor = (user: string): string => {
		let r = 0,
			g = 0,
			b = 0;
		let i = 0;

		for (const char of user) {
			const code = char.charCodeAt(0);
			r = (r + code * (i + 1)) % 256;
			g = (g + code * (i + 2)) % 256;
			b = (b + code * (i + 3)) % 256;
			i += 1;
		}
		return `rgb(${r}, ${g}, ${b})`;
	};

	const getInitialsName = (name: string) => {
		const fullname = name.trim().split(/\s+/);
		if (fullname.length === 0) return "";
		if (fullname.length === 1) return fullname[0].substring(0, 2).toUpperCase();
		return fullname
			.slice(0, 2)
			.map((n) => n[0].toUpperCase())
			.join("");
	};

	const bgColor = randomColor(name);
	const initialsName = getInitialsName(name);

	if (photo) {
		const baseUrl = import.meta.env.VITE_BASE_URL;
		return (
			<img
				src={`${baseUrl}/uploads/users/${photo}_${format}.webp`}
				alt={name}
				className={`${className} rounded-full object-cover`}
				style={{
					width: size,
					height: size,
				}}
			/>
		);
	}
	return (
		<div
			className={`${className} flex items-center justify-center rounded-full font-bold text-white select-none`}
			title={name}
			style={{
				width: size,
				height: size,
				fontSize: size * 0.4,
				backgroundColor: bgColor,
			}}
		>
			{initialsName}
		</div>
	);
};
