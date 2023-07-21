import { api } from "./connection.js";

export async function checkLogin(username, password) {
	try {
		const response = await api.post(`/session`, {
			username: username,
			password: password,
		});
		if (response.status === 200) {
			return response?.data?.user;
		} else {
			throw new Error("Cannot process the request");
		}
	} catch (error) {
		if (error?.response?.status === 401) {
			throw new Error("Invalid email or password");
		} else throw new Error("Cannot process the request");
	}
}

export async function checkSession() {
	try {
		const response = await api.get(`/session/current`, {
			withCredentials: true,
		});
		if (response.status === 200) {
			return response?.data?.user;
		} else {
			throw new Error("Cannot process the request");
		}
	} catch (error) {
		if (error?.response?.status === 401) {
			throw new Error("Invalid email or password");
		} else throw new Error("Cannot process the request");
	}
}

export async function doLogout() {
	const response = await api.delete("/logout", {
		withCredentials: true,
	});
	if (response.status === 200) {
		return response?.data;
	} else {
		throw new Error("Cannot logout");
	}
}

export async function getAllUsers() {
	try {
		const response = await api.get("/users", {
			withCredentials: true,
		});
		if (response.status === 200) {
			return response?.data.users;
		}
		throw new Error("Cannot process the request");
	} catch (e) {
		throw new Error("Error");
	}
}
