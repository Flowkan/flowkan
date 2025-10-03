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
			? `${resolveBaseURLFromEnv()}/uploads/users/${user.photo}_o.webp`
			: "";

	const handleSubmitEditField = useCallback(
		async (field: keyof ProfileUpdateType) => {
			const dataParse = ProfileUpdateSchema.safeParse(user);
			if (!dataParse.success) {
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
		<div className="w-full">
			<div className="shadow-primary mx-auto my-6 w-full max-w-sm rounded-xl shadow-[2px_2px_10px] md:my-10 md:max-w-4xl">
				<h2 className="relative h-[120px] rounded-t-xl md:h-[200px]">
					<Banner className="inline-block h-full w-full rounded-t-xl object-cover" />

					<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-2xl font-bold whitespace-nowrap text-gray-50 drop-shadow-lg md:text-4xl">
						Perfil de Usuario
					</span>
				</h2>
				<div className="p-4 pt-0 md:p-8">
					<div className="flex flex-col md:flex-row md:space-x-8">
						<div className="mt-8 mb-6 flex w-full flex-col items-center gap-2 md:mt-0 md:mb-0 md:w-fit">
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

						<div className="flex flex-1 flex-col gap-6 pt-2 md:pt-0">
							<div className="flex flex-col gap-4 border-b pb-4">
								<div>
									<EditableField
										label=""
										value={user.name}
										error={errors.name.error}
										type="text"
										name="name"
										onChange={handleChangeField}
										className="flex-1 rounded-lg border px-3 py-2"
										classNameValue="pr-8 text-2xl font-extrabold text-primary border-b border-primary/60 md:text-3xl"
										onEdit={handleSubmitEditField}
									/>
									<span className="text-xs text-red-500">
										{errors.name.message}
									</span>
								</div>
								<Switch
									label="Permitir envío de notificaciones"
									name="allowNotifications"
									onChange={handleChangeField}
									checked={user.allowNotifications}
									onSubmit={handleSubmitEditField}
								/>
							</div>

							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div>
									<EditableField
										label="Username"
										name="username"
										error={errors.username.error}
										value={user.username ? user.username : ""}
										className="flex-1 rounded-lg border px-3 py-2"
										classNameValue="text-base font-semibold text-gray-500"
										onChange={handleChangeField}
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
										value={user.email}
										readonly
										onChange={handleChangeField}
										className="flex-1 rounded-lg border px-3 py-2"
										classNameValue="text-sm text-gray-800"
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
										className="flex-1 rounded-lg border px-3 py-2"
										classNameValue="text-sm text-gray-800"
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
										className="flex-1 rounded-lg border px-3 py-2"
										classNameValue="text-sm text-gray-800"
										onEdit={handleSubmitEditField}
									/>
									<span className="text-xs text-red-500">
										{errors.location.message}
									</span>
								</div>
							</div>

							<div className="border-accent/30 border-t pt-4">
								<EditableField
									label="Biografía"
									as="textarea"
									name="bio"
									error={errors.bio.error}
									value={user.bio as string}
									onChange={handleChangeField}
									rows={3}
									className="flex-1 rounded-lg border px-3 py-2"
									classNameValue="mt-2 text-base text-gray-700 italic"
									onEdit={handleSubmitEditField}
								/>
								<span className="text-xs text-red-500">
									{errors.bio.message}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
