import { useState, useEffect, useRef, type RefObject } from "react";

type UseToggleOutsideReturn<Dismiss extends HTMLElement> = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	ref: RefObject<Dismiss | null>;
};

/**
 * Hook genérico para toggles, cierra al hacer click fuera o pulsar Esc
 * Ignora clics dentro de otros modales marcados con data-modal
 */
export function useDismiss<Dismiss extends HTMLElement = HTMLElement>(
	initialOpen = false,
): UseToggleOutsideReturn<Dismiss> {
	const [open, setOpen] = useState<boolean>(initialOpen);
	const ref = useRef<Dismiss | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;

			// si el click ocurre dentro de otro modal, no cerrar
			if (target.closest("[data-modal]")) {
				return;
			}

			if (ref.current && !ref.current.contains(target)) {
				setOpen(false);
			}
		};

		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEsc);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEsc);
		};
	}, []);

	return { open, setOpen, ref };
}
