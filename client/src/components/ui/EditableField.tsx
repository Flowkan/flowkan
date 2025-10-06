import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type HTMLAttributes,
	type HTMLInputTypeAttribute,
} from "react";
import { IconEdit } from "../icons/IconEdit";
import { IconSave } from "../icons/IconSave";
import type { ProfileUpdateType } from "../../pages/profile/types";
import { IconCancel } from "../icons/IconCancel";
import clsx from "clsx";

const formatDate = (dateString: string) => {
	if (!dateString) return "";
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	} catch (e) {
		console.log(e);
		return dateString;
	}
};

const Button = ({
	children,
	onClick,
	className = "",
	...rest
}: HTMLAttributes<HTMLButtonElement> & { onClick?: () => void }) => (
	<button
		onClick={onClick}
		className={`transition duration-200 ease-in-out ${className}`}
		{...rest}
	>
		{children}
	</button>
);

interface FieldComponentProps {
	as?: "input" | "textarea";
	type?: HTMLInputTypeAttribute;
	name: keyof ProfileUpdateType;
	value: string;
	onChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		name: string,
	) => void;
	className: string;
	rows?: number;
	[key: string]: unknown;
}

const Field = ({
	as: Component = "input",
	type,
	name,
	value,
	onChange,
	className,
	rows = 1,
	...rest
}: FieldComponentProps) => {
	const isTextArea = Component === "textarea";

	const handleLocalChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		onChange(e, name);
	};

	const commonProps = {
		name,
		value,
		onChange: handleLocalChange,
		className: `w-full bg-white transition-all duration-300 outline-none ${className}`,
		...rest,
	};

	if (isTextArea) {
		return <textarea {...commonProps} rows={rows} />;
	}

	return <input type={type} {...commonProps} />;
};

interface EditableFieldProps {
	label: string;
	value: string;
	classNameValue: HTMLAttributes<HTMLParagraphElement>["className"];
	name: keyof ProfileUpdateType;
	type?: HTMLInputTypeAttribute;
	as?: "input" | "textarea";
	className?: string;
	rows?: number;
	error?: boolean;
	errors?:string[];
	readonly?: boolean;
	onEdit: (field: keyof ProfileUpdateType) => void;
	onChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		name: string,
	) => void;
}

const EditableField = ({
	label,
	value,
	classNameValue,
	className = "",
	error = false,
	errors=[],
	readonly = false,
	rows = 0,
	type = "text",
	as = "input",
	name,
	onEdit,
	onChange,
}: EditableFieldProps) => {
	const [enableEdit, setEnableEdit] = useState(false);
	const [errorsLocal,setErrorsLocal] = useState<string[]>(errors);
	const initialValue = useRef("");
	const [localValue,setLocalValue] = useState(value);
	function handleEdit() {
		setEnableEdit(!enableEdit);
	}
	useEffect(()=>{
		if(enableEdit){
			initialValue.current = value
		}
	},[enableEdit])
	useEffect(()=>{
		setLocalValue(value)
	},[value])
	useEffect(()=>{
		if(errors.length > 0){
			setErrorsLocal(errors)
		}
	},[errors])
	
	function handleSaveEdit() {
		onEdit(name);
		setEnableEdit(false);
	}
	function handleCancelEdit() {
		setEnableEdit(false);
		setErrorsLocal([])
		setLocalValue(initialValue.current)
	}
	
	function handleToValue() {
		if (type === "date") {
			return formatDate(value);
		}
		if (name === "username") {			
			return localValue ? `@${localValue}` : "...";
		}
		if (name === "bio") {
			return localValue ? `"${localValue}"` : "...";
		}

		return localValue || "...";
	}

	return (
		<div className="group relative">
			<p className="text-accent/70 w-fit text-sm font-semibold tracking-wide uppercase">
				{label}
			</p>
			<div className="relative flex">
				{!enableEdit && errorsLocal.length === 0 ? (
					<>
						<p
							className={`flex-1 py-1 ${classNameValue} ${readonly ? "cursor-not-allowed" : ""}`}
						>
							{handleToValue() || "..."}
						</p>
						{!readonly && (
							<Button
								onClick={handleEdit}
								className="text-primary hover:text-primary-hover absolute top-[50%] right-0 flex -translate-y-[50%] items-center justify-center p-1 transition duration-300 ease-in-out md:hidden group-hover:md:flex"
								aria-label={`Editar ${label}`}
							>
								<IconEdit className="size-5" />
							</Button>
						)}
					</>
				) : (
					<div className={clsx(
						"ring-accent hover:shadow-accent flex flex-1 rounded-lg transition-all duration-300 hover:shadow-md hover:ring",
						error ? "ring-red-500 hover:shadow-red-500" : ""
					)}>
						<Field
							type={type}
							name={name}
							value={value}
							as={as}
							rows={rows}
							onChange={onChange}
							className={`${className} px-2 py-1 rounded-l-lg border-accent text-accent focus:outline-accent text-lg font-semibold tracking-wider ${error ? "border-red-600" : ""}`}
						/>
						<Button
							onClick={handleSaveEdit}
							className={clsx(
								"bg-primary hover:bg-primary-hover px-2 cursor-pointer transition-colors duration-300",
								name === "name" ? "px-4" : "",
								name == "bio" ? "px-6" :""
							)}
							aria-label={`Guardar ${label}`}
						>
							<IconSave className={clsx(
								"text-white size-3",
								name === "bio" ? "size-5" : ""
							)}/>
						</Button>
						<Button
							onClick={handleCancelEdit}
							className={clsx(
								"bg-accent hover:bg-accent-hover rounded-r-lg px-2 cursor-pointer transition-colors duration-300",
								name === "name" ? "px-4" : "",
								name == "bio" ? "px-6" :""
							)}
							aria-label={`Guardar ${label}`}
						>
							<IconCancel className={clsx(
								"text-white size-3",
								name === "bio" ? "size-5" : ""
							)}/>
						</Button>
					</div>
				)}
			</div>
			<ul className="text-xs text-red-500 pt-1">
				{ errorsLocal.map(err=>(
					<li>{err}</li>
				)) }
			</ul>	
		</div>
	);
};

export default EditableField;
