import { useRef, useState, type ChangeEvent, type JSX } from "react";
import { Button } from "./Button";
import { FormFields } from "./FormFields";
import { IconCamera } from "../icons/IconCamera";
import { IconPlus } from "../icons/IconPlus";
import { IconSave } from "../icons/IconSave";
import { IconCancel } from "../icons/IconCancel";
// import type { C } from "vitest/dist/chunks/environment.d.cL3nLXbE.js";

interface UploadImageProps {
	previewUrl?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	// onChange: (file:File) => void;
	icon?: JSX.Element;
}

const UploadImage = ({ previewUrl, onChange, icon }: UploadImageProps) => {
	const fileRef = useRef<HTMLInputElement>(null);
	const [newImage, setNewImage] = useState(previewUrl ?? "");
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const file = fileRef.current?.files?.[0];
		if (file) {
			setNewImage(URL.createObjectURL(file));
			onChange(e);
		}
	}
	function handleCancel(){
		setNewImage(previewUrl ?? "");
		const e = {
			target:{value: "", name: "photo", files: null},
			currentTarget:{value: "", name: "photo", files: null},			
		} as ChangeEvent<HTMLInputElement>;
		onChange(e)
		// console.log(e);
		
	}
	return (
		<>
			<div className="group relative w-fit">
				{newImage ? (
					<img
						src={newImage}
						alt="Foto de perfil"
						className="size-40 rounded-full border border-gray-300 object-cover shadow-md transition-transform group-hover:scale-105"
					/>
				) : (
					<div
						onClick={() => fileRef.current?.click()}
						className="flex size-40 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-200 transition hover:bg-gray-300"
						aria-label="Subir imagen"
					>
						<IconCamera className="size-20 text-gray-400" />
					</div>
				)}

				{newImage && (
					<Button
						type="button"
						onClick={() => fileRef.current?.click()}
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
				{newImage !== previewUrl && (
					<>
						<Button
							type="button"
							className="flex items-center gap-3 rounded-md bg-sky-500 p-2 text-white hover:bg-sky-600"
						>
							<IconSave />
							{/* <span>Actualizar Foto</span> */}
						</Button>
						<Button
							onClick={handleCancel}
							type="button"
							className="flex items-center gap-3 rounded-md bg-red-400 p-2 text-white hover:bg-red-500"
						>
							<IconCancel />
							{/* <span>Actualizar Foto</span> */}
						</Button>
					</>
				)}
			</div>
		</>
	);
};

export default UploadImage;
