import { useFormContext } from "react-hook-form";

export const useFormTextField = () => {
	const {
		control,
		formState: { errors, defaultValues },
	} = useFormContext();
	return {
		defaultValues,
		control,
		errors,
	};
};
