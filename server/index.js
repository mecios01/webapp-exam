const app = require("./app.js");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;

const runServer = async () => {
	try {
		app.listen(PORT, () => {
			console.log(`Server started on http://localhost:${PORT}/`);
		});
	} catch (e) {
		console.error(e);
	}
};
runServer();
