import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/socket/context";
import { randomColor } from "../../lib/randomColor";

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

	const socket = useSocket();

	const [loading, setLoading] = useState(false);
	const [thumbCurrent, setThumbCurrent] = useState<string | null>(null);
	const cleanThumb = `${photo}_${format}.webp`;

	useEffect(() => {
		socket.on("user:thumbnailLoading", (data) => {
			const type = data.originalPath.split("/").at(-2)
			if(type === "users"){
				setLoading(true);
				setThumbCurrent(null);
			}
		});
		socket.on("user:thumbnailCompleted", (data) => {
			const type = data.originalPath.split("/").at(-2)
			if(type === "users"){
				setLoading(false);
				const thumbName = data.thumbPath.split("/").at(-1);
				setThumbCurrent(thumbName!);
			};
		});
		return () => {
			socket.off("user:thumbnailLoading");
			socket.off("user:thumbnailCompleted");
		};
	}, [socket]);

	if (loading) {
		return (
			<>
				<div 
				style={{
						width: size,
						height: size,
					}}
				className="relative z-40 flex aspect-square animate-[spin_3s_linear_infinite] items-center justify-center rounded-full bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:absolute before:z-[80] before:aspect-square before:w-[60%] before:animate-[spin_2s_linear_infinite] before:rounded-full before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:z-[60] after:aspect-square after:w-3/4 after:animate-[spin_3s_linear_infinite] after:rounded-full after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
					<span className="absolute z-[60] aspect-square w-[85%] animate-[spin_5s_linear_infinite] rounded-full bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
				</div>
			</>
		);
	}

	if (photo) {
		const baseUrl = import.meta.env.VITE_BASE_URL;
		return (
			<div className="rounded-full p-1 border-1 border-white" style={{ width: size, height: size }}>
				<img
					src={`${baseUrl}/uploads/users/${thumbCurrent ? thumbCurrent : cleanThumb}`}
					alt={name}
					loading="lazy"
					title={name}
					className={`${className} rounded-full size-full object-cover`}
					// style={{
					// 	width: size,
					// 	height: size,
					// }}
				/>
			</div>
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
