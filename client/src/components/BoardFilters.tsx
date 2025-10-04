import { Form } from "react-router-dom";
import { FormFields } from "./ui/FormFields";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import { useDismiss } from "../hooks/useDismissClickAndEsc";
import { Icon } from "@iconify/react";
import "../pages/boards/boards-list.css";

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
	const { t } = useTranslation();
	const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
	const toggleFilter = () => setOpen((prev) => !prev);

	return (
		<div ref={ref}>
			{/* Botón toggle */}
			<Button
				id="filters"
				title={t("backoffice.btn.title", "Filtros")}
				aria-label={t("backoffice.btn.title", "Filtros")}
				onClick={toggleFilter}
				className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				{/* Icono filtro */}
				<span className="sr-only">
					{t("backoffice.filters.icon", "Filtros")}
				</span>
				{open ? (
					<Icon
						icon="material-symbols:filter-list-off"
						width="24"
						height="24"
						style={{ color: "#fff" }}
					/>
				) : (
					<Icon
						icon="material-symbols:filter-list"
						width="24"
						height="24"
						style={{ color: "#fff" }}
					/>
				)}
			</Button>

			{open && (
				<Form
					onSubmit={(e) => e.preventDefault()}
					className="filters-form animate-slide mx-auto mt-4 w-full max-w-5/6 rounded-xl bg-gray-100 p-2 shadow-inner"
				>
					<h2 className="mb-4 pt-4 text-center text-lg font-medium text-gray-800">
						{t("backoffice.filtersForm.title", "Filtrar tableros")}
					</h2>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{/* Filtra por título */}
						<FormFields
							id="filterBoard"
							name="filterBoard"
							label={t(
								"backoffice.filtersForm.filterBoardLabel",
								"Nombre del tablero",
							)}
							labelClassName="mb-1 block text-sm font-medium text-gray-700"
							placeholder={t(
								"backoffice.filtersForm.filterBoardPlaceholder",
								"Buscar tableros",
							)}
							value={searchBoard}
							onChange={(e) => setSearchBoard(e.target.value)}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>

						{/* Filtra por miembro/email */}
						<FormFields
							label={t(
								"backoffice.filtersForm.filterMemberLabel",
								"Miembro o email",
							)}
							labelClassName="mb-1 block text-sm font-medium text-gray-700"
							id="filterMember"
							name="filterMember"
							placeholder={t(
								"backoffice.filtersForm.filterMemberPlaceholder",
								"Filtrar por miembro o email",
							)}
							value={searchMember}
							onChange={(e) => setSearchMember(e.target.value)}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<div className="mt-4 flex justify-end gap-3">
						<Button
							onClick={() => {
								setSearchBoard("");
								setSearchMember("");
							}}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-emerald-100"
						>
							{t("backoffice.filtersForm.clearFilters", "Borrar")}
						</Button>
					</div>
				</Form>
			)}
		</div>
	);
};
