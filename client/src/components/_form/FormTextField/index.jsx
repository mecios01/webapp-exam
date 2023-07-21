import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useFormTextField } from "./index.hooks.js";
import { accessObject } from "../../../utils/accessObject.js";

const FormTextField = ({ name, helperText, ...props }) => {
	const { control, errors } = useFormTextField();
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, onBlur, value, name, ref } }) => {
				return (
					<TextField
						name={name}
						variant="outlined"
						{...props}
						value={value}
						onChange={ev => onChange(ev.target.value)}
						onBlur={onBlur}
						error={!!accessObject(errors, `${name}.message`)}
						helperText={accessObject(errors, `${name}.message`) ?? helperText}
					/>
				);
			}}
		/>
	);
};

export default FormTextField;
