import { api } from "./connection.js";

export const getSiteDetails = async () => {
	try {
		return await api.get("/site");
	} catch (e) {
		console.error(e);
		return null;
	}
};

export const editSiteName = async newName => {
	try {
		return await api.put("/site", { name: newName }, { withCredentials: true });
	} catch (e) {
		console.error(e.message);
		return e;
	}
};
