import { useContext } from "react";
import UserContext from "../../contexts/userContext.js";

export const useToggleOffice = () => {
	const { currentView, toggleView } = useContext(UserContext);

	return { currentView, toggleView };
};
