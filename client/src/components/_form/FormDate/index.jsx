import { Controller } from "react-hook-form";
import { useFormDate } from "./index.hooks.js";
import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import { DatePicker } from "@mui/x-date-pickers";
import { accessObject } from "../../../utils/accessObject.js";

dayjs.extend(utcPlugin);

export const FormDate = ({ name, label, disabled, ...otherProps }) => {
	const { control, errors } = useFormDate();
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, onBlur, value, name, ...otherProps } }) => {
				const onDateChange = date => {
					onChange(date ? date.toDate() : null);
				};
				return (
					<DatePicker
						label={label}
						value={dayjs.utc(value)}
						disabled={disabled}
						onChange={onDateChange}
						format={"DD/MM/YYYY"}
						disablePast={true}
						closeOnSelect={true}
						sx={{ flex: 1 }}
						slotProps={{
							textField: {
								helperText: accessObject(errors, `${name}.message`),
								error: !!accessObject(errors, `${name}.message`),
							},
						}}
					/>
				);
			}}
		/>
	);
};
