import { usePage } from "./index.hooks.js";
import { Divider, Paper, Stack, Typography } from "@mui/material";
import Content from "../Content/index.jsx";

const Page = ({ page, isLoading }) => {
	const { publication, creation } = usePage(page);
	return (
		<Paper
			elevation={3}
			sx={{
				p: 12,
				width: "100%",
				borderRadius: "20px",
			}}
		>
			<Stack sx={{ mb: 2 }}>
				<Typography variant={"h1"} sx={{ mb: 2, wordBreak: "break-all" }}>
					{page.title}
				</Typography>
				<Stack spacing={2} direction={"row"} sx={{ alignItems: "center" }}>
					<Typography
						variant={"body1"}
						sx={{ wordBreak: "break-all", fontSize: "20px" }}
					>
						Author:
					</Typography>
					<Typography
						variant={"h5"}
						sx={{ fontWeight: 500, wordBreak: "break-all", fontSize: "20px" }}
					>
						{page.author.name}
					</Typography>
					<Typography
						variant={"subtitle1"}
						sx={{ wordBreak: "break-all", fontSize: "20px" }}
					>
						{`( ${page.author.email} )`}
					</Typography>
				</Stack>
				{publication && (
					<Typography variant={"subtitle1"} sx={{ fontSize: "20px" }}>
						Published: {publication}
					</Typography>
				)}

				<Typography variant={"subtitle1"} sx={{ fontSize: "20px" }}>
					Created: {creation}
				</Typography>
				<Divider variant={"middle"} orientation={"horizontal"} />
			</Stack>
			<Stack spacing={2}>
				{page["contents"]?.map((c, index) => {
					return <Content key={index} type={c.type} data={c.data} />;
				})}
			</Stack>
		</Paper>
	);
};
export default Page;
