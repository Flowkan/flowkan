import { IconCancel } from "../../icons/IconCancel";
import { Button } from "../Button";
import { useTranslation } from "react-i18next";
import { useDismiss } from "../../../hooks/useDismissClickAndEsc";
import { useEffect } from "react";

interface UpgradeModalProps {
	onClose: () => void;
	message: string;
}

const UpgradeModal = ({ onClose, message }: UpgradeModalProps) => {
	const { t } = useTranslation();
	const { open, ref, setOpen } = useDismiss<HTMLDivElement>(true);

	useEffect(() => {
		if (!open) {
			onClose();
		}
	}, [open, onClose]);

	if (!open) return null;

	const handleCloseClick = () => {
		setOpen(false);
	};

	return (
		<div className="modal-bg">
			<article
				ref={ref}
				className="modal-card border-primary max-w-lg scale-100 transform rounded-xl border-t-8 bg-white p-8 shadow-2xl transition-all"
			>
				<header className="flex justify-end pb-3">
					<button
						onClick={handleCloseClick}
						className="hover:bg-primary-hover cursor-pointer rounded-md p-2 transition-colors duration-300 hover:text-white"
					>
						<IconCancel />
					</button>
				</header>
				<div className="text-center">
					<svg
						className="text-primary mx-auto h-16 w-16"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>

					<h3 className="modal-header mt-4 text-3xl font-extrabold text-gray-900">
						{t("upgradeModal.title")}
					</h3>

					<p className="text-md mt-2 text-gray-600">{message}</p>

					<div className="mt-8 space-y-4">
						<Button
							className="bg-primary hover:bg-primary-hover w-full py-1 text-white shadow-lg transition duration-200"
							onClick={onClose}
						>
							{t("upgradeModal.buttonUpgrade")}
						</Button>
					</div>
				</div>
			</article>
		</div>
	);
};

export default UpgradeModal;
