import { Box, Typography } from "@mui/material";
import { useImageBox } from "./index.hooks.js";

const ImageBox = ({ value, width, height, effects }) => {
	const { signalError, hasError, baseURL } = useImageBox(value);
	return (
		<Box
			sx={{
				width: width ? width : 200,
				height: height ? height : 200,
				backgroundColor: "rgba(0,0,0,0.1)",
				display: "flex",
				alignItems: "center",
				objectFit: width ? "cover" : undefined,
				justifyContent: "center",
				borderRadius: "20px",
				boxShadow: effects
					? "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
					: undefined,
				overflow: "hidden",
			}}
		>
			{!hasError && !!value && (
				<Box
					component={"img"}
					src={`${baseURL}${value}`}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
					onError={signalError}
				/>
			)}
			{hasError ||
				(!value && (
					<Typography variant={"body1"}>No Image Available</Typography>
				))}
		</Box>
	);
};
export default ImageBox;
