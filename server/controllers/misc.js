const { promisify } = require("util");
const db = require("../db/connection");
const allQuery = promisify(db.all.bind(db));
const runQuery = promisify(db.run.bind(db));
const yup = require("yup");
const { validateRequest } = require("./utils");

const getWebsiteDetails = async (req, res) => {
	//admin only
	try {
		const data = await allQuery("SELECT * FROM SITE_DETAILS");
		if (!data) {
			throw new Error();
		}
		const resultedObj = data.reduce((acc, curr, arr) => {
			return Object.assign(acc, { [curr.name]: curr.val });
		}, {});
		return res.status(200).json({ siteDetails: resultedObj });
	} catch (e) {
		return res.status(500).json({ error: "Bad Request" });
	}
};

const updateWebsiteName = async (req, res) => {
	try {
		const bodySchema = yup.object({
			name: yup.string().required("Name cannot be empty"),
		});
		const { body, errorMessage, isValidationOk } = validateRequest(req, {
			bodySchema,
		});

		if (!isValidationOk) {
			console.error(errorMessage);
			return res.status(400).json({ error: errorMessage });
		}

		try {
			await runQuery(
				`UPDATE SITE_DETAILS 
       SET val = ? 
       WHERE name = ?  
       `,
				[body.name, "siteName"],
			);
			return res.status(200).json({ name: body.name });
		} catch (e) {
			return res.status(400).json({ error: "Cannot satisfy the request" });
		}
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: "Bad Request" });
	}
};

exports.getWebsiteDetails = getWebsiteDetails;
exports.updateWebsiteName = updateWebsiteName;
