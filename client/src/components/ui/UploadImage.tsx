import { useRef, useState, type ChangeEvent, type JSX } from "react";
import { Button } from "./Button";
import { FormFields } from "./FormFields";
import { IconCamera } from "../../icons/IconCamera";
import { IconPlus } from "../../icons/IconPlus";

interface UploadImageProps {
    previewUrl?:string;
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void;
	icon?:JSX.Element;
}

const UploadImage = ({previewUrl,onChange,icon}:UploadImageProps) => {    
    const fileRef = useRef<HTMLInputElement>(null);
    const [newImage, setNewImage] = useState(previewUrl ?? '');
    function handleChange(e:ChangeEvent<HTMLInputElement>){
        const file = fileRef.current?.files?.[0];
        if(file){
            setNewImage(URL.createObjectURL(file));
            onChange(e);
        }

    }
	return (
        <>        
		<div className="relative w-fit">
			{newImage ? (
				<img
					src={newImage}
					alt="preview"
					className="size-40 rounded-full border border-gray-300 object-cover shadow-md"
				/>
			) : (
				<div
					onClick={() => fileRef.current?.click()}
					className="flex size-40 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-200 transition hover:bg-gray-300"
				>
					<IconCamera className="size-20 text-gray-400" />
				</div>
			)}

			{newImage && (
				<Button
					type="button"
					onClick={() => fileRef.current?.click()}
					className="bg-primary size-10 flex justify-center items-center hover:bg-primary-dark absolute right-2 bottom-0 rounded-full p-2 text-white shadow transition"
				>
					{icon ? icon : (
						<IconPlus />
					)}
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
        </>
	);
};

export default UploadImage;
