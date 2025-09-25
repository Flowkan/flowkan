import { type FC } from "react";
import { toast, type Toast } from "react-hot-toast";

// Definimos los tipos de mensaje que aceptará nuestro componente
type ToastType = "success" | "error";

interface CustomToastProps {
	message: string;
	t: Toast;
	type: ToastType; // <-- Nueva propiedad
}

export const CustomToast: FC<CustomToastProps> = ({ message, t, type }) => {
	// Objeto para manejar los estilos según el tipo de mensaje
	const iconClasses = {
		success: "text-green-500",
		error: "text-red-500",
	};

	// SVG para el icono de éxito
	const successIcon = (
		<svg
			className={`h-6 w-6 ${iconClasses.success}`}
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				clipRule="evenodd"
			/>
		</svg>
	);

	// SVG para el icono de error (el que ya tenías)
	const errorIcon = (
		<svg
			className={`h-6 w-6 ${iconClasses.error}`}
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
				clipRule="evenodd"
			/>
		</svg>
	);

	return (
		<div
			className="bg-background-card text-text-body border-border-light flex items-center rounded-lg p-4 shadow-lg"
			style={{
				transform: `translateY(${t.visible ? "0" : "100%"})`,
				transition: "transform 0.3s ease-out",
				pointerEvents: "auto",
			}}
		>
			<div className="flex-shrink-0">
				{type === "success" ? successIcon : errorIcon}
			</div>
			<div className="ml-3 flex-1">
				<p className="text-sm font-medium">{message}</p>
			</div>
			<button
				onClick={() => toast.dismiss(t.id)}
				className="ml-4 flex-shrink-0"
			>
				<span className="sr-only">Cerrar</span>
				<svg
					className="h-5 w-5 text-gray-400 hover:text-gray-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	);
};
