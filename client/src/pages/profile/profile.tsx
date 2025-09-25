import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import UploadImage from "../../components/ui/UploadImage";
import { IconEdit } from "../../components/icons/IconEdit";
import EditableField from "../../components/ui/EditableField";
import { ProfileUpdateSchema, type ProfileUpdateType } from "./types";
import { useAppSelector } from "../../store";
import z from "zod";
import Banner from "../../components/icons/Banner";
import { getProfile, getUserLogged } from "../../store/profile/selectors";
import { resolveBaseURLFromEnv } from "../../utils/resolveBaseUrlEnv";
import { updateFieldProfile } from "./service";
import { useLoadedProfile, useUpdatedProfile } from "../../store/profile/hooks";
import Switch from "../../components/ui/Switch";

type EventInput = (e: ChangeEvent<HTMLInputElement>) => void;

const Profile = () => {
	const userData = useAppSelector(getUserLogged);
	const profileData = useAppSelector(getProfile);

	const updatedProfileAction = useUpdatedProfile();

	const loadProfileAction = useLoadedProfile();

	useEffect(() => {
		loadProfileAction();
	}, [loadProfileAction]);

	const [user, setUser] = useState<ProfileUpdateType>({
		name: userData?.name ?? "",
		email: userData?.email ?? "",
		photo: userData?.photo ?? "",
		allowNotifications: profileData?.allowNotifications ?? true,
	});

	useEffect(() => {
		if (profileData) {
			setUser((prevUser) => ({
				...prevUser,
				username: profileData.username,
				dateBirth: profileData.dateBirth,
				allowNotifications: profileData.allowNotifications,
				location: profileData.location,
				bio: profileData.bio,
			}));
		}
	}, [profileData]);

	const [errors, setErrors] = useState({
		name: { error: false, message: "" },
		photo: { error: false, message: "" },
		username: { error: false, message: "" },
		bio: { error: false, message: "" },
		allowNotifications: { error: false, message: "" },
		dateBirth: { error: false, message: "" },
		location: { error: false, message: "" },
	});

	const previewImage =
		user.photo && typeof user.photo === "string"
			? `${resolveBaseURLFromEnv()}/uploads/${user.photo}_o.webp`
			: "";

	const handleSubmitEditField = useCallback(
		async (field: keyof ProfileUpdateType) => {
			const dataParse = ProfileUpdateSchema.safeParse(user);
			if (!dataParse.success) {
				console.log(z.flattenError(dataParse.error).fieldErrors);
				const errorsList = z.flattenError(dataParse.error).fieldErrors;
				if (field in errorsList && errorsList[field]) {
					const msgErrors = errorsList[field].join(", ");

					setErrors((prevErrors) => ({
						...prevErrors,
						[field]: { error: true, message: msgErrors },
					}));
					return;
				}
			}

			setErrors((prevErrors) => ({
				...prevErrors,
				[field]: { error: false, message: "" },
			}));

			if (userData) {
				const formData = new FormData();
				switch (field) {
					case "photo":
						if (user[field] instanceof File) {
							formData.append(field, user[field]);
						}
						break;
					case "allowNotifications":
						if (typeof user[field] === "boolean") {
							formData.append(field, String(user[field]));
						}
						break;
					default:
						if (typeof user[field] === "string") {
							formData.append(field, user[field]);
						}
						break;
				}
				const { user: userUpdated, profile } = await updateFieldProfile(
					userData.id.toString(),
					formData,
				);
				updatedProfileAction({
					user: userUpdated,
					profile,
				});
			}
		},
		[updatedProfileAction, user, userData],
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

		setUser({ ...user, [name]: value });
	}

	return (
		<div>
			<div className="shadow-primary mx-auto my-10 flex flex-col gap-12 rounded-xl shadow-[2px_2px_10px] md:max-w-3xl">
				<h2 className="relative -z-10 h-[150px] md:h-[250px]">
					<Banner className="inline-block h-full w-full rounded-t-xl" />
					<span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-3xl font-bold text-gray-50 md:w-full md:text-5xl">
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
										classNameValue="pr-8 text-3xl font-extrabold text-primary border-b border-primary/60"
										onEdit={handleSubmitEditField}
									/>
									<span className="text-xs text-red-500">
										{errors.name.message}
									</span>
								</div>
								<div className="flex">
									<Switch
										label="Permitir envío de notificaciones"
										name="allowNotifications"
										onChange={handleChangeField}
										checked={user.allowNotifications}
										onSubmit={handleSubmitEditField}
									/>
								</div>
							</div>
							<div className="mt-auto flex flex-col gap-0 md:gap-3">
								<div>
									<EditableField
										label="username"
										name="username"
										error={errors.username.error}
										value={user.username ? user.username : ""}
										className="flex-1 rounded-l-lg border px-3"
										onChange={handleChangeField}
										classNameValue="text-lg font-medium text-gray-500 font-semibold"
										onEdit={handleSubmitEditField}
									/>
									<span className="text-xs text-red-500">
										{errors.username.message}
									</span>
								</div>
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
										classNameValue="text-base text-gray-800 text-xs"
										onEdit={() => {}}
									/>
								</div>
								<div>
									<EditableField
										label="Fec. Nacimiento"
										type="date"
										name="dateBirth"
										error={errors.dateBirth.error}
										onChange={handleChangeField}
										value={user.dateBirth as string}
										className="flex-1 rounded-l-lg border px-3 py-1"
										classNameValue="text-base text-gray-800 text-xs"
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
										classNameValue="text-base text-xs text-gray-800"
										onEdit={handleSubmitEditField}
									/>
									<span className="text-xs text-red-500">
										{errors.location.message}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="pt-2 md:pt-6">
						<div className="border-accent/30 border-t pt-2 md:pt-6">
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
