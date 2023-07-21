import { useFormSelect } from "./index.hooks";
import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { accessObject } from "../../../utils/accessObject.js";

const FormSelect = ({
	options,
	label,
	name,
	fireAction,
	MenuProps,
	...props
}) => {
	const actionAfterChange = fireAction ? fireAction : () => {};
	const { control, errors } = useFormSelect();
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, value, name, ref } }) => (
				<FormControl
					error={!!accessObject(errors, `${name}.message`)}
					variant="outlined"
					{...props}
				>
					{label && (
						<InputLabel id={`mui-select-${name.trim()}`}>{label}</InputLabel>
					)}
					<Select
						labelId={label ? `mui-select-${name.trim()}` : ""}
						value={value}
						onChange={ev => {
							onChange(ev.target.value);
							actionAfterChange();
						}}
						variant="outlined"
						name={name}
						label={label}
						MenuProps={{ ...MenuProps }}
						error={!!accessObject(errors, `${name}.message`)}
					>
						{options.map(option => (
							<MenuItem value={option.value} key={option.value}>
								{option.label}
							</MenuItem>
						))}
					</Select>
					{!!accessObject(errors, `${name}.message`) && (
						<FormHelperText error>
							{accessObject(errors, `${name}.message`)}
						</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	);
};
export default FormSelect;
