import { usePageView } from "./index.hooks.js";
import Page from "../../components/Page/index.jsx";
import { Container } from "@mui/material";
import { NotFound } from "../NotFound/index.jsx";

const PageView = () => {
	const { isLoading, page, user, isDisplayable } = usePageView();
	if (isLoading) return <div />;
	if (!isLoading && !page) return <NotFound />;
	if (!isLoading && !user && !isDisplayable) return <NotFound />;
	else
		return (
			<Container sx={{ py: 4 }}>
				<Page isLoading={isLoading} page={page} />
			</Container>
		);
};

export default PageView;
