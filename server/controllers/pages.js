"use strict";
const yup = require("yup");
const db = require("../db/connection");
const { validateRequest } = require("./utils");
const { date } = require("yup");
const dayjs = require("dayjs");
const CustomParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(CustomParseFormat);
const { promisify } = require("util");
const slugify = require("slugify");

const Page = require("../models/page");
const User = require("../models/user");
const runQuery = promisify(db.run.bind(db));
const getInsertId = promisify(
	db.get.bind(db, "SELECT last_insert_rowid() as id"),
);
const getQuery = promisify(db.get.bind(db));

const createPage = async (req, res) => {
	try {
		const bodySchema = yup.object({
			title: yup.string().required(),
			publicationDate: yup
				.mixed()
				.nullable()
				.transform((value, originalValue, schema) => {
					return value ? dayjs.utc(value).utcOffset(0).startOf("day") : null;
				}),
			author: yup.string().required(),
			contents: yup
				.array()
				.of(
					yup.object({
						type: yup
							.string()
							.required("Select a type")
							.oneOf(
								["image", "paragraph", "header"],
								"Select one of the possible options",
							),
						content: yup
							.string()
							.when("type", ([type], schema) =>
								type === "image"
									? schema.required("Choose an image")
									: schema.required("Insert some text"),
							),
					}),
				)
				.test(
					"hasRequiredContents",
					"At least two contents are required with one header and one paragraph or image",
					contents => {
						const headerExists = contents.some(
							content => content.type === "header",
						);
						const paragraphOrImageExists = contents.some(
							content =>
								content.type === "paragraph" || content.type === "image",
						);

						return headerExists && paragraphOrImageExists;
					},
				),
		});

		const { body, errorMessage, isValidationOk } = validateRequest(req, {
			bodySchema,
		});

		if (!isValidationOk) {
			return res.status(400).json({ error: errorMessage });
		}
		//no need to check. It is checked before
		const user = req.user;

		if (user.role !== "admin" && user.email !== body.author) {
			return res.status(400).json({ error: "Bad request" });
		}

		const { title, publicationDate, author, contents } = body;
		const creationDate = dayjs
			.utc()
			.utcOffset(0)
			.startOf("day")
			.toDate()
			.toISOString();

		const pc = await getQuery(
			"SELECT COUNT(*) as count FROM PAGES WHERE title=?",
			[title],
		);
		if (pc.count > 0) {
			return res.status(400).json({ error: "Page already exists" });
		}

		const slug = slugify(title, { lower: true });
		console.log(slug);

		const rollbackTransaction = () => {
			db.run("ROLLBACK", function (err) {
				if (err) {
					console.error(err);
				}
			});
		};
		//start transaction
		try {
			db.serialize(() => {
				try {
					let lastID;
					db.run("BEGIN TRANSACTION", function (err) {
						if (err) {
							console.error(err);
							return res.status(500).json({ error: "Transaction failed." });
						}
						db.get(
							"SELECT id FROM USERS WHERE email=?",
							[author],
							function (err, row) {
								if (err) {
									console.error(err);
									rollbackTransaction();
									return res.status(500).json({ error: "Transaction failed." });
								}
								db.run(
									"INSERT INTO PAGES (title, author, publication_date, creation_date, slug) VALUES (?, ?, ?, ?, ?)",
									[
										title,
										row.id, //id of the author
										publicationDate?.toISOString() ?? null,
										creationDate,
										slug,
									],
									function (err) {
										if (err) {
											console.error(err);
											rollbackTransaction();
											throw err;
										}

										lastID = this.lastID;

										let queryCount = 0;

										contents.forEach((content, index) => {
											db.run(
												"INSERT INTO CONTENTS (type, data, sequence, page) VALUES (?,?,?,?)",
												[content.type, content.content, index, lastID],
												function (err) {
													queryCount++;
													if (err) {
														console.error(err);
														rollbackTransaction();
														throw err;
													}

													if (queryCount === contents.length) {
														db.run("COMMIT", function (err) {
															if (err) {
																console.error(err);
																throw err;
															}
														});
													}
												},
											);
										});
									},
								);
							},
						);
					});
					return res.status(200).json({ data: { id: lastID, slug } });
				} catch (e) {
					return res.status(500).json({ error: "Operation interrupted" });
				}
			});
		} catch (e) {
			console.error(e);
			return res
				.status(400)
				.json({ error: "An error occurred while creating the page" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Error" });
	}
};
const updatePage = async (req, res) => {
	try {
		const bodySchema = yup.object({
			id: yup.number().required("No id provided"),
			title: yup.string().required("Insert a title"),
			author: yup
				.string()
				.required("You must provide an author")
				.test("isUserAllowed", value => {
					if (req.user.role === "admin") {
						return true;
					} else {
						return req.user.email === value;
					}
				}),
			publicationDate: yup
				.mixed()
				.nullable()
				.transform((value, originalValue, schema) => {
					return value ? dayjs.utc(value).utcOffset(0).startOf("day") : null;
				}),
			contents: yup
				.array()
				.of(
					yup.object({
						type: yup
							.string()
							.required("Select a type")
							.oneOf(
								["image", "paragraph", "header"],
								"Select one of the possible options",
							),
						content: yup.string().required("No content provided"),
					}),
				)
				.test(
					"hasRequiredContents",
					"At least two contents are required with one header and one paragraph or image",
					contents => {
						const headerExists = contents.some(
							content => content.type === "header",
						);
						const paragraphOrImageExists = contents.some(
							content =>
								content.type === "paragraph" || content.type === "image",
						);

						return headerExists && paragraphOrImageExists;
					},
				),
		});
		const { errorMessage, isValidationOk, body } = validateRequest(req, {
			bodySchema,
		});

		if (!isValidationOk) {
			console.error(errorMessage);
			return res.status(400).json({ error: "Bad request" });
		}

		const author = await User.findByEmail(body.author);
		if (!author) {
			console.error("Author does not exist");
			return res.status(400).json({ error: "Bad request" });
		}

		const oldPage = await Page.getById(body.id);
		if (!oldPage) {
			console.error("Page does not exist");
			return res.status(400).json({ error: "Bad request" });
		}
		if (
			oldPage.author !== author.id && //author in body is creator of the page
			author.id !== req.user.id && //caller is author of the page
			req.user.role !== "admin" //bypass the procedure (they can change author)
		) {
			console.error("Author mismatch or not authorized");
			return res.status(401).json({ error: "Cannot access resource" });
		}

		const newSlug = slugify(oldPage.title, { lower: true });
		console.log("pageupdate");

		const response = await Page.update({
			id: oldPage.id,
			title: body.title,
			publicationDate: !!body.publicationDate
				? body.publicationDate.toISOString()
				: null,
			author: author.id,
			newSlug,
			contents: body.contents,
		});

		return res.status(200).json({ data: "OK" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

const deletePage = async (req, res) => {
	try {
		const paramsSchema = yup.object({
			id: yup.number().required("No id provided").min(0, "Negative ids?"),
		});
		const { params, errorMessage, isValidationOk } = validateRequest(req, {
			paramsSchema,
		});
		if (!isValidationOk) {
			console.error(errorMessage);
			return res.status(400).json({ error: "Bad request" });
		}
		const page = await Page.getById(params.id);

		if (req.user.role !== "admin" && page.author !== req.user.id) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const result = await Page.deleteById(params.id);
		if (!result) {
			return res.status(400).json({ error: "Cannot perform operation" });
		}
		return res.status(200).json({ message: "OK" });
	} catch (err) {
		res.status(500).json({ error: "Internal server error" });
	}
};

const getPage = async (req, res) => {
	try {
		const paramsSchema = yup.object({
			pageSlug: yup.string().typeError("Bad request").required("Bad request"),
		});
		const { params, errorMessage, isValidationOk } = validateRequest(req, {
			paramsSchema,
		});
		if (!isValidationOk) {
			return res.status(400).json({ error: errorMessage });
		}
		try {
			const row = await Page.getBySlug(req?.user?.role, params?.pageSlug);
			return res.status(200).json({ page: { ...row } });
		} catch (e) {
			console.error(e);
			return res.status(404).json({ error: "Not found" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getPages = async (req, res) => {
	try {
		const response = await Page.getAll(req?.user?.role);
		const edited = response.map(el => {
			return {
				...el,
				author: { name: el?.author_name, email: el?.author_email },
				author_email: undefined,
				author_name: undefined,
			};
		});
		return res.status(200).json({ pages: edited });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.createPage = createPage;
exports.updatePage = updatePage;
exports.deletePage = deletePage;
exports.getPages = getPages;
exports.getPage = getPage;
