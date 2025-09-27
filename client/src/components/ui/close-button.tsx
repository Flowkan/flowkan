import clsx from "clsx";

interface CloseButtonProps {
	onClick: () => void;
	className?: string;
}

const CloseButton = ({ onClick, className }: CloseButtonProps) => {
	return (
		<button
			type="button"
			className={clsx(
				"inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset",
				className,
			)}
			onClick={onClick}
		>
			<span className="sr-only">Close menu</span>
			<svg
				className="h-4 w-4"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	);
};

export default CloseButton;
