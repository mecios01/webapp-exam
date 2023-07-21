import { Box, IconButton, Paper, Stack } from "@mui/material";
import FormTextField from "../_form/FormTextField/index.jsx";
import FormSelect from "../_form/FormSelect/index.jsx";
import { useEditContent } from "./index.hooks.js";
import { Delete } from "@mui/icons-material";
import ImageBox from "../ImageBox/index.jsx";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined.js";

export const EditContent = ({
	name,
	control,
	moveUp,
	moveDown,
	isLast,
	isFirst,
	handleRemove,
}) => {
	const { defaultOptions, defaultImages, type, setValue, content } =
		useEditContent(name, control);
	return (
		<Paper elevation={4} sx={{ px: 3, py: 4, borderRadius: 4 }}>
			<Stack spacing={2} direction={"row"} sx={{ alignItems: "center" }}>
				<Box sx={{ p: 1 }}>
					<IconButton
						color={"error"}
						onClick={handleRemove}
						sx={{
							border: "1px solid red",
							p: 1,
						}}
					>
						<Delete />
					</IconButton>
				</Box>
				<Stack spacing={2} sx={{ flex: 10 }}>
					<FormSelect
						options={defaultOptions}
						label={"Type"}
						fireAction={() => setValue(`${name}.content`, "")}
						name={`${name}.type`}
					/>
					{type === "image" ? (
						<FormSelect
							options={defaultImages}
							label={"Image"}
							name={`${name}.content`}
						/>
					) : (
						<FormTextField
							multiline={type === "paragraph"}
							label={"Content"}
							name={`${name}.content`}
						/>
					)}
				</Stack>
				{type === "image" && <ImageBox value={content} />}
				<Stack spacing={3}>
					<IconButton
						onClick={moveUp}
						disabled={isFirst}
						color={"info"}
						sx={{
							p: 1,
						}}
					>
						<KeyboardArrowUpOutlinedIcon />
					</IconButton>

					<IconButton
						onClick={moveDown}
						color={"info"}
						disabled={isLast}
						sx={{
							p: 1,
						}}
					>
						<KeyboardArrowDownOutlinedIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Paper>
	);
};
