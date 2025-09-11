import React, { useCallback, useState, type ChangeEvent } from "react";
import UploadImage from "../../components/ui/UploadImage";
import { IconEdit } from "../../components/icons/IconEdit";
// import { Button } from "../../components/ui/Button";
// import { IconSave } from "../../components/icons/IconSave";
import EditableField from "../../components/ui/EditableField";
// import { useAppSelector } from "../../store";
// import { formatDate } from "../../utils/tools";
import { ProfileUpdateSchema, type ProfileUpdateType } from "./types";
import { useAppSelector } from "../../store/hooks";
import z from "zod";
// import { IconCancel } from "../../components/icons/IconCancel";

// type InputProps = Omit<ComponentProps<"input">, "type">;

// type TextareaProps = ComponentProps<"textarea">;

// type ChangeEventInput = {
// 	target: { value: string; name: string; files: FileList | null };
// }

// type TypeInputProps = InputProps &
// 	TextareaProps & {
// 		type: HTMLInputTypeAttribute | "textarea";
// };


// interface ProfileProps {
// 	profile: ProfileType;
// }

const Profile = () => {
	// const [enableEdit, setEnableEdit] = useState(false);
	const [photo, setPhoto] = useState<File | null>(null);
	const userData = useAppSelector((state) => state.auth.user); //useAppSelector((state)=> state.auth.user)
	const [user, setUser] = useState<ProfileUpdateType>({
		name: userData?.name ?? "",
		email: userData?.email ?? "",
		dateBirth: "",
	});
	const [errors,setErrors] = useState({
		name:{error:false,message:''},
		username:{error:false,message:''},
		email:{error:false,message:''},
		bio:{error:false,message:''},
		dateBirth:{error:false,message:''},
		location:{error:false,message:''}
	})
	
	const previewImage = userData?.photo ?? "";

	// const user = {
	// 	id: "usr_123456",
	// 	name: "Jhon Dou",
	// 	username: "jhondou",
	// 	email: "jhon@example.com",
	// 	photo: "https://randomuser.me/api/portraits/women/68.jpg",
	// 	bio: "Apasionado por el desarrollo web",
	// 	datebirth: "2000-01-01",
	// 	location: "Ciudad, País",
	// };
	const  handleChangeEdit = useCallback((field:keyof ProfileUpdateType)=>{
		console.log('click en edit...');
		
		const dataParse = ProfileUpdateSchema.safeParse(user);
		if (!dataParse.success) {
			console.log(z.flattenError(dataParse.error).fieldErrors);
			const errorsList = z.flattenError(dataParse.error).fieldErrors
			if(field in errorsList && errorsList[field]){
				const msgErrors = errorsList[field].join(', ');
				setErrors({...errors,[field]:{error:true,message:msgErrors}})
				return;
			}
		}
		// setErrors({...errors,[field]:false})
		setErrors({...errors,[field]:{error:false,message:''}})
	},[errors,user])
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setPhoto(file);
		} else {
			setPhoto(null);
		}
	}
	function handleChangeField(
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		name: string,
	) {
		const target = e.target;

		let value: unknown;

		if (target instanceof HTMLInputElement && target.type === "checkbox") {
			value = target.checked; // boolean
		} else if (target instanceof HTMLInputElement && target.type === "file") {
			value = target.files?.[0] || null; // File or null
		} else {
			value = target.value; // string
		}
		setUser((prev) => ({ ...prev, [name]: value }));
	}
	// console.log(userRedux);

	return (
		<div>
			<h2 className="my-10 text-center text-3xl font-bold text-gray-800">
				👤 Perfil de Usuario
			</h2>
			<div className="mx-auto flex flex-col gap-12 rounded-xl bg-white p-6 shadow-xl md:max-w-3xl md:p-10">
				<div className="flex gap-5 md:flex-col">
					<div className="flex flex-col gap-4 px-5 md:items-center md:gap-0">
						<UploadImage
							previewUrl={previewImage}
							onChange={handleChange}
							icon={<IconEdit />}
						/>
					</div>
					<div className="flex flex-1 flex-col justify-center gap-5">
						<div className="flex flex-col gap-2">
							<div>
								<EditableField
								label=""
								value={user.name}
								error={errors.name.error}
								type="text"
								name="name"																		
								onChange={handleChangeField}
								className="flex-1 rounded-l-lg border px-3 py-1"								
								classNameValue="pr-8 text-3xl font-extrabold text-gray-900 border-b"
								onEdit={handleChangeEdit}
								/>
								<span className="text-xs text-red-500">{errors.name.message}</span>
							</div>
							<EditableField
								label=""
								// value={user.username ? `@${user.username}` : ""}
								name="username"
								error={errors.username.error}
								value={user.username ? user.username : ""}
								className="flex-1 rounded-l-lg border px-3 py-1"
								onChange={handleChangeField}								
								classNameValue="text-lg font-medium text-gray-600"
								onEdit={handleChangeEdit}
							/>
							<span className="text-xs text-red-500">{errors.username.message}</span>
						</div>
						<div className="mt-auto">
							<div>
								<EditableField
									label="Email"
									type="email"
									name="email"
									disabled={true}
									value={user.email}
									onChange={handleChangeField}
									className="flex-1 rounded-l-lg border px-3 py-1"									
									classNameValue="text-base text-gray-800"
									onEdit={() => {}}
								/>								
							</div>
							<div>
								<EditableField
									label="Fec. Nacimiento"
									// value={formatDate(user.dateBirth as string)}
									classNameValue="text-base text-gray-800"
									type="date"
									name="dateBirth"
									error={errors.dateBirth.error}
									onChange={handleChangeField}
									value={user.dateBirth as string}
									className="flex-1 rounded-l-lg border px-3 py-1"									
									onEdit={handleChangeEdit}
								/>
								<span className="text-xs text-red-500">{errors.dateBirth.message}</span>
							</div>
							<div>
								<EditableField
									label="Ubicación"
									value={user.location ? user.location : ""}
									type="text"
									name="location"
									// value={user.location as string}
									error={errors.location.error}
									onChange={handleChangeField}
									className="flex-1 rounded-l-lg border px-3 py-1"
									classNameValue="text-base text-gray-800"
									onEdit={handleChangeEdit}
								/>
								<span className="text-xs text-red-500">{errors.location.message}</span>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="border-t border-gray-300 pt-6">
						<EditableField
							label="Biografía"
							// value={user.bio ? `"${user.bio}"` : ""}
							type="textarea"
							name="bio"
							error={errors.bio.error}
							value={user.bio as string}
							onChange={handleChangeField}
							rows={3}
							className="flex-1 rounded-l-lg border px-3 py-1"
							classNameValue="mt-2 text-base text-gray-700 italic"
							onEdit={handleChangeEdit}
						/>
						<span className="text-xs text-red-500">{errors.bio.message}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
