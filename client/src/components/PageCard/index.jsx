import { usePageCard } from "./index.hooks.js";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { CheckCircle, Delete, Edit, Info, Warning } from "@mui/icons-material";
import Chip from "@mui/material/Chip";

const PageCard = ({ page, refresh }) => {
	const { publication, creation, user, status, color, onDelete } = usePageCard(
		page,
		refresh,
	);

	const icon =
		status === "Published" ? (
			<CheckCircle sx={{ p: 0.3 }} />
		) : status === "Scheduled" ? (
			<Info sx={{ p: 0.3 }} />
		) : (
			<Warning sx={{ p: 0.3 }} />
		);

	return (
		<Paper
			elevation={3}
			sx={{
				px: 6,
				py: 3,
				width: "100%",
				height: "100%",
				borderRadius: "20px",
			}}
		>
			<Stack
				direction={"row"}
				sx={{
					flex: 1,
					height: "100%",
				}}
			>
				<Stack spacing={3} sx={{ flex: 1 }}>
					<Stack direction={"row"} sx={{ flexGrow: 1 }}>
						<Box sx={{ flex: 1 }}>
							{user && (
								<Box sx={{ pb: 1 }}>
									<Chip
										label={status}
										variant={"outlined"}
										icon={icon}
										color={color}
										sx={{ borderWidth: "2px", fontSize: "18px" }}
									/>
								</Box>
							)}
							<Typography variant={"h4"}>{page.title}</Typography>
							<Stack
								spacing={2}
								direction={"row"}
								sx={{ alignItems: "center" }}
							>
								<Typography variant={"subtitle1"}>Author:</Typography>
								<Typography variant={"h5"} sx={{ fontWeight: 500 }}>
									{page.author.name}
								</Typography>
								<Typography variant={"subtitle1"}>
									{`( ${page.author.email} )`}
								</Typography>
							</Stack>
							{page.publicationDate && (
								<Typography variant={"subtitle1"} sx={{ fontSize: "16px" }}>
									Published: {publication}
								</Typography>
							)}

							<Typography variant={"subtitle1"} sx={{ fontSize: "16px" }}>
								Created: {creation}
							</Typography>
						</Box>

						<Box sx={{ width: "40px" }}>
							{user &&
								(user.email === page.author.email || user.role === "admin") && (
									<>
										<Link to={`/edit/page/${page.slug}`}>
											<IconButton variant={"contained"} color={"tertiary"}>
												<Edit />
											</IconButton>
										</Link>
										<IconButton
											color={"error"}
											onClick={onDelete}
											sx={{ mt: 3 }}
										>
											<Delete />
										</IconButton>
									</>
								)}
						</Box>
					</Stack>
					<Box
						sx={{
							alignSelf: "center",
							flex: 1,
							height: "100%",
							width: "100%",
						}}
					>
						<Link to={`/pages/${page.slug}`}>
							<Button fullWidth variant={"contained"} color={"warning"}>
								See more
							</Button>
						</Link>
					</Box>
				</Stack>
			</Stack>
		</Paper>
	);
};
export default PageCard;
