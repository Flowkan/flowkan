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
	onEdit: (field:keyof ProfileUpdateType) => void;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,name: string,) => void;
}

const EditableField = ({
	label,
	value,	
	classNameValue,
	className="",
	error=false,
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
		// if(error)return;
		setEnableEdit(false);
	}
	// useEffect(()=>{
	// 	if(error){
	// 		setEnableEdit(true);
	// 	}
	// },[error])
	// console.log(error,name);
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
			<p className="text-sm font-semibold text-gray-500 uppercase">{label}</p>
			<div className="relative flex">
				{!enableEdit && !error ? (
					<>
						<p className={`flex-1 ${classNameValue}`}>
							{handleToValue() || '...'}
						</p>
						<Button
							onClick={handleEdit}
							className="absolute top-1 right-0 hidden items-center justify-center text-gray-500 transition group-hover:flex hover:text-gray-700"
							aria-label={`Editar ${label}`}
						>
							<IconEdit className="size-5" />
						</Button>
					</>
				) : (
					<>
						{/* {field} */}
						<Field 
						type={type}
						name={name}
						value={value}
						as={as}
						rows={rows}
						onChange={onChange}
						className={`${className} ${error ? 'border border-red-600' : ''}`}
						// className="flex-1 rounded-l-lg border px-3 py-1"
						/>
						<Button
							onClick={handleSaveEdit}
							className="bg-primary hover:bg-primary-hover rounded-r-lg px-4"
							aria-label={`Editar ${label}`}
						>
							<IconSave className="text-white" />
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default EditableField;
