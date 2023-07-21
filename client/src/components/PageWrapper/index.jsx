import { Outlet } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NavBar from "../NavBar/index.jsx";
import { Box, CircularProgress, Container } from "@mui/material";
import { SnackbarProvider } from "notistack";
import usePageWrapper from "./index.hooks.js";
import { ConfirmProvider } from "material-ui-confirm";

function PageWrapper({ isLoading }) {
	const { StyledMaterialDesignContent } = usePageWrapper();
	return (
		<SnackbarProvider
			maxSnack={1}
			Components={{
				success: StyledMaterialDesignContent,
				error: StyledMaterialDesignContent,
				info: StyledMaterialDesignContent,
				warning: StyledMaterialDesignContent,
			}}
		>
			<ConfirmProvider>
				<Box sx={{ minHeight: "100vh", backgroundColor: "#eeeeee" }}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<header>
							<NavBar isLoading={isLoading} />
						</header>
						<main>
							<>
								{isLoading ? (
									<Container>
										<Box
											sx={{ p: 6, display: "flex", justifyContent: "center" }}
										>
											<CircularProgress />
										</Box>
									</Container>
								) : (
									<Outlet />
								)}
							</>
						</main>
					</LocalizationProvider>
				</Box>
			</ConfirmProvider>
		</SnackbarProvider>
	);
}

export default PageWrapper;
