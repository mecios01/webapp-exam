import { usePageEditor } from "./index.hooks.js";
import { FormProvider } from "react-hook-form";
import {
	CircularProgress,
	Container,
	FormGroup,
	Grid,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import FormTextField from "../_form/FormTextField/index.jsx";
import FormSelect from "../_form/FormSelect/index.jsx";
import { FormDate } from "../_form/FormDate/index.jsx";
import { FormSwitch } from "../_form/FormSwitch/index.jsx";
import { EditContent } from "../EditContent/index.jsx";
import Button from "@mui/material/Button";
import { AddOutlined } from "@mui/icons-material";
import { NotFound } from "../../pages/NotFound/index.jsx";

const PageEditor = () => {
	// console.log(defaultValues);
	const {
		formData,
		fields,
		handleFormSubmit,
		moveDown,
		moveUp,
		remove,
		isLoading,
		userOptions,
		page,
		users,
		user,
		addEmptyContent,
	} = usePageEditor();
	if (isLoading)
		return (
			<Container sx={{ py: 4, flexGrow: 1 }}>
				<Grid
					container
					direction={"row"}
					spacing={5}
					sx={{ alignItems: "stretch" }}
				>
					<Grid
						xs={12}
						item
						sx={{
							display: "flex",
							p: 0,
							m: 0,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<CircularProgress />
					</Grid>
				</Grid>
			</Container>
		);
	else if (!isLoading && (!page || users?.length === 0)) {
		return <NotFound />;
	}
	return (
		<Container>
			<FormProvider {...formData}>
				<form onSubmit={handleFormSubmit}>
					<Stack spacing={3} sx={{ m: 4 }}>
						<Paper elevation={4} sx={{ px: 6, py: 4, borderRadius: 4 }}>
							<Stack spacing={3}>
								<Typography
									variant={"h4"}
									sx={{ fontWeight: 500, alignSelf: "center" }}
								>
									Page details
								</Typography>
								<FormTextField label={"Title"} name={"title"} />
								<FormSelect
									label={"Author"}
									disabled={user.role !== "admin"}
									name={"author"}
									options={userOptions}
								/>
								<FormDate
									disabled={true}
									label={"Creation date"}
									name={"creationDate"}
								/>
								<Stack
									direction={"row"}
									sx={{
										alignItems: "center",
										justifyContent: "space-around",
									}}
								>
									<FormDate
										disabled={!formData.watch("hasPublicationDate")}
										label={"Publication date"}
										name={"publicationDate"}
									/>
									<FormGroup sx={{ ml: 10 }}>
										<FormSwitch name={"hasPublicationDate"} label={"Publish"} />
									</FormGroup>
								</Stack>
							</Stack>
						</Paper>
						<Typography alignSelf={"center"} variant={"h4"}>
							Contents
						</Typography>
						{fields.map((field, index, array) => {
							return (
								<EditContent
									key={field.id}
									name={`contents.${index}`}
									control={formData.control}
									index={index}
									handleRemove={() => remove(index)}
									moveUp={() => moveUp(index)}
									moveDown={() => moveDown(index)}
									isLast={index === array.length - 1}
									isFirst={index === 0}
								/>
							);
						})}
						<Button
							variant="contained"
							color="primary"
							onClick={addEmptyContent}
							startIcon={<AddOutlined />}
							sx={{ maxWidth: "200px", p: 1.5, alignSelf: "center" }}
						>
							Add content
						</Button>
						<Stack
							direction={"row"}
							spacing={3}
							sx={{
								alignSelf: "center",
								pt: 3,
								alignItems: "center",
								width: "100%",
							}}
						>
							<Button
								variant={"contained"}
								type={"submit"}
								color={"secondary"}
								sx={{ flex: 0.5 }}
							>
								Update page
							</Button>
							<Button variant={"outlined"} color={"error"} sx={{ flex: 0.5 }}>
								Cancel
							</Button>
						</Stack>
					</Stack>
				</form>
			</FormProvider>
		</Container>
	);
};
export default PageEditor;
