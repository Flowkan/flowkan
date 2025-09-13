import { useCallback, useState, type ChangeEvent } from "react";
import UploadImage from "../../components/ui/UploadImage";
import { IconEdit } from "../../components/icons/IconEdit";
import EditableField from "../../components/ui/EditableField";
import { ProfileUpdateSchema, type ProfileUpdateType } from "./types";
import { useAppSelector } from "../../store";
import z from "zod";
import Banner from "../../components/icons/Banner";

type EventInput = (e: ChangeEvent<HTMLInputElement>) => void;

const Profile = () => {
	// const [enableEdit, setEnableEdit] = useState(false);
	// const [photo, setPhoto] = useState<File | null>(null);
	const userData = useAppSelector((state) => state.auth.user);
	const [user, setUser] = useState<ProfileUpdateType>({
		name: userData?.name ?? "",
		email: userData?.email ?? "",
		dateBirth: "",
	});
	const [errors, setErrors] = useState({
		name: { error: false, message: "" },
		username: { error: false, message: "" },
		photo: { error: false, message: "" },
		email: { error: false, message: "" },
		bio: { error: false, message: "" },
		dateBirth: { error: false, message: "" },
		location: { error: false, message: "" },
	});

	const previewImage = userData?.photo ?? "";

	const handleSubmitEditField = useCallback(
		(field: keyof ProfileUpdateType) => {
			const dataParse = ProfileUpdateSchema.safeParse(user);
			if (!dataParse.success) {
				console.log(z.flattenError(dataParse.error).fieldErrors);
				const errorsList = z.flattenError(dataParse.error).fieldErrors;
				if (field in errorsList && errorsList[field]) {
					const msgErrors = errorsList[field].join(", ");
					setErrors({
						...errors,
						[field]: { error: true, message: msgErrors },
					});
					return;
				}
			}
			setErrors({ ...errors, [field]: { error: false, message: "" } });
		},
		[errors, user],
	);

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
		// console.log({ ...user, [name]: value });
		setUser((prev) => ({ ...prev, [name]: value }));
	}

	return (
		<div>
			<div className="mx-auto my-10 flex flex-col gap-12 rounded-xl shadow-[2px_2px_10px] shadow-primary md:max-w-3xl">
				<h2 className="relative h-[150px] md:h-[250px]">
					{/* 👤 Perfil de Usuario */}
					<Banner className="inline-block h-full w-full rounded-t-xl" />
					<span className="md:w-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-3xl md:text-5xl font-bold text-gray-50">
						Perfil de Usuario
					</span>
				</h2>
				<div className="p-6 md:p-10">
					<div className="flex gap-5 md:flex-col">
						<div className="flex flex-col gap-4 px-5 md:items-center md:gap-0">
							<UploadImage
								name="photo"
								previewUrl={previewImage}
								onChange={handleChangeField as EventInput}
								onSubmit={handleSubmitEditField}
								error={errors.photo.error}
								icon={<IconEdit />}
							/>
							<span className="text-center text-xs text-red-500">
								{errors.photo.message}
							</span>
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
										classNameValue="pr-8 text-3xl font-extrabold text-primary border-b border-primary/60 shadow"
										onEdit={handleSubmitEditField}
									/>
									<span className="text-xs text-red-500">
										{errors.name.message}
									</span>
								</div>
								<EditableField
									label=""
									name="username"
									error={errors.username.error}
									value={user.username ? user.username : ""}
									className="flex-1 rounded-l-lg border px-3 py-1"
									onChange={handleChangeField}
									classNameValue="text-lg font-medium text-primary/80"
									onEdit={handleSubmitEditField}
								/>
								<span className="text-xs text-red-500">
									{errors.username.message}
								</span>
							</div>
							<div className="mt-auto">
								<div>
									<EditableField
										label="Email"
										type="email"
										name="email"
										disabled={true}
										value={user.email}
										readonly
										onChange={handleChangeField}
										className="flex-1 rounded-l-lg border px-3 py-1"
										classNameValue="text-base text-gray-800"
										onEdit={() => {}}
									/>
								</div>
								<div>
									<EditableField
										label="Fec. Nacimiento"
										classNameValue="text-base text-gray-800"
										type="date"
										name="dateBirth"
										error={errors.dateBirth.error}
										onChange={handleChangeField}
										value={user.dateBirth as string}
										className="flex-1 rounded-l-lg border px-3 py-1"
										onEdit={handleSubmitEditField}
									/>
									<span className="text-xs text-red-500">
										{errors.dateBirth.message}
									</span>
								</div>
								<div>
									<EditableField
										label="Ubicación"
										value={user.location ? user.location : ""}
										type="text"
										name="location"
										error={errors.location.error}
										onChange={handleChangeField}
										className="flex-1 rounded-l-lg border px-3 py-1"
										classNameValue="text-base text-gray-800"
										onEdit={handleSubmitEditField}
									/>
									<span className="text-xs text-red-500">
										{errors.location.message}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="border-t border-gray-300 pt-6">
							<EditableField
								label="Biografía"
								as="textarea"
								name="bio"
								error={errors.bio.error}
								value={user.bio as string}
								onChange={handleChangeField}
								rows={3}
								className="flex-1 rounded-l-lg border px-3 py-1"
								classNameValue="mt-2 text-base text-gray-700 italic"
								onEdit={handleSubmitEditField}
							/>
							<span className="text-xs text-red-500">{errors.bio.message}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
