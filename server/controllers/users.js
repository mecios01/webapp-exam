const user = require("../models/user");
const getAllUsers = async (req, res) => {
	try {
		const users = await user.findAll();
		console.log(users);
		return res.status(200).json({ users });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: "Internal error" });
	}
};
exports.getAllUsers = getAllUsers;
