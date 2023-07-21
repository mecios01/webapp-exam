import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import Login from "./pages/Login/index.jsx";
import useApp from "./App.hooks.js";
import UserContext from "./contexts/userContext.js";
import SiteContext from "./contexts/siteContext.js";
import theme from "./theme.js";
import { ThemeProvider } from "@mui/material";
import { NotFound } from "./pages/NotFound/index.jsx";
import { AddPage } from "./pages/AddPage/index.jsx";
import ProtectedRoute from "./pages/ProtectedPage/index.jsx";
import PagesList from "./pages/PagesList/index.jsx";
import PageView from "./pages/PageView/index.jsx";
import PageEditor from "./components/PageEditor/index.jsx";
import EditSiteName from "./pages/EditSiteName/index.jsx";

function App() {
	const {
		user,
		setUser,
		siteName,
		handleLogout,
		isLoading,
		refreshName,
		currentView,
		toggleView,
	} = useApp();
	return (
		<Router>
			<UserContext.Provider
				value={{ user, handleLogout, currentView, toggleView }}
			>
				<SiteContext.Provider value={{ siteName, refreshName }}>
					<ThemeProvider theme={theme}>
						<Routes>
							<Route element={<PageWrapper isLoading={isLoading} />}>
								<Route path={"/"} index element={<PagesList />} />
								<Route
									path={"/add-page"}
									element={
										<ProtectedRoute>
											<AddPage />
										</ProtectedRoute>
									}
								/>
								<Route path={"/pages/:pageSlug"} element={<PageView />} />
								<Route
									path={"/edit/page/:pageSlug"}
									element={
										<ProtectedRoute>
											<PageEditor />
										</ProtectedRoute>
									}
								/>
								<Route
									path={"/site-name"}
									element={
										<ProtectedRoute>
											<EditSiteName />
										</ProtectedRoute>
									}
								/>
								<Route path={"/login"} element={<Login setUser={setUser} />} />
								<Route path={"*"} element={<NotFound />} />
							</Route>
						</Routes>
					</ThemeProvider>
				</SiteContext.Provider>
			</UserContext.Provider>
		</Router>
	);
}

export default App;
