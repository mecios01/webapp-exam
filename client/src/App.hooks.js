import { useEffect, useState } from "react";
import { getSiteDetails } from "./apis/site.js";
import { checkSession, doLogout } from "./apis/user.js";

export default function useApp() {
	const [user, setUser] = useState(null);
	const [siteName, setSiteName] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [currentView, setCurrentView] = useState("BackOffice");
	const toggleView = () => {
		setCurrentView(prevState =>
			prevState === "FrontOffice" ? "BackOffice" : "FrontOffice",
		);
	};
	useEffect(() => {
		const fetchData = () => {
			getSiteDetails()
				.then(result => {
					setSiteName(result.data.siteDetails.siteName);
				})
				.then(() => {
					return checkSession()
						.then(res => {
							setUser(res);
						})
						.catch(e => {
							console.log("No credentials");
						});
				})
				.catch(error => {
					console.error("Error:", error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		};
		fetchData();
	}, []);

	const handleLogout = () => {
		doLogout().then(() => {
			setUser(null);
		});
	};

	const refreshName = () => {
		getSiteDetails().then(result => {
			setSiteName(result.data.siteDetails.siteName);
		});
	};

	return {
		user,
		setUser,
		siteName,
		handleLogout,
		isLoading,
		refreshName,
		currentView,
		toggleView,
	};
}
