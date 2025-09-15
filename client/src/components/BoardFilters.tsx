import { useState } from "react";
import { Form } from "react-router-dom";
import { FormFields } from "./ui/FormFields";
import { Button } from "./ui/Button";

interface FilterProps {
	searchBoard: string;
	searchMember: string;
	setSearchBoard: React.Dispatch<React.SetStateAction<string>>;
	setSearchMember: React.Dispatch<React.SetStateAction<string>>;
	className?: string;
}

export const BoardFilters = ({
	searchBoard,
	searchMember,
	setSearchBoard,
	setSearchMember,
}: FilterProps) => {
	const [showFilters, setShowFilters] = useState(false);

	return (
		<div className="mt-6">
			{/* Botón toggle */}
			<Button
				id="filters"
				onClick={() => setShowFilters(!showFilters)}
				className="jus flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				{/* Icono filtro */}
				<span className="sr-only">Filtros</span>
				{showFilters ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.5em"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M10.83 8H21V6H8.83zm5 5H18v-2h-4.17zM14 16.83V18h-4v-2h3.17l-3-3H6v-2h2.17l-3-3H3V6h.17L1.39 4.22L2.8 2.81l18.38 18.38l-1.41 1.41z"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.5rem"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"
						/>
					</svg>
				)}
			</Button>

			{showFilters && (
				<Form
					onSubmit={(e) => e.preventDefault()}
					className="animate-fadeIn mt-4 rounded-xl bg-gray-100 p-4 shadow-inner"
				>
					<h2 className="mb-4 text-center text-lg font-medium text-gray-800">
						Filtrar tableros
					</h2>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{/* Filtra por título */}

						<FormFields
							id="filterBoard"
							name="filterBoard"
							label="Nombre del tablero"
							labelClassName="mb-1 block text-sm font-medium text-gray-700"
							type="text"
							placeholder="Buscar tableros..."
							value={searchBoard}
							onChange={(e) => setSearchBoard(e.target.value)}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>

						{/* Filtra por miembro/email */}

						<FormFields
							label="Miembro o email"
							labelClassName="mb-1 block text-sm font-medium text-gray-700"
							id="filterMember"
							name="filterMember"
							type="text"
							placeholder="Filtrar por miembro o email..."
							value={searchMember}
							onChange={(e) => setSearchMember(e.target.value)}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					{/* Botones */}
					<div className="mt-4 flex justify-end gap-3">
						<Button
							onClick={() => {
								setSearchBoard("");
								setSearchMember("");
							}}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
						>
							Borrar
						</Button>
					</div>
				</Form>
			)}
		</div>
	);
};
