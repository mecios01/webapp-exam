import { Box, Typography } from "@mui/material";
import { useContent } from "./index.hooks.js";
import ImageBox from "../ImageBox/index.jsx";

const Content = ({ type, data }) => {
	const {} = useContent();
	return (
		<Box>
			{type === "header" && (
				<Typography variant={"h4"} sx={{ wordBreak: "break-all" }}>
					{data}
				</Typography>
			)}
			{type === "paragraph" && (
				<Typography
					variant={"body1"}
					sx={{ wordBreak: "break-all", fontSize: "20px" }}
				>
					{data}
				</Typography>
			)}
			{type === "image" && (
				<Box sx={{ my: 4 }}>
					<ImageBox value={data} width={"100%"} height={"100%"} effects />
				</Box>
			)}
		</Box>
	);
};
export default Content;
