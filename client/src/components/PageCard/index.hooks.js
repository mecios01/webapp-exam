import { useContext } from "react";
import UserContext from "../../contexts/userContext.js";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/en";
import { useConfirm } from "material-ui-confirm";
import { deletePage } from "../../apis/pages.js";

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);

export const usePageCard = (page, refresh) => {
	const { user } = useContext(UserContext);
	const publication = dayjs(page.publicationDate).format("LL");
	const creation = dayjs(page.creationDate).format("LL");

	const confirm = useConfirm();

	const onDelete = () => {
		confirm({
			description: `Deleting page ${page?.title}`,
			title: "Confirm deletion",
		})
			.then(() => {
				console.log(page.id);
				return deletePage(page.id);
			})
			.then(() => {
				console.log("Done");
				refresh();
			})
			.catch(() => {
				console.log("Aborted");
			});
	};
	const status =
		page.publicationDate !== null
			? dayjs(page.publicationDate).isSameOrBefore(dayjs(Date.now()))
				? "Published"
				: "Scheduled"
			: "Draft";
	const color =
		status === "Published"
			? "success"
			: status === "Scheduled"
			? "info"
			: "warning";

	return { publication, creation, user, status, color, onDelete };
};
