import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

export const useFormPassword = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	const [showPassword, setShowPassword] = useState(false);

	const handleClickIcon = useCallback(() => {
		setShowPassword(!showPassword);
	}, [showPassword]);

	return { control, errors, handleClickIcon, showPassword };
};
