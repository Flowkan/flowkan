import { useState, type ChangeEvent } from "react";
import type { ProfileType } from "./types";
import UploadImage from "../../components/ui/UploadImage";
import { IconEdit } from "../../icons/IconEdit";
import { Button } from "../../components/ui/Button";
import { IconSave } from "../../icons/IconSave";

interface ProfileProps {
	profile: ProfileType;
}

const Profile = () => {
	// const [enableEdit, setEnableEdit] = useState(false);
	const [photo, setPhoto] = useState<File | null>(null);
	const user = {
		id: "usr_123456",
		name: "Jhon Dou",
		username: "jhondou",
		email: "jhon@example.com",
		photo: "https://randomuser.me/api/portraits/women/68.jpg",
		bio: "Apasionado por el desarrollo web",
		datebirth: "2000-01-01",
		location: "Ciudad, País",
	};
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setPhoto(file);
		}
	}
	return (
		<div>
			<h2 className="my-10 text-2xl font-semibold text-gray-900">
				Perfil de Usuario
			</h2>
			<div className="flex flex-col gap-12 rounded-lg p-4 md:p-10 shadow-2xl md:max-w-[40vw] md:mx-auto">
				<div className="flex gap-5 md:flex-col">
					<div className="flex flex-col gap-4 md:gap-0  px-5 md:items-center">
						<UploadImage
							previewUrl={user.photo}
							onChange={handleChange}
							icon={<IconEdit />}
						/>
						<div className="flex justify-center">
							{ photo && (
                                <Button
								type="button"								
								className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-md text-white flex items-center gap-3"
							>
								<IconSave />
                                <span>Actualizar Foto</span>
							</Button>
                            )}
						</div>
					</div>
					<div className="flex flex-1 flex-col justify-center">
						<div>
							<p className="mb-1 text-3xl font-extrabold text-gray-900">
								{user.name}
							</p>
							<p className="text-lg font-medium text-gray-600">
								@{user.username}
							</p>
						</div>
						<div className="mt-auto">
							<div>
								<p className="text-md font-semibold text-gray-500 uppercase">
									Email
								</p>
								<p className="text-base text-gray-800">{user.email}</p>
							</div>
							<div>
								<p className="text-md font-semibold text-gray-500 uppercase">
									Fec. Nacimiento
								</p>
								<p className="text-base text-gray-800">
									{new Date(user.datebirth).toLocaleDateString("es-ES", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</p>
							</div>
							<div>
								<p className="text-md font-semibold text-gray-500 uppercase">
									Ubicación
								</p>
								<p className="text-base text-gray-800">{user.location}</p>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="w-full border-b border-gray-400"></div>
					<div className="mt-5">
						<p className="text-lg font-semibold text-gray-500 uppercase">
							Biografía
						</p>
						<p className="text-base text-gray-800 italic">"{user.bio}"</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
