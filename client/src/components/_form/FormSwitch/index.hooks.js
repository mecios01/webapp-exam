import { useFormContext } from "react-hook-form";

export const useFormSwitch = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return {
		control,
		errors,
	};
};
