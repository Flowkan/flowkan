interface CloseButtonProps {
	onClick: () => void;
}

const CloseButton = ({ onClick }: CloseButtonProps) => {
	return (
		<button
			type="button"
			className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset"
			onClick={onClick}
		>
			<span className="sr-only">Close menu</span>
			<svg
				className="h-6 w-6"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	);
};

export default CloseButton;
