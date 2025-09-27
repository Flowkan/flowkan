import { useEffect, useRef } from "react";

export function useLastPointer() {
	const ref = useRef<{ x: number; y: number } | null>(null);
	useEffect(() => {
		const h = (e: PointerEvent) => {
			ref.current = { x: e.clientX, y: e.clientY };
		};
		document.addEventListener("pointermove", h);
		document.addEventListener("pointerdown", h);
		return () => {
			document.removeEventListener("pointermove", h);
			document.removeEventListener("pointerdown", h);
		};
	}, []);
	return ref;
}
