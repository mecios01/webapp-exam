import { memo } from "react";
import { useFormPassword } from "./index.hooks";
import { InputAdornment, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const FormPassword = memo(({ name, helperText, ...props }) => {
	const { control, errors, handleClickIcon, showPassword } = useFormPassword();

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, onBlur, value, name, ref } }) => {
				return (
					<TextField
						name={name}
						variant="outlined"
						type={showPassword ? "text" : "password"}
						{...props}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									{showPassword ? (
										<Visibility onClick={handleClickIcon} cursor="pointer" />
									) : (
										<VisibilityOff onClick={handleClickIcon} cursor="pointer" />
									)}
								</InputAdornment>
							),
						}}
						value={value}
						onChange={ev => onChange(ev.target.value)}
						onBlur={onBlur}
						error={!!errors[name]}
						helperText={errors[name] ?? helperText}
					/>
				);
			}}
		/>
	);
});
FormPassword.displayName = "FormPassword";
