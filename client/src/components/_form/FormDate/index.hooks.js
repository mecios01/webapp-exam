import { useFormContext } from "react-hook-form";

export const useFormDate = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();
	return {
		control,
		errors,
	};
};
