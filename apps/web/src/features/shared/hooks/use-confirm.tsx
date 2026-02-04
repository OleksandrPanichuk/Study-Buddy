import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@repo/ui";
import {type JSX, useState} from 'react'

interface IUseConfirmProps {
	title?: string;
	message?: string;
}

export const useConfirm = ({
	title = "Are you absolutely sure?",
	message = "This action cannot be undone"
}: IUseConfirmProps = {}): [() => JSX.Element, () => Promise<boolean>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () =>
		new Promise((resolve) => {
			setPromise({ resolve });
		});

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);

		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const ConfirmationDialog = () => (
		<AlertDialog open={promise !== null} onOpenChange={(open) => !open && promise && handleCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{message}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);

	return [ConfirmationDialog, confirm as () => Promise<boolean>];
};
