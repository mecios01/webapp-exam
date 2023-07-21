import Button from "@mui/material/Button";
import { useToggleOffice } from "./index.hooks.js";

const ToggleOffice = () => {
	const { currentView, toggleView } = useToggleOffice();
	return (
		<Button
			sx={{ border: "1px solid white", color: "#ffffff" }}
			onClick={toggleView}
		>
			{currentView}
		</Button>
	);
};
export default ToggleOffice;
