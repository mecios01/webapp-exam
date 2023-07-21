import { useEditSiteName } from "./index.hooks.js";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { FormProvider } from "react-hook-form";
import FormTextField from "../../components/_form/FormTextField/index.jsx";
import Button from "@mui/material/Button";

const EditSiteName = () => {
	const { formData, onSubmit, reset, handleReset } = useEditSiteName();
	return (
		<Container sx={{ mt: 10 }}>
			<Paper elevation={3} sx={{ borderRadius: "20px" }}>
				<Stack
					spacing={5}
					direction={"column"}
					sx={{
						px: 5,
						py: 20,
						my: 4,
						mx: "auto",
						maxWidth: "700px",
						alignItems: "center",
					}}
				>
					<FormProvider {...formData}>
						<Box
							sx={{
								mt: 1,
								width: "100%",
							}}
						>
							<form onSubmit={onSubmit}>
								<Stack spacing={6} flexWrap sx={{ width: "100%" }}>
									<Stack direcion={"row"}>
										<Typography variant={"h4"}>Enter a new name</Typography>
									</Stack>
									<FormTextField
										label={"Name"}
										required
										fullWidth
										name={"name"}
									/>
									<Stack direction={"row"} spacing={3}>
										<Button
											type="submit"
											variant="contained"
											color={"secondary"}
											sx={{ flex: 1 }}
										>
											<Typography variant={"h5"} sx={{ fontWeight: 500 }}>
												Update
											</Typography>
										</Button>
										<Button
											variant={"outlined"}
											onClick={handleReset}
											color={"error"}
											sx={{ flex: 1 }}
										>
											Cancel
										</Button>
									</Stack>
								</Stack>
							</form>
						</Box>
					</FormProvider>
				</Stack>
			</Paper>
		</Container>
	);
};
export default EditSiteName;
