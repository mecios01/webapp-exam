import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getPage } from "../../apis/pages.js";
import userContext from "../../contexts/userContext.js";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/en";

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);

export const usePageView = () => {
	const { pageSlug } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(null);
	const { user, currentView } = useContext(userContext);
	const [isDisplayable, setIsDisplayable] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			if (dayjs.utc(page?.publication_date).isAfter(Date.now())) {
				navigate("/");
			}
		}
	}, [user]);

	useEffect(() => {
		if (currentView === "FrontOffice") {
			if (dayjs.utc(page?.publication_date).isAfter(Date.now())) {
				setIsDisplayable(false);
			}
			setIsDisplayable(true);
		}
		setIsDisplayable(true);
	}, [currentView, page]);

	useEffect(() => {
		if (!isLoading) return;
		getPage(pageSlug)
			.then(res => {
				setPage(res);
			})
			.catch(e => {
				console.log(e);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [isLoading]);

	return { isLoading, page, isDisplayable };
};
