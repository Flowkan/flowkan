export const randomColor = (name: string, isGradient = false): string => {
	let r = 0;
	let g = 0;
	let b = 0;
	let i = 0;

	for (const char of name) {
		const code = char.charCodeAt(0);
		r = (r + code * (i + 1)) % 256;
		g = (g + code * (i + 2)) % 256;
		b = (b + code * (i + 3)) % 256;
		i += 1;
	}

	if (isGradient) {
		const r2 = (r + 50) % 256;
		const g2 = (g + 30) % 256;
		const b2 = (b + 60) % 256;

		return `linear-gradient(45deg, rgb(${r}, ${g}, ${b}), rgb(${r2}, ${g2}, ${b2}))`;
	}

	return `rgb(${r}, ${g}, ${b})`;
};
