import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/en";

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
export const usePage = page => {
	const publication = dayjs(page.publicationDate).format("LL");
	const creation = dayjs(page.creationDate).format("LL");
	return { publication, creation };
};
