import { Form } from "react-router-dom";
import { FormFields } from "./ui/FormFields";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import { useDismiss } from "../hooks/useDismissClickAndEsc";
import { Icon } from "@iconify/react";
import { useAppSelector, type RootState } from "../store";
import { getAllMembers } from "../store/boards/selectors";
import { Avatar } from "./ui/Avatar";
import { useState, useRef, useEffect } from "react";
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
	
	const members = useAppSelector((state: RootState) => getAllMembers(state));

	const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Cerrar dropdown al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setMemberDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelectMember = (name: string) => {
		setSearchMember(name);
		setMemberDropdownOpen(false);
	};

	return (
		<div ref={ref}>
			{/* Botón toggle */}
			<Button
				id="filters"
				title={t("backoffice.btn.title")}
				aria-label={t("backoffice.btn.title")}
				onClick={toggleFilter}
				className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				{/* Icono filtro */}
				<span className="sr-only">{t("backoffice.filters.icon")}</span>
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
						{t("backoffice.filtersForm.title")}
					</h2>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{/* Filtra por título */}
						<FormFields
							id="filterBoard"
							name="filterBoard"
							label={t("backoffice.filtersForm.filterBoardLabel")}
							labelClassName="mb-1 block text-sm font-medium text-gray-700"
							placeholder={t("backoffice.filtersForm.filterBoardPlaceholder")}
							value={searchBoard}
							onChange={(e) => setSearchBoard(e.target.value)}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>

						{/* Filtra por miembro */}
						<div className="relative flex flex-col" ref={dropdownRef}>
							<label className="mb-2 block text-sm font-medium text-gray-700">
								{t("backoffice.filtersForm.filterMemberLabel")}
							</label>

							<button
								type="button"
								onClick={() => setMemberDropdownOpen((prev) => !prev)}
								className="bg-opacity-40 mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								{searchMember ? (
									<div className="flex items-center gap-2">
										<Avatar name={searchMember} size={18} />
										<span>{searchMember}</span>
									</div>
								) : (
									<span className="text-gray-500">
										{t("backoffice.filtersForm.filterMemberPlaceholder")}
									</span>
								)}
								<Icon
									icon={
										memberDropdownOpen
											? "material-symbols:arrow-drop-up"
											: "material-symbols:arrow-drop-down"
									}
									width={20}
									height={20}
								/>
							</button>

							{memberDropdownOpen && (
								<div className="tex-sm absolute top-6 right-20 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-xl">
									{members.map((member) => (
										<div
											key={member.name}
											onClick={() => handleSelectMember(member.name)}
											className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
										>
											<Avatar
												name={member.name}
												photo={member.photo}
												size={30}
											/>
											<span className="text-sm">{member.name}</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div className="mt-4 flex justify-end gap-3">
						<Button
							onClick={() => {
								setSearchBoard("");
								setSearchMember("");
							}}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-emerald-100"
						>
							{t("backoffice.filtersForm.clearFilters")}
						</Button>
					</div>
				</Form>
			)}
		</div>
	);
};
