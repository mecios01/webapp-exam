import { FormProvider } from "react-hook-form";
import { Container, FormGroup, Paper, Stack, Typography } from "@mui/material";
import FormTextField from "../../components/_form/FormTextField/index.jsx";
import { useCreatePage } from "./index.hooks.js";
import { FormDate } from "../../components/_form/FormDate/index.jsx";
import { FormSwitch } from "../../components/_form/FormSwitch/index.jsx";
import { EditContent } from "../../components/EditContent/index.jsx";
import Button from "@mui/material/Button";
import { AddOutlined } from "@mui/icons-material";
import FormSelect from "../../components/_form/FormSelect/index.jsx";

export const AddPage = () => {
	const {
		formData,
		fieldArray,
		handleFormSubmit,
		moveDown,
		moveUp,
		remove,
		addEmptyContent,
		authorOptions,
		handleReset,
	} = useCreatePage();
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
									disabled={true}
									name={"author"}
									options={authorOptions}
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
						{fieldArray.fields.map((field, index, array) => {
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
								Create page
							</Button>
							<Button
								variant={"outlined"}
								color={"error"}
								sx={{ flex: 0.5 }}
								onClick={handleReset}
							>
								Reset
							</Button>
						</Stack>
					</Stack>
				</form>
			</FormProvider>
		</Container>
	);
};
