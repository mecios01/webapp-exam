import { useContext } from "react";
import SiteContext from "../../contexts/siteContext.js";
import UserContext from "../../contexts/userContext.js";

const links = {
	base: [{ name: "Home", href: "/" }],
	user: [{ name: "Add page", href: "/add-page" }],
	admin: [
		{ name: "Add page", href: "/add-page" },
		{ name: "Edit site", href: "/site-name" },
	],
};

export const useNavBar = () => {
	const { siteName } = useContext(SiteContext);
	const { handleLogout, user } = useContext(UserContext);

	return { user, handleLogout, siteName, links };
};
