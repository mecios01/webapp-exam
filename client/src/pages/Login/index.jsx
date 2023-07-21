import { Box, Container, Stack, Typography } from "@mui/material";
import useLogin from "./index.hooks.js";
import { FormProvider } from "react-hook-form";
import Button from "@mui/material/Button";
import FormTextField from "../../components/_form/FormTextField/index.jsx";
import Typewriter from "typewriter-effect";
import { FormPassword } from "../../components/_form/FormPassword/index.jsx";

const Login = setUser => {
	const { formData, onSubmit } = useLogin(setUser);

	return (
		<Container>
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
				<Box>
					<Typography variant={"h3"} sx={{ userSelect: "none" }}>
						<Typewriter
							options={{
								strings: ["Welcome again!", "Please login"],
								autoStart: true,
								delay: 100,
								loop: true,
							}}
						/>
					</Typography>
				</Box>
				<FormProvider {...formData}>
					<Box
						sx={{
							mt: 1,
							width: "100%",
						}}
					>
						<form onSubmit={onSubmit}>
							<Stack spacing={3} sx={{ width: "100%" }}>
								<FormTextField
									label={"Email"}
									required
									fullWidth
									name={"username"}
								/>
								<FormPassword
									label={"Password"}
									required
									fullWidth
									name={"password"}
								/>

								<Button
									type="submit"
									fullWidth
									variant="contained"
									color={"secondary"}
								>
									<Typography variant={"h5"} sx={{ fontWeight: 500 }}>
										Login
									</Typography>
								</Button>
							</Stack>
						</form>
					</Box>
				</FormProvider>
			</Stack>
		</Container>
	);
};
export default Login;
