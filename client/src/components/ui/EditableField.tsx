import { useState, type ChangeEvent, type HTMLAttributes, type HTMLInputTypeAttribute } from "react";
import { Button } from "./Button";
import { IconEdit } from "../icons/IconEdit";
import { IconSave } from "../icons/IconSave";
import Field from "./Field";
import { formatDate } from "../../utils/tools";
import type { ProfileUpdateType } from "../../pages/profile/types";

interface EditableFieldProps {
	label: string;
	value: string;
	// field: JSX.Element;
	classNameValue: HTMLAttributes<HTMLParagraphElement>["className"];
	name:keyof ProfileUpdateType;
	type?:HTMLInputTypeAttribute;
	as?: "input" | "textarea";
	className?: string;
	disabled?: boolean;
	rows?: number;
	error?:boolean;
	readonly?:boolean;
	onEdit: (field:keyof ProfileUpdateType) => void;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,name: string,) => void;
}

const EditableField = ({
	label,
	value,	
	classNameValue,
	className="",
	error=false,
	readonly=false,
	rows=0,
	type="text",
	as="input",
	name,
	onEdit,
	onChange
}: EditableFieldProps) => {
	const [enableEdit, setEnableEdit] = useState(false);
	function handleEdit() {
		setEnableEdit(!enableEdit);		
	}
	function handleSaveEdit() {
		onEdit(name);		
		setEnableEdit(false);
	}	
	function handleToValue(){
		if(type === 'date'){
			return formatDate(value)
		}
		if(name === 'username'){
			return value ? `@${value}` : '...'
		}
		if(name === 'bio'){
			return value ? `"${value}"` : "..."
		}

		return value
	}
	
	return (
		<div className="group relative">
			<p className="text-sm font-semibold text-accent/70 tracking-wide w-fit uppercase">{label}</p>
			<div className="relative flex">
				{!enableEdit && !error ? (
					<>
						<p className={`flex-1 py-1 ${classNameValue} ${readonly ? 'cursor-not-allowed' : ''}`}>
							{handleToValue() || '...'}
						</p>
						{
							!readonly && (
								<Button
									onClick={handleEdit}
									className="absolute p-1 top-[50%] -translate-y-[50%] right-0 hidden items-center justify-center text-primary transition duration-300 ease-in-out group-hover:flex hover:text-primary-hover"
									aria-label={`Editar ${label}`}
								>
									<IconEdit className="size-5" />
								</Button>
							)
						}
						
					</>
				) : (
					<>	
					<div className="flex-1 transition-all duration-300 hover:ring ring-accent hover:shadow-md hover:shadow-accent flex rounded-lg">					
						<Field 
						type={type}
						name={name}
						value={value}
						as={as}
						rows={rows}
						onChange={onChange}
						className={`${className} border-accent text-accent text-lg font-semibold tracking-wider focus:outline-accent ${error ? 'border-red-600' : ''}`}
						// className="flex-1 rounded-l-lg border px-3 py-1"
						/>
						<Button
							onClick={handleSaveEdit}
							className="bg-primary hover:bg-primary-hover rounded-r-lg px-4"
							aria-label={`Editar ${label}`}
						>
							<IconSave className="text-white" />
						</Button>
					</div>					
					</>
				)}
			</div>
		</div>
	);
};

export default EditableField;
