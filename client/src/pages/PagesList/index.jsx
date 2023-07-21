import { usePagesList } from "./index.hooks.js";
import {
	CircularProgress,
	Container,
	Grid,
	Stack,
	Typography,
} from "@mui/material";
import PageCard from "../../components/PageCard/index.jsx";

const PagesList = () => {
	const { pages, isLoading, refresh } = usePagesList();
	return (
		<Container sx={{ py: 4, flexGrow: 1 }}>
			<Grid
				container
				direction={"row"}
				spacing={5}
				sx={{ alignItems: "stretch" }}
			>
				{isLoading && (
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
				)}
				{!isLoading &&
					pages?.map((el, index) => {
						return (
							<Grid xs={12} md={6} key={index} item>
								<PageCard page={el} refresh={refresh} />
							</Grid>
						);
					})}
				{!isLoading && pages?.length === 0 && (
					<Stack
						sx={{
							flexGrow: 1,
							alignItems: "center",
							p: 20,
						}}
					>
						<Typography variant={"h5"}>No pages available yet :(</Typography>
					</Stack>
				)}
			</Grid>
		</Container>
	);
};
export default PagesList;
