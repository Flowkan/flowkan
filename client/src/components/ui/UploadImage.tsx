import { useRef, useState, type ChangeEvent, type JSX } from "react";
import { Button } from "./Button";
import { FormFields } from "./FormFields";
import { IconCamera } from "../icons/IconCamera";
import { IconPlus } from "../icons/IconPlus";
import { IconSave } from "../icons/IconSave";
import { IconCancel } from "../icons/IconCancel";
import type { ProfileUpdateType } from "../../pages/profile/types";

interface UploadImageProps {
	previewUrl: string;
	onChange: (e: ChangeEvent<HTMLInputElement>, name: string) => void;
	error?: boolean;
	name: string;
	icon?: JSX.Element;
	onSubmit?: (field: keyof ProfileUpdateType) => void;
	value?: string | File;
}

const UploadImage = ({
	previewUrl,
	onChange,
	icon,
	name,
	onSubmit,
	error = false,
}: UploadImageProps) => {
	const fileRef = useRef<HTMLInputElement>(null);
	const [newImage, setNewImage] = useState(previewUrl);
	const [onEdit, setOnEdit] = useState(false);
	const oldImage = useRef(previewUrl);
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const file = fileRef.current?.files?.[0];
		if (file) {
			setNewImage(URL.createObjectURL(file));
			onChange(e, name);

			setOnEdit(true);
		}
	}

	function handleCancel() {
		setOnEdit(false);

		const e = {
			target: { value: "", name, files: null, type: "file" },
			currentTarget: { value: "", name, files: null, type: "file" },
		} as ChangeEvent<HTMLInputElement>;
		onChange(e, name);
		setNewImage(oldImage.current);
		fileRef.current!.value = "";
	}
	function handleSubmit() {
		if (onSubmit) {
			onSubmit(name as keyof ProfileUpdateType);
			setOnEdit(false);
		}
	}

	function handleSelectImage() {
		fileRef.current?.click();
	}

	return (
		<>
			<div className="group relative w-fit">
				{newImage ? (
					<img
						src={newImage}
						alt="Foto de perfil"
						className={`shadow-primary size-40 rounded-full border border-gray-300 object-cover shadow-[3px_0px_8px] transition-transform group-hover:scale-105 ${error ? "border-2 border-red-400" : ""}`}
					/>
				) : (
					<button
						onClick={handleSelectImage}
						className={`bg-primary/30 hover:bg-primary-hover/30 hover:border-primary shadow-primary flex size-40 cursor-pointer items-center justify-center rounded-full border border-gray-50 shadow-[5px_1px_10px] transition md:shadow-[5px_5px_15px] ${error ? "border-4 border-red-400" : ""}`}
						aria-label="Subir imagen"
					>
						<IconCamera className="group-hover:text-primary size-20 text-white transition-colors duration-300 ease-in" />
					</button>
				)}

				{newImage && (
					<Button
						type="button"
						onClick={handleSelectImage}
						className="bg-primary hover:bg-primary-dark absolute right-2 bottom-0 flex size-10 items-center justify-center rounded-full p-2 text-white shadow transition"
						aria-label="Editar imagen"
					>
						{icon || <IconPlus />}
					</Button>
				)}
			</div>
			<FormFields
				id="photo"
				name="photo"
				type="file"
				accept="image/*"
				className="hidden"
				ref={fileRef}
				onChange={handleChange}
			/>
			<div className="flex justify-center gap-2">
				{onEdit && (
					<>
						<Button
							type="button"
							onClick={handleSubmit}
							className="bg-accent hover:bg-accent-hover flex items-center gap-3 rounded-md p-2 text-white"
						>
							<IconSave />
						</Button>
						<Button
							onClick={handleCancel}
							type="button"
							className="flex items-center gap-3 rounded-md bg-red-400 p-2 text-white hover:bg-red-500"
						>
							<IconCancel />
						</Button>
					</>
				)}
			</div>
		</>
	);
};

export default UploadImage;
