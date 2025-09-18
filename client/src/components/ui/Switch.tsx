import { useCallback, useEffect, type ChangeEvent } from "react";
import Field from "./Field";
import { IconNotification } from "../icons/IconNotification";
import { IconNotNotification } from "../icons/IconNotNotification";
import type { ProfileUpdateType } from "../../pages/profile/types";
// import type { ProfileUpdatedType, ProfileUpdateType } from '../../pages/profile/types';

interface SwitchProps {
	checked: boolean;
	name?: string;
	label?: string;
	onChange?: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		name: string,
	) => void;
	onSubmit?: (field: keyof ProfileUpdateType) => void;
}

const Switch = ({
	checked,
	name = "",
	label = "",
	onChange,
	onSubmit,
}: SwitchProps) => {
	function handleChange(
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) {
		if (onChange) {
			onChange(e, name);
		}
	}
	const handleSubmit = useCallback(()=>{
		if(onSubmit){
			onSubmit(name as keyof ProfileUpdateType)
		}
	},[checked])
	useEffect(()=>{
		// handleSubmit()
	},[checked])
	return (
			<button className="space-y-2 flex-1 transition-all duration-300 hover:scale-[1.01] rounded-lg shadow-primary shadow-xs hover:shadow-md" onClick={handleSubmit}>
				<label className="flex w-full cursor-pointer items-center justify-between text-accent bg-white/40 p-4 hover:bg-white/20 has-[:checked]:bg-white/30 has-[:checked]:text-primary/80">
					<div className="flex items-center space-x-5">
						<div className="flex items-center">
							<IconNotification className="md:text-2xl" />
						</div>
						<h2 className="text-xs md:text-lg">{label}</h2>
					</div>	
                    <div className="relative inline-flex items-center cursor-pointer">
                    <Field
					type="checkbox"
					name={name}
					checked={checked}
					value=""
					as="input"
                    className="h-5 w-5 checked:border-indigo-500 sr-only peer"
					onChange={handleChange}
				    />
                    <div className="group peer ring-0 bg-accent rounded-full outline-none duration-300 after:duration-300 w-24 h-12  shadow-md peer-checked:bg-primary  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-hover:after:scale-95">
                        <IconNotification className="absolute top-2 left-2 size-8 text-primary-hover stroke-2 stroke-white"/>
                        <IconNotNotification className="absolute top-2 left-14 size-8 text-white" />
                    </div>
                    </div>				
                    
				</label>	                
			</button>		
	);
};

export default Switch;
