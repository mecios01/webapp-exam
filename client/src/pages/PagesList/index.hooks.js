import { useContext, useEffect, useMemo, useState } from "react";
import { getPages } from "../../apis/pages.js";
import userContext from "../../contexts/userContext.js";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/en";

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
export const usePagesList = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [pages, setPages] = useState([]);
	const { user, currentView } = useContext(userContext);
	const refresh = () => {
		setIsLoading(true);
	};
	useEffect(() => {
		setPages([]);
		setIsLoading(true);
	}, [user]);

	useEffect(() => {
		if (!isLoading) return;
		getPages()
			.then(res => {
				setPages(res);
			})
			.catch(e => {
				console.error(e);
			})
			.finally(() => {
				setInterval(() => setIsLoading(false), 500);
			});
	}, [isLoading]);

	const pagesFiltered = useMemo(() => {
		if (currentView === "FrontOffice") {
			return (
				pages?.filter(el => {
					if (el.publicationDate === null) {
						return false;
					}
					return dayjs.utc(el.publicationDate).isSameOrBefore(Date.now());
				}) ?? []
			);
		}
		return pages;
	}, [pages, currentView]);

	return { pages: pagesFiltered, isLoading, refresh };
};
