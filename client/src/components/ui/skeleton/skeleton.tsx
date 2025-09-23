import { SpinnerLoadingText } from "../Spinner";

interface SkeletonCustomProps {
  rows?: number;
  columns?: number;
  rowHeight?: string;
  columnWidth?: string;
  gap?: string;
  className?: string;
  animate?: boolean;
  rounded?: string;
  spinnerText?: string;
}

export const SkeletonCustom = ({
  rows = 1,
  columns = 1,
  rowHeight = "h-10",
  columnWidth = "w-full",
  gap = "gap-4",
  className = "",
  animate = true,
  rounded = "rounded-md",
  spinnerText = "Cargando",
}: SkeletonCustomProps) => {
  // Calcular cantidad de bloques a renderizar y generar un array
  const totalBlocks = rows * columns;
	const skeletonItems = Array.from({length: totalBlocks}, (_, index) => index)

  // Clases comunes
  const animationClass = animate ? "animate-pulse" : "";
  const blockClass = `bg-gray-300 ${rowHeight} ${columnWidth} ${rounded}`;
  const layoutClass =
    columns > 1 ? `grid grid-cols-${columns} ${gap}` : `flex flex-col ${gap}`;

  return (
    <div
      className={`bg-background-card w-full max-w-md space-y-8 rounded-xl p-10 shadow-2xl
        ${layoutClass} ${animationClass} ${className}`}
    >
			<SpinnerLoadingText
				text={spinnerText}
				className={`mb-6 ${columns > 1 ? "col-span-full" : ""}`}
			/>
			
      {/* Skeleton blocks */}
      {skeletonItems.map((index) => (
        <div key={index} className={blockClass} />
      ))}

    </div>
  );
};