import { useAppSelector } from "../../../store";
import UpgradeModal from "./UpgradeModal";
import { useUiResetError } from "../../../store/boards/hooks";
import type { LimitErrorData } from "../../../pages/boards/types";

export default function UpgradeModalContainer() {
	const limitErrorData = useAppSelector(
		(state) => state.ui.error as LimitErrorData | null,
	);
	const resetError = useUiResetError();

	if (!limitErrorData) return null;

	const handleClose = () => resetError();

	return (
		<UpgradeModal onClose={handleClose} message={limitErrorData.message} />
	);
}
