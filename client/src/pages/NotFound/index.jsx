import { Box, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./custom.css";

export const NotFound = () => {
	return (
		<Box className={"Block"}>
			<Stack spacing={6} sx={{ alignItems: "center" }}>
				<Box className={"Text"} sx={{ lineHeight: "auto" }}>
					<span className={"Fancy"}>404</span>
				</Box>
				<Typography variant={"h4"} sx={{ color: "#00A080" }}>
					We couldn&apos;t find the page you were looking for.
				</Typography>

				<Link to={"/"}>
					<Button variant={"contained"} color={"warning"}>
						Homepage
					</Button>
				</Link>
			</Stack>
		</Box>
	);
};
