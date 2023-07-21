import { styled } from "@mui/material";
import { MaterialDesignContent } from "notistack";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
	"&.notistack-MuiContent-success": {
		backgroundColor: "#1ba131",
		fontSize: "18px",
	},
	"&.notistack-MuiContent-error": {
		backgroundColor: "#c50808",
		fontSize: "18px",
	},
	"&.notistack-MuiContent-warning": {
		backgroundColor: "#ffcc00",
		fontSize: "18px",
	},
	"&.notistack-MuiContent-info": {
		backgroundColor: "#3d85c6",
		fontSize: "18px",
	},
}));

export default function usePageWrapper() {
	return {
		StyledMaterialDesignContent,
	};
}
