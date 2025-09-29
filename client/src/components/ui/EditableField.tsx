import {
	useState,
	type ChangeEvent,
	type HTMLAttributes,
	type HTMLInputTypeAttribute,
} from "react";
import { IconEdit } from "../icons/IconEdit";
import { IconSave } from "../icons/IconSave";
import type { ProfileUpdateType } from "../../pages/profile/types";

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
	readonly = false,
	rows = 0,
	type = "text",
	as = "input",
	name,
	onEdit,
	onChange,
}: EditableFieldProps) => {
	const [enableEdit, setEnableEdit] = useState(false);

	function handleEdit() {
		setEnableEdit(!enableEdit);
	}

	function handleSaveEdit() {
		onEdit(name);
		setEnableEdit(false);
	}

	function handleToValue() {
		if (type === "date") {
			return formatDate(value);
		}
		if (name === "username") {
			return value ? `@${value}` : "...";
		}
		if (name === "bio") {
			return value ? `"${value}"` : "...";
		}

		return value;
	}

	return (
		<div className="group relative">
			<p className="text-accent/70 w-fit text-sm font-semibold tracking-wide uppercase">
				{label}
			</p>
			<div className="relative flex">
				{!enableEdit && !error ? (
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
					<div className="ring-accent hover:shadow-accent flex flex-1 rounded-lg transition-all duration-300 hover:shadow-md hover:ring">
						<Field
							type={type}
							name={name}
							value={value}
							as={as}
							rows={rows}
							onChange={onChange}
							className={`${className} border-accent text-accent focus:outline-accent text-lg font-semibold tracking-wider ${error ? "border-red-600" : ""}`}
						/>
						<Button
							onClick={handleSaveEdit}
							className="bg-primary hover:bg-primary-hover rounded-r-lg px-4"
							aria-label={`Guardar ${label}`}
						>
							<IconSave className="text-white" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default EditableField;
