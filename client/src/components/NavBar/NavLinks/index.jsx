import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

const NavLinks = ({ links }) => {
	return (
		<>
			{links.map(l => (
				<Link key={l.href} to={l.href}>
					<Button variant={"outlined"} key={l.href} sx={{ color: "#ffffff" }}>
						<Typography variant={"h6"} color={"secondary.contrastText"}>
							{l.name}
						</Typography>
					</Button>
				</Link>
			))}
		</>
	);
};

export default NavLinks;
