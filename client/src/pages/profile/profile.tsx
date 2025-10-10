import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import UploadImage from "../../components/ui/UploadImage";
import { IconEdit } from "../../components/icons/IconEdit";
import EditableField from "../../components/ui/EditableField";
import { ProfileUpdatedSchema, type ProfileUpdateType } from "./types";
import { useAppSelector } from "../../store";
import Banner from "../../components/icons/Banner";
import { getProfile, getUserLogged } from "../../store/profile/selectors";
import { resolveBaseURLFromEnv } from "../../utils/resolveBaseUrlEnv";
import { updateFieldProfile } from "./service";
import { useLoadedProfile, useUpdatedProfile } from "../../store/profile/hooks";
import Switch from "../../components/ui/Switch";
import { Button } from "../../components/ui/Button";
import { useDeleteAccount } from "../../hooks/auth/useDeleteAccount";
import ConfirmDelete from "../../components/ui/modals/confirm-delete";
import { useTranslation } from "react-i18next";
import { validationForm } from "../../utils/validations";
import { useValidationForm } from "../../hooks/useValidationForm";

type EventInput = (e: ChangeEvent<HTMLInputElement>) => void;

type ProfileFieldsAllowEdit = Omit<ProfileUpdateType,"email">

const Profile = () => {
	const userData = useAppSelector(getUserLogged);
	const profileData = useAppSelector(getProfile);

	const updatedProfileAction = useUpdatedProfile();

	const loadProfileAction = useLoadedProfile();

	// Estado para el modal de confirmación de borrado de cuenta
	const { handleDelete, loading } = useDeleteAccount();
	const [showModal, setShowModal] = useState(false);
	const { t } = useTranslation();

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

	const previewImage =
		user.photo && typeof user.photo === "string"
			? `${resolveBaseURLFromEnv()}/uploads/users/${user.photo}_o.webp`
			: "";

	//Validaciones con zod usando el esquema ProfileUpdateSchema
	const ProfileValidator = useCallback((data:unknown,fieldName?:keyof ProfileFieldsAllowEdit)=>{
			return validationForm(ProfileUpdatedSchema,data,fieldName)
		},[])
	
	const { error,validate } = useValidationForm<ProfileFieldsAllowEdit>(ProfileValidator)	

	const handleSubmitEditField = useCallback(
		async (field: keyof ProfileUpdateType) => {			
			const isValidate = validate(user,field as keyof ProfileFieldsAllowEdit)

			if (userData && isValidate) {
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
		[updatedProfileAction, user, userData,validate],
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
			<div className="shadow-primary mx-auto my-6 w-full max-w-[70vw] rounded-xl shadow-[2px_2px_10px] md:my-10 md:max-w-4xl">
				<h2 className="relative h-[120px] rounded-t-xl md:h-[200px]">
					<Banner className="inline-block h-full w-full rounded-t-xl object-cover" />

					<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-bold whitespace-nowrap text-gray-50 text-shadow-md drop-shadow-lg md:text-4xl">
						{t("profile.title")}
					</span>
				</h2>
				<div className="p-4 pt-0 md:p-8">
					<div className="flex flex-col md:flex-row md:space-x-8">
						<div className="mt-8 mb-6 flex w-full flex-col items-center gap-2 md:mt-0 md:mb-0 md:w-fit">
							<UploadImage
								name="photo"
								previewUrl={previewImage}
								value={user.photo}
								onChange={handleChangeField as EventInput}
								onSubmit={handleSubmitEditField}
								error={!!error?.photo}
								icon={<IconEdit />}
							/>
							<span className="text-center text-xs text-red-500">
								{error?.photo}
							</span>
						</div>

						<div className="flex flex-1 flex-col gap-6 pt-2 md:pt-0">
							<div className="flex flex-col gap-4 pb-4">
								<div>
									<EditableField
										label=""
										value={user.name}
										error={!!error?.name}
										errors={error?.name}
										type="text"
										name="name"
										onChange={handleChangeField}
										className="flex-1 border px-3 py-2"
										classNameValue="pr-8 text-2xl font-extrabold text-primary border-b border-primary/60 md:text-3xl"
										onEdit={handleSubmitEditField}
									/>									
								</div>
								<Switch
									label={t("profile.switch.label")}
									name="allowNotifications"
									onChange={handleChangeField}
									checked={user.allowNotifications}
									onSubmit={handleSubmitEditField}
								/>
							</div>

							<div className="grid grid-cols-2 gap-5 bg-gray-100/50 shadow-md p-2 md:p-4 rounded-md">
								<div>
									<EditableField
										label={t("profile.username")}
										name="username"
										error={!!error?.username}
										errors={error?.username}
										value={user.username ? user.username : ""}
										className="flex-1 border"
										classNameValue="text-base font-semibold text-gray-500"
										onChange={handleChangeField}
										onEdit={handleSubmitEditField}
									/>									
								</div>
								<div>
									<EditableField
										label={t("profile.email")}
										type="email"
										name="email"
										value={user.email}
										readonly
										onChange={handleChangeField}
										className="flex-1 border px-3 py-2"
										classNameValue="text-sm text-gray-800"
										onEdit={() => {}}
									/>
								</div>

								<div>
									<EditableField
										label={t("profile.birthdate")}
										type="date"
										name="dateBirth"
										error={!!error?.dateBirth}
										errors={error?.dateBirth}
										onChange={handleChangeField}
										value={user.dateBirth as string}
										className="flex-1 border"
										classNameValue="text-sm text-gray-800"
										onEdit={handleSubmitEditField}
									/>									
								</div>

								<div>
									<EditableField
										label={t("profile.location")}
										value={user.location ? user.location : ""}
										type="text"
										name="location"
										error={!!error?.location}
										errors={error?.location}
										onChange={handleChangeField}
										className="flex-1 border"
										classNameValue="text-sm text-gray-800"
										onEdit={handleSubmitEditField}
									/>									
								</div>
							</div>

							<div className="border-accent/30 border-t pt-4">
								<EditableField
									label={t("profile.bio")}
									as="textarea"
									name="bio"
									error={!!error?.bio}
									errors={error?.bio}
									value={user.bio ? user.bio : ""}									
									onChange={handleChangeField}
									rows={3}
									className="flex-1 border px-3 py-2"
									classNameValue="mt-2 text-base text-gray-700 italic"
									onEdit={handleSubmitEditField}
								/>
							</div>
							<div className="flex justify-end">
								<Button
									type="submit"
									onClick={() => setShowModal(true)}
									disabled={loading}
									className={`relative flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white ${loading ? "cursor-not-allowed bg-red-500 opacity-70" : "bg-red-600 hover:bg-red-700 active:scale-[0.98]"} shadow-md transition-all duration-200 hover:shadow-lg`}
								>
									{t("profile.deleteAccount")}
								</Button>
								{showModal && (
									<ConfirmDelete
										message={t("profile.confirmDelete")}
										handleDeleteBoard={async () => {
											await handleDelete();
											setShowModal(false);
										}}
										handleHideMessage={() => setShowModal(false)}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
