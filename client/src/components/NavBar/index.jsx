import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import { LogoutOutlined } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import Button from "@mui/material/Button";
import { useNavBar } from "./index.hooks.js";
import NavLinks from "./NavLinks/index.jsx";
import ToggleOffice from "../ToggleOffice/index.jsx";

const NavBar = ({ isLoading }) => {
	const { handleLogout, siteName, user, links } = useNavBar(isLoading);
	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<Box sx={{ flex: 1 }}>
							<Link to={"/"} style={{ textDecoration: "none" }}>
								<Button
									variant={"outlined"}
									sx={{
										border: "1px solid white",
										textTransform: "none",
										color: "white",
										minHeight: "55px",
										minWidth: "200px",
									}}
								>
									<Typography
										variant="h4"
										sx={{
											fontWeight: "500",
											userSelect: "none",
											color: "white",
										}}
									>
										{siteName}
									</Typography>
								</Button>
							</Link>
						</Box>
						<Stack
							direction={"row"}
							sx={{
								flex: 1,
								justifyContent: "center",
							}}
						>
							<NavLinks links={links.base} />
							{user?.role === "admin" && <NavLinks links={links.admin} />}
							{user?.role === "user" && <NavLinks links={links.user} />}
							{user && <ToggleOffice />}
						</Stack>
						<Stack
							direction={"row"}
							spacing={5}
							sx={{
								flex: 1,
								justifyContent: "flex-end",
								alignItems: "center",
							}}
						>
							{user && (
								<Stack
									spacing={1}
									direction={"row"}
									sx={{ alignItems: "center" }}
								>
									<Typography
										variant={"subtitle1"}
										sx={{ fontSize: "18px", fontWeight: "400" }}
									>
										Hi
									</Typography>
									<Chip
										label={user.name}
										variant="contained"
										color={"secondary"}
										sx={{ fontSize: "18px", fontWeight: "500" }}
									/>
									{user?.role === "admin" && (
										<Chip
											label={"Admin"}
											variant="contained"
											color={"info"}
											sx={{ fontSize: "18px", fontWeight: "500" }}
										/>
									)}
									{user?.role === "user" && (
										<Chip
											label={"User"}
											variant="contained"
											color={"info"}
											sx={{ fontSize: "18px", fontWeight: "500" }}
										/>
									)}
								</Stack>
							)}
							{user ? (
								<Button
									variant={"contained"}
									color={"warning"}
									onClick={handleLogout}
									endIcon={<LogoutOutlined />}
								>
									Logout
								</Button>
							) : (
								<div>
									<Link to={"/login"}>
										<Button
											variant="contained"
											color="secondary"
											endIcon={<LoginIcon />}
										>
											Login
										</Button>
									</Link>
								</div>
							)}
						</Stack>
					</Toolbar>
				</AppBar>
			</Box>
		</>
	);
};
export default NavBar;
