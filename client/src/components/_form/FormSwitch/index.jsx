import React, { memo } from "react";
import { useFormSwitch } from "./index.hooks.js";
import {
	FormControlLabel,
	FormGroup,
	FormHelperText,
	Switch,
} from "@mui/material";
import { Controller } from "react-hook-form";

export const FormSwitch = ({ name, label = "", ...others }) => {
	const { control, errors } = useFormSwitch();

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, value } }) => {
				return (
					<FormGroup>
						<FormControlLabel
							control={
								<Switch checked={value} onChange={onChange} {...others} />
							}
							labelPlacement={"end"}
							label={label}
						/>
						{!!errors[name] && (
							<FormHelperText error>{errors[name]?.message}</FormHelperText>
						)}
					</FormGroup>
				);
			}}
		/>
	);
};
