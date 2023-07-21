import { api } from "./connection.js";

export const addNewPage = async data => {
	try {
		const result = await api.post("/pages", data, {
			withCredentials: true,
		});
		if (result.status !== 200) {
			throw new Error(result?.data?.error);
		}
		return result;
	} catch (e) {
		return e.response.data.error;
	}
};

export const getPages = async () => {
	try {
		const result = await api.get("/pages", {
			withCredentials: true,
		});
		return result?.data?.pages;
	} catch (e) {
		return e.response.data.error;
	}
};

export const getPage = async pageSlug => {
	try {
		const result = await api.get(`/pages/${pageSlug}`, {
			withCredentials: true,
		});
		return result?.data?.page;
	} catch (e) {
		throw new Error(e.message);
	}
};

export const updatePage = async (data, pageSlug) => {
	try {
		const result = await api.put(`/pages/${pageSlug}`, data, {
			withCredentials: true,
		});
		if (result.status !== 200) {
			throw new Error(result?.data?.error);
		}
		return result;
	} catch (e) {
		return e.message;
	}
};

export const deletePage = async id => {
	try {
		const result = await api.delete(`/pages/${id}`, {
			withCredentials: true,
		});
		if (result.status !== 200) {
			throw new Error(result?.data?.error);
		}
		return result;
	} catch (e) {
		return e.message;
	}
};
